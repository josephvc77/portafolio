import { gsap } from 'gsap';
import { $$ } from '../core/dom';
import { DURATION, EASE } from './tokens';

/**
 * Pointer-driven micro-interactions (motion level 1). Fine pointers only —
 * the caller guarantees that. All writes are transform or CSS custom properties.
 */

/** data-magnetic — element leans toward the cursor, springs back on leave. */
export function initMagnetic(signal: AbortSignal, strength = 0.28, maxShift = 10): void {
  for (const el of $$('[data-magnetic]')) {
    const toX = gsap.quickTo(el, 'x', { duration: DURATION.base, ease: EASE.out });
    const toY = gsap.quickTo(el, 'y', { duration: DURATION.base, ease: EASE.out });

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (event.clientY - (rect.top + rect.height / 2)) * strength;
      toX(gsap.utils.clamp(-maxShift, maxShift, dx));
      toY(gsap.utils.clamp(-maxShift, maxShift, dy));
    }, { signal });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: DURATION.slow, ease: EASE.spring, overwrite: true });
    }, { signal });
  }
}

/** data-tilt — subtle 3D perspective tilt for cards; also feeds the glass reflection. */
export function initTilt(signal: AbortSignal, maxDeg = 5): void {
  for (const el of $$('[data-tilt]')) {
    const toRX = gsap.quickTo(el, 'rotationX', { duration: DURATION.base, ease: EASE.out });
    const toRY = gsap.quickTo(el, 'rotationY', { duration: DURATION.base, ease: EASE.out });
    gsap.set(el, { transformPerspective: 900 });

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      toRY(px * maxDeg * 2);
      toRX(-py * maxDeg * 2);
    }, { signal });
    el.addEventListener('pointerleave', () => {
      toRX(0);
      toRY(0);
    }, { signal });
  }
}

/** .glass--reactive — moves the reflection highlight to follow the pointer (CSS vars only). */
export function initGlassLight(signal: AbortSignal): void {
  for (const el of $$('.glass--reactive')) {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    }, { signal });
  }
}
