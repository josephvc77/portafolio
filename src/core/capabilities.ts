/**
 * Device capability detection. Every expensive feature (3D, smooth scroll,
 * cursor, pointer effects) asks here instead of sniffing on its own.
 *
 * Tiers:
 *   high   — full 3D scenes, post effects, pointer-reactive camera
 *   medium — 3D with reduced geometry/particles, capped DPR
 *   low    — single lightweight scene or static render, no continuous loops
 *   off    — no WebGL; CSS fallbacks only
 *
 * Override for testing: ?quality=high|medium|low|off
 */
export type QualityTier = 'high' | 'medium' | 'low' | 'off';

export interface Capabilities {
  reducedMotion: boolean;
  /** Fine pointer with hover — mouse/trackpad. */
  finePointer: boolean;
  touch: boolean;
  saveData: boolean;
  webgl: boolean;
  tier: QualityTier;
  /** Device pixel ratio cap for WebGL renderers at this tier. */
  maxDpr: number;
}

const TIERS: readonly QualityTier[] = ['high', 'medium', 'low', 'off'];

const media = (query: string): boolean => typeof matchMedia === 'function' && matchMedia(query).matches;

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    const ok = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

function scoreTier(caps: Omit<Capabilities, 'tier' | 'maxDpr'>): QualityTier {
  if (!caps.webgl) return 'off';
  if (caps.saveData) return 'low';

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8; // Not exposed in Safari/Firefox — assume capable.
  const cores = navigator.hardwareConcurrency ?? 4;
  const smallScreen = media('(max-width: 48em)');

  if (memory <= 2 || cores <= 2) return 'low';
  if (caps.touch || smallScreen || memory <= 4 || cores <= 4) return 'medium';
  return 'high';
}

let cached: Capabilities | null = null;

export function getCapabilities(): Capabilities {
  if (cached) return cached;

  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  const base = {
    reducedMotion: media('(prefers-reduced-motion: reduce)'),
    finePointer: media('(hover: hover) and (pointer: fine)'),
    touch: media('(pointer: coarse)') || navigator.maxTouchPoints > 0,
    saveData: nav.connection?.saveData === true,
    webgl: hasWebGL(),
  };

  const override = new URLSearchParams(location.search).get('quality') as QualityTier | null;
  const tier = override && TIERS.includes(override) ? override : scoreTier(base);
  const maxDpr = { high: 2, medium: 1.5, low: 1, off: 1 }[tier];

  cached = { ...base, tier, maxDpr };

  const root = document.documentElement;
  root.dataset.quality = tier;
  root.classList.toggle('has-fine-pointer', base.finePointer);
  root.classList.toggle('reduced-motion', base.reducedMotion);

  return cached;
}

/** Re-run a callback when the user toggles reduced motion at the OS level. */
export function onReducedMotionChange(callback: (reduced: boolean) => void): void {
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
    if (cached) cached = { ...cached, reducedMotion: event.matches };
    callback(event.matches);
  });
}
