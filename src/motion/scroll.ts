import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Lenis smooth scrolling, synced to GSAP's ticker so ScrollTrigger and
 * Lenis share one frame loop. Not scroll-jacking: native wheel/touch input
 * only gets inertia smoothing; touch devices keep native scrolling.
 */
let lenis: Lenis | null = null;

export const getLenis = (): Lenis | null => lenis;

const headerOffset = (): number =>
  -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) * 16 || 64) - 24;

function handleAnchors(instance: Lenis): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;

    const id = link.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    const top = id === 'top';
    instance.scrollTo(top ? 0 : target, {
      offset: top ? 0 : headerOffset(),
      onComplete: () => {
        // Move keyboard focus with the scroll so the next Tab continues from the target.
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      },
    });
    history.pushState(null, '', `#${id}`);
  });
}

export function initSmoothScroll(): Lenis {
  lenis = new Lenis({ lerp: 0.12, smoothWheel: true, syncTouch: false, autoRaf: false });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  handleAnchors(lenis);

  // Modal UI (mobile menu, dialogs) must freeze background scroll.
  document.addEventListener('ui:modal-open', () => lenis?.stop());
  document.addEventListener('ui:modal-close', () => lenis?.start());

  return lenis;
}

export function destroySmoothScroll(): void {
  lenis?.destroy();
  lenis = null;
}
