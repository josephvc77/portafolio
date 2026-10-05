import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Fog,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshBasicMaterial,
  OctahedronGeometry,
  Plane,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import type { Capabilities } from '../../core/capabilities';
import { clamp, damp, easeOutExpo, lerp, smoothstep } from '../core/math';
import { budgetFor, type QualityBudget } from '../core/quality';
import { Stage } from '../core/stage';
import { onSceneThemeChange, readSceneTheme, type SceneTheme } from '../core/theme';
import { buildArchitecture, type ArchitectureSpec, type NodeKind } from './architecture';
import { Pulses } from './pulses';

const BASE_SPACING = 1.15;
const EXPLODED_SPACING = 2.5;
const NODE_SIZE = 0.058;
/** Footprint of the system at scale 1 (x span, stacked height) — used for framing. */
const SYSTEM_WIDTH = 6.6;
const SYSTEM_HEIGHT = 4.2;
const CAMERA = { y: 5.6, z: 9.6 }; // ≈30° elevation: panels read as windows, layers as a stack
const ASSEMBLE_SECONDS = 1.9;
const HOVER_RADIUS = 0.85;

interface LayerView {
  group: Group;
  level: number;
  mesh: InstancedMesh;
  lines: LineSegments;
  kinds: NodeKind[];
  /** Current hover influence per node, smoothed. */
  hover: Float32Array;
}

/**
 * Hero: the three-tier system (interface → services → data) assembling on load,
 * leaning toward the cursor, and separating into an exploded diagram on scroll.
 */
export class HeroScene {
  private readonly stage: Stage;
  private readonly budget: QualityBudget;
  private readonly spec: ArchitectureSpec;
  private readonly system = new Group();
  private readonly layers: LayerView[] = [];
  private readonly links: LineSegments;
  private readonly linkPositions: Float32Array;
  private readonly pulses: Pulses | null;
  private readonly nodeMaterial = new MeshBasicMaterial({ transparent: true, toneMapped: false });
  private readonly lineMaterial = new LineBasicMaterial({ transparent: true, toneMapped: false });
  private readonly linkMaterial = new LineBasicMaterial({ transparent: true, toneMapped: false });
  private theme: SceneTheme;
  private readonly cleanups: (() => void)[] = [];

  // Live state
  private spacing = 0;
  private pointer = new Vector2(0, 0);
  private pointerSmoothed = new Vector2(0, 0);
  private pointerActive = false;
  private scrollProgress = 0;
  private heroTop = 0;
  private heroHeight = 1;
  private framing = { x: 0, y: 0, scale: 1 };

  // Scratch objects — never allocate inside the frame loop.
  private readonly matrix = new Matrix4();
  private readonly quaternion = new Quaternion();
  private readonly scaleVec = new Vector3();
  private readonly position = new Vector3();
  private readonly raycaster = new Raycaster();
  private readonly plane = new Plane(new Vector3(0, 1, 0), 0);
  private readonly hit = new Vector3();
  private readonly mixColor = new Color();
  private readonly ends = { ax: 0, ay: 0, az: 0, bx: 0, by: 0, bz: 0 };

  constructor(
    private readonly container: HTMLElement,
    private readonly caps: Capabilities,
  ) {
    this.budget = budgetFor(caps);
    this.spec = buildArchitecture(this.budget);
    this.theme = readSceneTheme();

    this.stage = new Stage({
      container,
      maxDpr: caps.maxDpr,
      antialias: this.budget.antialias,
      fps: this.budget.fps,
    });

    const { scene } = this.stage;
    scene.add(this.system);
    this.system.rotation.y = -0.55;

    const nodeGeometry = new OctahedronGeometry(NODE_SIZE, 0);
    this.spec.layers.forEach((layer) => {
      const group = new Group();
      const mesh = new InstancedMesh(nodeGeometry, this.nodeMaterial, layer.nodes.length);
      mesh.instanceMatrix.setUsage(DynamicDrawUsage);
      const lineGeometry = new BufferGeometry();
      lineGeometry.setAttribute('position', new Float32BufferAttribute(layer.lines, 3));
      const lines = new LineSegments(lineGeometry, this.lineMaterial);
      group.add(lines, mesh);
      this.system.add(group);
      this.layers.push({
        group,
        level: layer.level,
        mesh,
        lines,
        kinds: layer.nodes.map((n) => n.kind),
        hover: new Float32Array(layer.nodes.length),
      });
    });

    this.linkPositions = new Float32Array(this.spec.links.length * 6);
    const linkGeometry = new BufferGeometry();
    linkGeometry.setAttribute('position', new BufferAttribute(this.linkPositions, 3).setUsage(DynamicDrawUsage));
    this.links = new LineSegments(linkGeometry, this.linkMaterial);
    this.links.frustumCulled = false;
    this.system.add(this.links);

    this.pulses =
      this.budget.pulses > 0 && !caps.reducedMotion
        ? new Pulses(this.budget.pulses, this.spec.links.length, (i, out) => this.linkEnds(i, out), this.stage.renderer.getPixelRatio())
        : null;
    if (this.pulses) this.system.add(this.pulses.points);

    this.applyTheme(this.theme);
    this.cleanups.push(onSceneThemeChange((theme) => this.applyTheme(theme)));

    this.stage.onResize = (width, height) => this.frame(width, height);
    this.stage.onFrame = (delta, elapsed) => this.update(delta, elapsed);
    this.stage.onContextLost = () => container.classList.remove('is-live');
    this.frame(this.stage.size.width, this.stage.size.height);

    this.bindInput();

    if (caps.reducedMotion) {
      // One composed still frame — the system, fully assembled. No loop.
      this.spacing = BASE_SPACING;
      this.stage.renderOnce();
    } else {
      this.stage.start();
    }
    requestAnimationFrame(() => container.classList.add('is-live'));
  }

