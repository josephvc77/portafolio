import { gsap } from 'gsap';
import { DISTANCE, DURATION, EASE, STAGGER } from './tokens';

/**
 * The only entrance animations in the project. Components pick a preset by
 * name (`data-reveal="fade-up"`) or call `gsap.effects.fadeUp(el)` — nobody
 * hand-writes one-off tweens for entrances.
 */
export type RevealPreset = 'fade' | 'fade-up' | 'scale' | 'slide-left' | 'slide-right' | 'lines';

export const PRESETS: Record<Exclude<RevealPreset, 'lines'>, gsap.TweenVars> = {
  fade: { autoAlpha: 0 },
  'fade-up': { autoAlpha: 0, y: DISTANCE.md },
  scale: { autoAlpha: 0, scale: 0.96 },
  'slide-left': { autoAlpha: 0, x: DISTANCE.lg },
  'slide-right': { autoAlpha: 0, x: -DISTANCE.lg },
};

const EFFECT_NAMES: Record<keyof typeof PRESETS, string> = {
  fade: 'fadeIn',
  'fade-up': 'fadeUp',
  scale: 'scaleIn',
  'slide-left': 'slideInLeft',
  'slide-right': 'slideInRight',
};

let registered = false;

export function registerPresets(): void {
  if (registered) return;
  registered = true;

  for (const [preset, from] of Object.entries(PRESETS) as [keyof typeof PRESETS, gsap.TweenVars][]) {
    gsap.registerEffect({
      name: EFFECT_NAMES[preset],
      effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => gsap.from(targets, { ...from, ...config }),
      defaults: { duration: DURATION.slow, ease: EASE.out, stagger: STAGGER.base },
      extendTimeline: true,
    });
  }
}
