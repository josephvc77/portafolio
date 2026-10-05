import { $$ } from '../core/dom';
import { getCapabilities } from '../core/capabilities';

/**
 * Scroll-through previews: on hover/focus, load the tall capture once and glide
 * it up inside the browser frame — like skimming the live site. The strip is only
 * downloaded on intent, so the page pays nothing for previews nobody explores.
 * Touch and reduced-motion users keep the static frame.
 */
export function initPreviews(): void {
  const caps = getCapabilities();
  initLoopVideos(caps.reducedMotion);
  if (!caps.finePointer || caps.reducedMotion) return;

  for (const preview of $$<HTMLAnchorElement>('[data-preview]')) {
    const screen = preview.querySelector<HTMLElement>('.preview__screen');
    if (!screen) continue;
    let strip: Promise<void> | null = null;
    let wanted = false;

    const load = () =>
      (strip ??= (() => {
        const img = new Image();
        img.className = 'preview__strip';
        img.alt = '';
        img.decoding = 'async';
        img.src = preview.dataset.scrollSrc!;
        return img
          .decode()
          .then(() => void screen.append(img))
          .catch(() => {
            /* keep the static frame */
          });
      })());

    const start = () => {
      wanted = true;
      load().then(() => {
        // Next frame so the strip's initial transform is committed before it moves.
        if (wanted) requestAnimationFrame(() => preview.classList.add('is-scrolling'));
      });
    };
    const stop = () => {
      wanted = false;
      preview.classList.remove('is-scrolling');
    };

    preview.addEventListener('pointerenter', start);
    preview.addEventListener('pointerleave', stop);
    preview.addEventListener('focus', start);
    preview.addEventListener('blur', stop);
  }
}

/**
 * Gameplay loops: download and play only while the card is on screen, pause when it
 * scrolls away. Reduced-motion users keep the poster (the link still opens the trailer).
 */
function initLoopVideos(reducedMotion: boolean): void {
  const videos = $$<HTMLVideoElement>('[data-loop-video]');
  if (!videos.length || reducedMotion || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay refused: the poster stays */
          });
        } else {
          video.pause();
        }
      }
    },
    { threshold: 0.35 },
  );
  for (const video of videos) observer.observe(video);
}