  dispose(): void {
    this.cleanups.forEach((fn) => fn());
    this.stage.dispose();
    this.container.classList.remove('is-live');
  }

  /** Stop animating and leave a still frame (reduced motion switched on mid-visit). */
  freeze(): void {
    this.stage.stop();
    this.spacing = BASE_SPACING;
    this.scrollProgress = 0;
    this.stage.renderOnce();
  }

  // ---------------------------------------------------------------------------

  private applyTheme(theme: SceneTheme): void {
    this.theme = theme;
    this.stage.scene.fog = new Fog(theme.fog, 10, 21);
    this.lineMaterial.color.copy(theme.line);
    this.linkMaterial.color.copy(theme.accent);
    this.nodeMaterial.color.set(0xffffff); // tint comes from per-instance colour
    this.pulses?.setTheme(theme.accent, theme.live, theme.blending);
    this.layers.forEach((layer) => this.paintLayer(layer));
    if (this.caps.reducedMotion) this.stage.renderOnce();
  }

  private baseColor(kind: NodeKind): Color {
    switch (kind) {
      case 'anchor':
      case 'hub':
        return this.theme.accent;
      case 'chrome':
      case 'record':
        return this.theme.line;
      default:
        return this.theme.node;
    }
  }

  private paintLayer(layer: LayerView): void {
    layer.kinds.forEach((kind, i) => {
      this.mixColor.copy(this.baseColor(kind)).lerp(this.theme.accent, layer.hover[i]);
      layer.mesh.setColorAt(i, this.mixColor);
    });
    if (layer.mesh.instanceColor) layer.mesh.instanceColor.needsUpdate = true;
  }

  /**
   * Composition per viewport, derived from what the camera actually sees:
   * wide screens — the system fills the right ~45% beside the copy;
   * narrow screens — it sits in the band above the copy.
   */
  private frame(width: number, height: number): void {
    const aspect = width / height;
    const distance = Math.hypot(CAMERA.y, CAMERA.z);
    const visibleH = 2 * distance * Math.tan((this.stage.camera.fov * Math.PI) / 360);
    const visibleW = visibleH * aspect;

    if (aspect > 1.15) {
      // Bleeds off the right edge on purpose: an editorial crop that keeps the copy column clear.
      const scale = Math.min((visibleW * 0.5) / SYSTEM_WIDTH, (visibleH * 0.62) / SYSTEM_HEIGHT);
      this.framing = { x: visibleW * 0.3, y: -visibleH * 0.02, scale };
    } else {
      // Centred in the band the CSS reserves above the copy (header + 28svh).
      const scale = Math.min((visibleW * 0.95) / SYSTEM_WIDTH, (visibleH * 0.24) / SYSTEM_HEIGHT);
      this.framing = { x: 0, y: visibleH * 0.335, scale };
    }

    const hero = this.container.closest<HTMLElement>('.hero');
    if (hero) {
      this.heroTop = hero.offsetTop;
      this.heroHeight = Math.max(1, hero.offsetHeight);
    }
  }

