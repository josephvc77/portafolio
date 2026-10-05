import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  Fog,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshBasicMaterial,
  OctahedronGeometry,
  Quaternion,
  Vector3,
} from 'three';
import type { Capabilities } from '../../core/capabilities';
import { readStackData } from '../../sections/stack/data';
import { stackStore } from '../../sections/stack/store';
import { damp } from '../core/math';
import { budgetFor } from '../core/quality';
import { Stage } from '../core/stage';
import { onSceneThemeChange, readSceneTheme, type SceneTheme } from '../core/theme';
import { layoutStack, type StackLayout } from './layout';

const NODE_SIZE = 0.06;
const IDLE_SPIN = 0.07; // rad/s while nothing is selected
const PICK_RADIUS_PX = 22;
const MAX_LABELS = 14;
const LABEL_CHAR_PX = 6.6; // Geist Mono at --text-2xs
const LABEL_H = 18;

/**
 * Stack constellation: domains orbit as clusters; edges are real "works with"
 * relationships. Mirrors the chip list through `stackStore` and also accepts
 * direct pointer picking (screen-space, no raycaster).
 */
export class StackScene {
  private readonly stage: Stage;
  private readonly layout: StackLayout;
  private readonly system = new Group();
  private readonly nodes: InstancedMesh;
  private readonly baseEdges: LineSegments;
  private readonly hotEdges: LineSegments;
  private readonly hotPositions: Float32Array;
  private readonly nodeMaterial = new MeshBasicMaterial({ transparent: true, toneMapped: false });
  private readonly baseEdgeMaterial = new LineBasicMaterial({ transparent: true, toneMapped: false });
  private readonly hotEdgeMaterial = new LineBasicMaterial({ transparent: true, toneMapped: false });
  private readonly labelsRoot: HTMLElement;
  private readonly groupLabels: HTMLElement[] = [];
  private readonly nodeLabels: HTMLElement[] = [];
  private readonly cleanups: (() => void)[] = [];
  private theme: SceneTheme;

  /** 0 = dimmed, 1 = normal, 2 = related, 3 = active — smoothed per node. */
  private readonly level: Float32Array;
  private readonly targetLevel: Float32Array;
  private readonly projected: Float32Array; // screen x, y, depth per node
  private active: number | null = null;
  private highlighted: number[] = [];
  private rotation = 0;
  private targetRotation: number | null = null;
  private hovered: number | null = null;
  private frontOffset = 0;
  private readonly placedBoxes: { x: number; y: number; w: number }[] = [];
  private reduced: boolean;
  private readonly labelText: Map<string, string>;

  private readonly matrix = new Matrix4();
  private readonly quaternion = new Quaternion();
  private readonly scaleVec = new Vector3();
  private readonly position = new Vector3();
  private readonly color = new Color();

  constructor(private readonly container: HTMLElement, caps: Capabilities) {
    const source = readStackData();
    if (!source) throw new Error('stack data missing');
    this.layout = layoutStack(source.data);
    this.labelText = new Map(source.data.techs.map((tech) => [tech.id, tech.label]));
    this.reduced = caps.reducedMotion;
    this.theme = readSceneTheme();
    const budget = budgetFor(caps);

    this.stage = new Stage({ container, maxDpr: caps.maxDpr, antialias: budget.antialias, fps: budget.fps });
    this.stage.scene.add(this.system);

    const count = this.layout.nodes.length;
    this.level = new Float32Array(count).fill(1);
    this.targetLevel = new Float32Array(count).fill(1);
    this.projected = new Float32Array(count * 3);

    this.nodes = new InstancedMesh(new OctahedronGeometry(NODE_SIZE, 0), this.nodeMaterial, count);
    this.nodes.instanceMatrix.setUsage(DynamicDrawUsage);

    const basePositions = new Float32Array(this.layout.edges.length * 6);
    this.layout.edges.forEach(([a, b], i) => {
      const na = this.layout.nodes[a];
      const nb = this.layout.nodes[b];
      basePositions.set([na.x, na.y, na.z, nb.x, nb.y, nb.z], i * 6);
    });
    const baseGeometry = new BufferGeometry();
    baseGeometry.setAttribute('position', new BufferAttribute(basePositions, 3));
    this.baseEdges = new LineSegments(baseGeometry, this.baseEdgeMaterial);

    this.hotPositions = new Float32Array(this.layout.edges.length * 6);
    const hotGeometry = new BufferGeometry();
    hotGeometry.setAttribute('position', new BufferAttribute(this.hotPositions, 3).setUsage(DynamicDrawUsage));
    hotGeometry.setDrawRange(0, 0);
    this.hotEdges = new LineSegments(hotGeometry, this.hotEdgeMaterial);
    this.hotEdges.frustumCulled = false;

    this.system.add(this.baseEdges, this.hotEdges, this.nodes);

    this.labelsRoot = container.querySelector<HTMLElement>('[data-stack-labels]') ?? container;
    this.createLabels();

    this.applyTheme(this.theme);
    this.cleanups.push(onSceneThemeChange((theme) => this.applyTheme(theme)));
    this.cleanups.push(stackStore.subscribe((id) => this.select(id)));
    this.bindPointer();

    this.stage.onResize = (width, height) => this.frame(width, height);
    this.stage.onFrame = (delta) => this.update(delta);
    this.stage.onContextLost = () => container.classList.remove('is-live');
    this.frame(this.stage.size.width, this.stage.size.height);

    if (this.reduced) this.stage.renderOnce();
    else this.stage.start();
    requestAnimationFrame(() => container.classList.add('is-live'));
  }

