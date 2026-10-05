import type { Capabilities } from '../../core/capabilities';
import { StackScene } from './StackScene';

/** Lazy entry. On failure the chip list + detail panel remain fully functional. */
export function mountStack(container: HTMLElement, caps: Capabilities): StackScene | null {
  try {
    const scene = new StackScene(container, caps);
    if (import.meta.env.DEV) Object.assign(window, { __stack: scene });
    return scene;
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[stack] 3D unavailable, list-only mode', error);
    return null;
  }
}
