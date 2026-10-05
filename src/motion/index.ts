import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type { Capabilities } from '../core/capabilities';
import { initGlassLight, initMagnetic, initTilt } from './pointer';
import { registerPresets } from './presets';
import { initReveals } from './reveal';
import { destroySmoothScroll, initSmoothScroll } from './scroll';
import { getJourney } from '../sections/journey/controller';
import { initJourneyScroll } from '../sections/journey/scroll';

export { DURATION, EASE, STAGGER, DISTANCE } from './tokens';
export { getLenis } from './scroll';

let context: gsap.Context | null = null;
let listeners: AbortController | null = null;

/**
 * Motion entry point — loaded lazily (dynamic import) after first paint and
 * only when the user hasn't asked for reduced motion.
 */
export function initMotion(caps: Capabilities): void {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registerPresets();

  // Touch devices keep native scroll physics — smoothing them feels like lag.
  if (!caps.touch) initSmoothScroll();

  // Everything created inside the context can be reverted in one call.
  listeners = new AbortController();
  const { signal } = listeners;
  context = gsap.context(() => {
    initReveals();
    const journey = getJourney();
    // Returned cleanup runs on context.revert(): hands the runway back to the discrete driver.
    const releaseJourney = journey ? initJourneyScroll(journey) : null;
    if (caps.finePointer) {
      initMagnetic(signal);
      initTilt(signal);
      initGlassLight(signal);
    }
    return () => releaseJourney?.();
  });

  document.documentElement.classList.add('motion-ready');
}

/** Tear down all motion (e.g. user enables reduced motion mid-visit). Content stays fully visible. */
export function disableMotion(): void {
  listeners?.abort();
  context?.revert();
  context = null;
  destroySmoothScroll();
  document.documentElement.classList.remove('motion-ready');
}
