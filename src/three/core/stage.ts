import { Material, Mesh, PerspectiveCamera, Scene, WebGLRenderer, type Object3D } from 'three';
import { latest } from '../../core/dom';

export interface StageOptions {
  /** Element the canvas is appended to; its size drives the renderer size. */
  container: HTMLElement;
  maxDpr: number;
  antialias: boolean;
  /** Frame-rate cap; lower tiers render at 30. */
  fps?: number;
  fov?: number;
}

/**
 * Shared WebGL plumbing for every scene: renderer, camera, resize, and a frame
 * loop that only runs while the stage is on screen and the tab is visible.
 * Scenes plug in through `onFrame` / `onResize` and never own a rAF loop.
 */
export class Stage {
  readonly renderer: WebGLRenderer;
  readonly scene = new Scene();
  readonly camera: PerspectiveCamera;

  onFrame: (delta: number, elapsed: number) => void = () => {};
  onResize: (width: number, height: number) => void = () => {};
  onContextLost: () => void = () => {};

  /** Seconds of *visible* running time — paused time never counts, so intros can't be skipped. */
  private elapsed = 0;
  private lastTimestamp: number | null = null;
  private readonly minFrameTime: number;
  private readonly cleanups: (() => void)[] = [];
  private frameId = 0;
  private accumulator = 0;
  private wanted = false;
  private onScreen = true;
  private width = 1;
  private height = 1;

  constructor(private readonly options: StageOptions) {
    this.renderer = new WebGLRenderer({
      antialias: options.antialias,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, options.maxDpr));
    this.renderer.setClearColor(0x000000, 0);

    const canvas = this.renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'stage-canvas';
    options.container.append(canvas);

    this.camera = new PerspectiveCamera(options.fov ?? 35, 1, 0.1, 100);
    this.minFrameTime = options.fps ? 1 / options.fps : 0;

    this.observeSize();
    this.observeVisibility();

    const lost = (event: Event) => {
      event.preventDefault();
      this.stop();
      this.onContextLost();
    };
    canvas.addEventListener('webglcontextlost', lost);
    this.cleanups.push(() => canvas.removeEventListener('webglcontextlost', lost));
  }

  get size(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /** Request continuous rendering (actually runs only while visible). */
  start(): void {
    this.wanted = true;
    this.resume();
  }

  stop(): void {
    this.wanted = false;
    this.pause();
  }

  /** Single frame — used for reduced motion and theme changes while paused. */
  renderOnce(): void {
    this.onFrame(0, this.elapsed);
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.stop();
    this.cleanups.forEach((fn) => fn());
    disposeTree(this.scene);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private resume(): void {
    if (!this.wanted || !this.onScreen || document.hidden || this.frameId) return;
    this.lastTimestamp = null;
    const tick = (timestamp: number) => {
      this.frameId = requestAnimationFrame(tick);
      const delta = this.lastTimestamp === null ? 0 : Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
      this.lastTimestamp = timestamp;
      this.elapsed += delta;
      this.accumulator += delta;
      if (this.accumulator < this.minFrameTime) return;
      const step = this.accumulator;
      this.accumulator = 0;
      this.onFrame(step, this.elapsed);
      this.renderer.render(this.scene, this.camera);
    };
    this.frameId = requestAnimationFrame(tick);
  }

  private pause(): void {
    cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.lastTimestamp = null;
  }

  private observeSize(): void {
    const apply = () => {
      const rect = this.options.container.getBoundingClientRect();
      this.width = Math.max(1, Math.round(rect.width));
      this.height = Math.max(1, Math.round(rect.height));
      this.renderer.setSize(this.width, this.height, false);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.onResize(this.width, this.height);
      if (!this.frameId) this.renderOnce();
    };
    const observer = new ResizeObserver(apply);
    observer.observe(this.options.container);
    this.cleanups.push(() => observer.disconnect());
    apply();
  }

  private observeVisibility(): void {
    const observer = new IntersectionObserver((entries) => {
      this.onScreen = latest(entries).isIntersecting;
      if (this.onScreen) this.resume();
      else this.pause();
    });
    observer.observe(this.options.container);

    const onVisibility = () => (document.hidden ? this.pause() : this.resume());
    document.addEventListener('visibilitychange', onVisibility);

    this.cleanups.push(() => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }
}

/** Free every geometry and material under a node. */
export function disposeTree(root: Object3D): void {
  root.traverse((object) => {
    const mesh = object as Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material as Material | Material[] | undefined;
    if (Array.isArray(material)) material.forEach((m) => m.dispose());
    else material?.dispose();
  });
}