  private bindInput(): void {
    const onScroll = () => {
      this.scrollProgress = clamp((window.scrollY - this.heroTop) / (this.heroHeight * 0.85));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    this.cleanups.push(() => window.removeEventListener('scroll', onScroll));

    if (!this.budget.interactive) return;

    const onPointer = (event: PointerEvent) => {
      const rect = this.stage.renderer.domElement.getBoundingClientRect();
      this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      this.pointerActive = true;
    };
    const onLeave = () => {
      this.pointerActive = false;
      this.pointer.set(0, 0);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    this.cleanups.push(() => {
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    });
  }

  /** Endpoints of link i in system space, using the live layer spacing. */
  private linkEnds(i: number, out: { ax: number; ay: number; az: number; bx: number; by: number; bz: number }): void {
    const link = this.spec.links[i];
    const a = this.spec.layers[link.from.layer];
    const b = this.spec.layers[link.to.layer];
    const na = a.nodes[link.from.node];
    const nb = b.nodes[link.to.node];
    out.ax = na.x;
    out.ay = a.level * this.spacing;
    out.az = na.z;
    out.bx = nb.x;
    out.by = b.level * this.spacing;
    out.bz = nb.z;
  }

  private update(delta: number, elapsed: number): void {
    const reduced = this.caps.reducedMotion;
    const assemble = reduced ? 1 : easeOutExpo(clamp((elapsed - 0.15) / ASSEMBLE_SECONDS));
    const explode = smoothstep(0.05, 0.9, this.scrollProgress);
    this.spacing = lerp(0, lerp(BASE_SPACING, EXPLODED_SPACING, explode), assemble);

    // Fade the system out as the hero leaves; ease it in during assembly.
    const visibility = assemble * (1 - smoothstep(0.55, 1, this.scrollProgress));
    this.nodeMaterial.opacity = 0.95 * visibility;
    this.lineMaterial.opacity = 0.6 * visibility;
    this.linkMaterial.opacity = (this.theme.dark ? 0.55 : 0.5) * visibility;
    if (this.pulses) {
      this.pulses.opacity = visibility;
      this.pulses.update(delta);
    }

    // Composition + gentle idle sway (no continuous spin — the composition stays stable).
    const { framing } = this;
    this.system.position.set(framing.x, framing.y + explode * 0.6 * framing.scale, 0);
    this.system.scale.setScalar(framing.scale);
    this.system.rotation.y = -0.55 + (reduced ? 0 : Math.sin(elapsed * 0.12) * 0.08) + explode * 0.25;

    // Camera leans toward the cursor.
    const k = damp(3, delta || 1);
    this.pointerSmoothed.lerp(this.pointer, k);
    const camera = this.stage.camera;
    camera.position.set(this.pointerSmoothed.x * 0.9, CAMERA.y + this.pointerSmoothed.y * 0.5 + explode * 0.8, CAMERA.z);
    camera.lookAt(0, 0, 0);

    for (const layer of this.layers) layer.group.position.y = layer.level * this.spacing;
    this.updateLinks();
    this.updateNodes(delta);
  }

  private updateLinks(): void {
    const { ends, linkPositions: out } = this;
    for (let i = 0; i < this.spec.links.length; i++) {
      this.linkEnds(i, ends);
      const o = i * 6;
      out[o] = ends.ax;
      out[o + 1] = ends.ay;
      out[o + 2] = ends.az;
      out[o + 3] = ends.bx;
      out[o + 4] = ends.by;
      out[o + 5] = ends.bz;
    }
    this.links.geometry.attributes.position.needsUpdate = true;
  }

  private updateNodes(delta: number): void {
    // Hover: project the pointer onto the interface layer and light nearby components.
    const top = this.layers[0];
    let hasHit = false;
    if (this.pointerActive && this.budget.interactive) {
      top.group.updateWorldMatrix(true, false);
      this.raycaster.setFromCamera(this.pointer, this.stage.camera);
      this.position.setFromMatrixPosition(top.group.matrixWorld);
      this.plane.constant = -this.position.y; // system only rotates about Y, so the normal stays up
      hasHit = !!this.raycaster.ray.intersectPlane(this.plane, this.hit);
      if (hasHit) top.group.worldToLocal(this.hit);
    }

    const k = damp(8, delta || 1);
    for (let l = 0; l < this.layers.length; l++) {
      const layer = this.layers[l];
      const spec = this.spec.layers[l];
      let colorsDirty = false;
      spec.nodes.forEach((node, i) => {
        let target = 0;
        if (layer === top && hasHit) target = smoothstep(HOVER_RADIUS, 0, Math.hypot(node.x - this.hit.x, node.z - this.hit.z));
        const next = layer.hover[i] + (target - layer.hover[i]) * k;
        if (Math.abs(next - layer.hover[i]) > 0.002) colorsDirty = true;
        layer.hover[i] = next;

        this.position.set(node.x, next * 0.18, node.z); // lit nodes lift slightly off their layer
        this.scaleVec.setScalar(node.scale * (1 + next * 0.9));
        this.matrix.compose(this.position, this.quaternion, this.scaleVec);
        layer.mesh.setMatrixAt(i, this.matrix);
      });
      layer.mesh.instanceMatrix.needsUpdate = true;
      if (colorsDirty) this.paintLayer(layer);
    }
  }
}