  /** Reduced motion switched on mid-visit: stop spinning, keep an accurate still. */
  freeze(): void {
    this.reduced = true;
    this.stage.stop();
    this.renderStill();
  }

  dispose(): void {
    this.cleanups.forEach((fn) => fn());
    this.stage.dispose();
    this.labelsRoot.replaceChildren();
    this.container.classList.remove('is-live');
  }

  // ---------------------------------------------------------------------------

  private createLabels(): void {
    for (const group of this.layout.groups) {
      const label = document.createElement('span');
      label.className = 'stack-label stack-label--group';
      label.textContent = group.label;
      this.labelsRoot.append(label);
      this.groupLabels.push(label);
    }
    for (let i = 0; i < MAX_LABELS; i++) {
      const label = document.createElement('span');
      label.className = 'stack-label';
      this.labelsRoot.append(label);
      this.nodeLabels.push(label);
    }
  }

  private applyTheme(theme: SceneTheme): void {
    this.theme = theme;
    this.stage.scene.fog = new Fog(theme.fog, 7, 13);
    this.baseEdgeMaterial.color.copy(theme.line);
    this.hotEdgeMaterial.color.copy(theme.accent);
    this.hotEdgeMaterial.blending = theme.blending;
    this.hotEdgeMaterial.needsUpdate = true;
    if (this.reduced) this.renderStill();
  }

  /**
   * The stage keeps a 5:4 / 4:3 aspect at every size, so composition keys off its
   * width: compact stages (phones) frame the ring tighter and need no offset, because
   * the detail panel only overlays the stage on wide layouts.
   */
  private frame(width: number, _height: number): void {
    const camera = this.stage.camera;
    const compact = width < 560;
    camera.position.set(compact ? 0 : -0.25, compact ? 2.7 : 3.1, compact ? 7.2 : 10.2);
    camera.lookAt(compact ? 0 : -0.25, compact ? -0.15 : -0.4, 0);
    this.frontOffset = compact ? 0 : 0.6;
  }

  private select(id: string | null): void {
    const { index, edges } = this.layout;
    this.active = id ? (index.get(id) ?? null) : null;

    const related = new Set<number>();
    let hot = 0;
    if (this.active !== null) {
      for (const [a, b] of edges) {
        if (a !== this.active && b !== this.active) continue;
        related.add(a === this.active ? b : a);
        const na = this.layout.nodes[a];
        const nb = this.layout.nodes[b];
        this.hotPositions.set([na.x, na.y, na.z, nb.x, nb.y, nb.z], hot * 6);
        hot++;
      }
    }
    this.hotEdges.geometry.setDrawRange(0, hot * 2);
    this.hotEdges.geometry.attributes.position.needsUpdate = true;

    for (let i = 0; i < this.targetLevel.length; i++) {
      this.targetLevel[i] = this.active === null ? 1 : i === this.active ? 3 : related.has(i) ? 2 : 0;
    }
    this.highlighted = this.active === null ? [] : [this.active, ...related].slice(0, MAX_LABELS);

    // Bring the active technology round to the front (shortest path).
    if (this.active !== null) {
      const node = this.layout.nodes[this.active];
      // Front-right on wide layouts so the selection never sits under the detail panel (bottom-left).
      const desired = Math.atan2(-node.x, node.z) + this.frontOffset;
      const twoPi = Math.PI * 2;
      const diff = ((((desired - this.rotation) % twoPi) + twoPi * 1.5) % twoPi) - Math.PI;
      this.targetRotation = this.rotation + diff;
    } else {
      this.targetRotation = null;
    }

    if (this.reduced) this.renderStill();
  }

  private renderStill(): void {
    this.level.set(this.targetLevel);
    if (this.targetRotation !== null) this.rotation = this.targetRotation;
    this.stage.renderOnce();
  }

