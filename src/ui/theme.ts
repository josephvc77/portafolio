import { $$ } from '../core/dom';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

/** The initial theme is applied pre-paint by the inline boot script; this only handles toggling. */
export function initTheme(): void {
  const toggles = $$<HTMLButtonElement>('[data-theme-toggle]');
  const sync = () => toggles.forEach((btn) => btn.setAttribute('aria-pressed', String(currentTheme() === 'light')));
  sync();

  toggles.forEach((btn) =>
    btn.addEventListener('click', () => {
      const next: Theme = currentTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable (private mode) — theme still applies for this visit */
      }
      sync();
      // 3D scenes listen for this to re-read --scene-* colours.
      document.dispatchEvent(new CustomEvent('ui:theme-change', { detail: next }));
    }),
  );
}
