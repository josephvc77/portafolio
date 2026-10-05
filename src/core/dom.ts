export const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T | null =>
  scope.querySelector<T>(selector);

export const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T[] =>
  Array.from(scope.querySelectorAll<T>(selector));

/** Run work when the browser is idle (falls back to a short timeout in Safari). */
export const whenIdle = (callback: () => void, timeout = 1500): void => {
  if ('requestIdleCallback' in window) requestIdleCallback(callback, { timeout });
  else setTimeout(callback, 200);
};

/** After the window load event, then idle — for heavy, non-critical work (3D). */
export const whenLoadedAndIdle = (callback: () => void): void => {
  const go = () => whenIdle(callback, 2500);
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
};

/**
 * The current state from an IntersectionObserver batch. Under main-thread load the
 * browser queues several records per target into one callback (e.g. "out" then "in");
 * only the last one is current. Reading `[entry]` silently uses a stale record.
 */
export const latest = (entries: IntersectionObserverEntry[]): IntersectionObserverEntry => entries[entries.length - 1];

/** Run once when an element comes within `margin` of the viewport (lazy sections / 3D). */
export const whenNear = (element: Element, callback: () => void, margin = '600px'): void => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!latest(entries).isIntersecting) return;
      observer.disconnect();
      callback();
    },
    { rootMargin: `${margin} 0px` },
  );
  observer.observe(element);
};