  private bindPointer(): void {
    const canvas = this.stage.renderer.domElement;
    const pick = (event: PointerEvent): number | null => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let best: number | null = null;
      let bestDist = PICK_RADIUS_PX;
      for (let i = 0; i < this.layout.nodes.length; i++) {
        if (this.projected[i * 3 + 2] > 1) continue; // behind camera
        const d = Math.hypot(this.projected[i * 3] - x, this.projected[i * 3 + 1] - y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      return best;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const hit = pick(event);
      if (hit === this.hovered) return;
      this.hovered = hit;
      canvas.style.cursor = hit === null ? '' : 'pointer';
      stackStore.preview(hit === null ? null : this.layout.nodes[hit].id);
    };
    const onLeave = () => {
      this.hovered = null;
      canvas.style.cursor = '';
      stackStore.preview(null);
    };
    const onClick = (event: PointerEvent) => {
      const hit = pick(event);
      if (hit !== null) stackStore.pin(this.layout.nodes[hit].id);
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', onClick as EventListener);
    this.cleanups.push(() => {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick as EventListener);
    });
  }

  private update(delta: number): void {
    const k = this.reduced || delta === 0 ? 1 : damp(6, delta);

    if (this.targetRotation !== null) this.rotation += (this.targetRotation - this.rotation) * (this.reduced ? 1 : damp(2.5, delta));
    else if (!this.reduced && this.hovered === null) this.rotation += IDLE_SPIN * delta;
    this.system.rotation.y = this.rotation;

    // Opacity per state is expressed through colour toward the fog (one material, one draw call).
    const { node, accent, live, fog } = this.theme;
    for (let i = 0; i < this.layout.nodes.length; i++) {
      this.level[i] += (this.targetLevel[i] - this.level[i]) * k;
      const level = this.level[i];
      const spec = this.layout.nodes[i];

      if (level <= 1) this.color.copy(fog).lerp(node, 0.45 + level * 0.55); // dimmed stays legible as structure
      else if (level <= 2) this.color.copy(node).lerp(accent, level - 1);
      else this.color.copy(accent).lerp(live, level - 2);
      this.nodes.setColorAt(i, this.color);

      this.position.set(spec.x, spec.y, spec.z);
      this.scaleVec.setScalar(spec.scale * (1 + Math.max(0, level - 1) * 0.35));
      this.matrix.compose(this.position, this.quaternion, this.scaleVec);
      this.nodes.setMatrixAt(i, this.matrix);
    }
    this.nodes.instanceMatrix.needsUpdate = true;
    if (this.nodes.instanceColor) this.nodes.instanceColor.needsUpdate = true;

    const dimmed = this.active !== null;
    this.nodeMaterial.opacity = 1;
    this.baseEdgeMaterial.opacity = dimmed ? 0.12 : 0.3;
    this.hotEdgeMaterial.opacity = 0.9;

    this.updateLabels();
  }

  /** Project nodes to screen space (for picking) and position the HTML labels. */
  private updateLabels(): void {
    const { width, height } = this.stage.size;
    const camera = this.stage.camera;
    this.system.updateMatrixWorld();

    for (let i = 0; i < this.layout.nodes.length; i++) {
      const spec = this.layout.nodes[i];
      this.position.set(spec.x, spec.y, spec.z).applyMatrix4(this.system.matrixWorld).project(camera);
      this.projected[i * 3] = (this.position.x * 0.5 + 0.5) * width;
      this.projected[i * 3 + 1] = (-this.position.y * 0.5 + 0.5) * height;
      this.projected[i * 3 + 2] = this.position.z;
    }

    this.layout.groups.forEach((group, g) => {
      this.position.set(group.x, group.y, group.z).applyMatrix4(this.system.matrixWorld);
      const depth = this.position.z; // +z faces the camera
      this.position.project(camera);
      const label = this.groupLabels[g];
      label.style.transform = `translate(${(this.position.x * 0.5 + 0.5) * width}px, ${(-this.position.y * 0.5 + 0.5) * height}px) translate(-50%, -100%)`;
      // Domain labels orient the idle ring; they step aside while a selection tells its own story.
      label.style.opacity = this.active === null ? String(Math.max(0, Math.min(1, 0.35 + (depth + 1.5) / 3))) : '0';
    });

    // Greedy de-overlap: active label first, then neighbours nudged down until clear.
    const placed = this.placedBoxes;
    placed.length = 0;
    this.nodeLabels.forEach((label, slot) => {
      const i = this.highlighted[slot];
      if (i === undefined) {
        label.hidden = true;
        return;
      }
      label.hidden = false;
      const text = this.labelText.get(this.layout.nodes[i].id) ?? '';
      if (label.textContent !== text) label.textContent = text;
      label.classList.toggle('is-active', i === this.active);

      const w = text.length * LABEL_CHAR_PX + 12;
      const x = Math.min(Math.max(this.projected[i * 3] - w / 2, 4), width - w - 4); // keep inside the stage
      let y = this.projected[i * 3 + 1] + (i === this.active ? -LABEL_H - 14 : 12);
      for (let tries = 0; tries < 4; tries++) {
        const hit = placed.find((b) => x < b.x + b.w && x + w > b.x && y < b.y + LABEL_H && y + LABEL_H > b.y);
        if (!hit) break;
        y = hit.y + LABEL_H + 2;
      }
      placed.push({ x, y, w });
      label.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
}
