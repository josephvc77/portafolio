import { $, $$ } from '../core/dom';

/**
 * Mobile menu built on native <dialog>: focus trapping, Esc to close, inert
 * background and focus return come from the platform, not custom code.
 */
export function initMenu(): void {
  const dialog = $<HTMLDialogElement>('#mobile-menu');
  const openBtn = $<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openBtn) return;

  const setExpanded = (open: boolean) => openBtn.setAttribute('aria-expanded', String(open));
  setExpanded(false);

  openBtn.addEventListener('click', () => {
    dialog.showModal();
    setExpanded(true);
    document.dispatchEvent(new Event('ui:modal-open'));
  });

  dialog.addEventListener('close', () => {
    setExpanded(false);
    document.dispatchEvent(new Event('ui:modal-close'));
  });

  $$('[data-menu-close], [data-menu-link]', dialog).forEach((el) => el.addEventListener('click', () => dialog.close()));

  // Click on the backdrop (outside the inner panel) closes.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Menu is mobile-only; if the viewport grows past it, don't leave a modal open.
  matchMedia('(min-width: 64em)').addEventListener('change', (event) => event.matches && dialog.open && dialog.close());
}
