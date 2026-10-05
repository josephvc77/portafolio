import { $ } from '../core/dom';

export type ToastTone = 'success' | 'error' | 'info';

const VISIBLE_MS = 3200;

/** Announced via the page's polite live region; purely visual otherwise. */
export function showToast(message: string, tone: ToastTone = 'info'): void {
  const region = $('[data-toast-region]');
  if (!region) return;

  const toast = document.createElement('p');
  toast.className = `toast glass glass--pill toast--${tone}`;
  toast.textContent = message;
  region.append(toast);

  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 600); // reduced-motion: transitionend may not fire
  }, VISIBLE_MS);
}
