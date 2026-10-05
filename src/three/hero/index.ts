import type { Capabilities } from '../../core/capabilities';
import { HeroScene } from './HeroScene';

/**
 * Lazy entry for the hero scene. Any failure (driver bug, context creation
 * refused) leaves the CSS drawing in place — the hero is never empty.
 */
export function mountHero(container: HTMLElement, caps: Capabilities): HeroScene | null {
  try {
    const scene = new HeroScene(container, caps);
    if (import.meta.env.DEV) Object.assign(window, { __hero: scene });
    return scene;
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[hero] WebGL unavailable, keeping CSS fallback', error);
    return null;
  }
}
