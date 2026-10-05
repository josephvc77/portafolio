import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { $$ } from '../core/dom';
import { PRESETS, type RevealPreset } from './presets';
import { DURATION, EASE, STAGGER } from './tokens';

/**
 * Scroll-triggered reveals driven by markup:
 *   data-reveal="fade-up"   → element animates in when it enters the viewport
 *   data-reveal-group       → its [data-reveal] descendants share one trigger and stagger
 *
 * Rule: never hide what the visitor can already see. Anything inside the
 * viewport when this runs is left untouched, so late-loading JS can't flash content.
 */
const START = 'top 88%';

const isAlreadyVisible = (el: Element): boolean => el.getBoundingClientRect().top < window.innerHeight;

function animateLines(el: HTMLElement, trigger: Element | null) {
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto' });
  return gsap.from(split.lines, {
    yPercent: 105,
    duration: DURATION.cinematic,
    ease: EASE.out,
    stagger: STAGGER.base,
    scrollTrigger: trigger ? { trigger, start: START, once: true } : undefined,
    onComplete: () => split.revert(),
  });
}

function fromVars(el: HTMLElement): gsap.TweenVars {
  const preset = (el.dataset.reveal || 'fade-up') as RevealPreset;
  return PRESETS[preset as keyof typeof PRESETS] ?? PRESETS['fade-up'];
}

export function initReveals(): void {
  const groups = $$('[data-reveal-group]');
  const grouped = new Set<HTMLElement>();

  for (const group of groups) {
    // Members are reveal elements whose closest group is this one (supports nesting).
    const members = $$('[data-reveal]', group).filter((el) => el.parentElement?.closest('[data-reveal-group]') === group);
    members.forEach((el) => grouped.add(el));
    if (isAlreadyVisible(group)) continue;

    const timeline = gsap.timeline({ scrollTrigger: { trigger: group, start: START, once: true } });
    members.forEach((el, i) => {
      if (el.dataset.reveal === 'lines') timeline.add(animateLines(el, null), i * STAGGER.base);
      else timeline.from(el, { ...fromVars(el), duration: DURATION.slow, ease: EASE.out }, i * STAGGER.base);
    });
  }

  for (const el of $$('[data-reveal]')) {
    if (grouped.has(el) || isAlreadyVisible(el)) continue;
    if (el.dataset.reveal === 'lines') animateLines(el, el);
    else gsap.from(el, { ...fromVars(el), duration: DURATION.slow, ease: EASE.out, scrollTrigger: { trigger: el, start: START, once: true } });
  }

  // Fonts change line breaks; recalc positions once they're in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
