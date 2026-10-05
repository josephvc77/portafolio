import { $, $$ } from '../../core/dom';

/**
 * Experience journey. Two drivers share one renderer (`apply`):
 *  - discrete (always on): an IntersectionObserver activates the role whose card
 *    crosses the reading line; the CSS runway transitions to it.
 *  - continuous (motion layer, optional): ScrollTrigger scrubs `--p` every frame
 *    via `scrub()`. `release()` hands control back to the discrete driver.
 */
export interface JourneyApi {
  items: HTMLElement[];
  list: HTMLElement;
  /** Fraction of the viewport height where a card counts as "being read". */
  readingLine: number;
  scrub(progress: number): void;
  release(): void;
}

let api: JourneyApi | null = null;

export const getJourney = (): JourneyApi | null => api;

export function initJourney(): void {
  const root = $('[data-journey]');
  const plane = $('[data-journey-plane]');
  const list = $('[data-journey-list]');
  if (!root || !plane || !list) return;

  const items = $$('[data-journey-item]', list);
  const nodes = $$('[data-journey-node]', plane);
  const readingLine = 0.4;
  let scrubbing = false;
  let activeIndex = -1;

  plane.style.setProperty('--n', String(nodes.length));

  /** Render runway state for a (possibly fractional) progress value. */
  const apply = (progress: number) => {
    plane.style.setProperty('--p', progress.toFixed(4));
    nodes.forEach((node, i) => {
      const distance = Math.abs(i - progress);
      // Fade is applied to leaf elements via --fade: opacity on a preserve-3d
      // container would flatten the standing signs.
      node.style.setProperty('--fade', Math.max(0.12, 1 - distance * 0.6).toFixed(3));
      node.classList.toggle('is-active', distance < 0.5);
    });
  };

  const activate = (index: number) => {
    if (index === activeIndex) return;
    activeIndex = index;
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    if (!scrubbing) apply(index);
  };

  // Reading line at 40% of the viewport: a card is current while it spans that line.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activate(items.indexOf(entry.target as HTMLElement));
      }
    },
    { rootMargin: `-${readingLine * 100}% 0px -${(1 - readingLine) * 100 - 1}% 0px` },
  );
  items.forEach((item) => observer.observe(item));

  apply(0);
  root.classList.add('journey-ready');

  api = {
    items,
    list,
    readingLine,
    scrub(progress) {
      if (!scrubbing) {
        scrubbing = true;
        root.classList.add('is-scrubbed');
      }
      apply(progress);
    },
    release() {
      scrubbing = false;
      root.classList.remove('is-scrubbed');
      apply(Math.max(0, activeIndex));
    },
  };
  if (import.meta.env.DEV) Object.assign(window, { __journey: api });
}
