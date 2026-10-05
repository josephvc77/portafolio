import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { JourneyApi } from './controller';

/**
 * Continuous driver (motion layer): maps the scroll position to a fractional
 * progress so the runway camera glides between roles instead of snapping.
 * progress = i exactly when card i's top sits on the reading line.
 */
export function initJourneyScroll(journey: JourneyApi): () => void {
  let anchors: number[] = [];

  const measure = () => {
    anchors = journey.items.map((item) => item.getBoundingClientRect().top + window.scrollY);
  };

  const update = () => {
    if (!anchors.length) return;
    const line = window.scrollY + window.innerHeight * journey.readingLine;
    const last = anchors.length - 1;
    let progress = 0;
    if (line >= anchors[last]) progress = last;
    else if (line > anchors[0]) {
      const i = anchors.findIndex((top, k) => line >= top && line < anchors[k + 1]);
      progress = i + (line - anchors[i]) / (anchors[i + 1] - anchors[i]);
    }
    journey.scrub(progress);
  };

  const trigger = ScrollTrigger.create({
    trigger: journey.list,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: update,
    onRefresh: () => {
      measure();
      update();
    },
  });

  return () => {
    trigger.kill();
    journey.release();
  };
}
