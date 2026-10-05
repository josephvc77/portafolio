import { $, $$ } from '../core/dom';
import { showToast } from './toast';

/** [data-copy] buttons — copy their value and confirm with a toast. */
export function initCopyButtons(): void {
  $$<HTMLButtonElement>('[data-copy]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
        showToast(btn.dataset.copiedLabel ?? 'Copied', 'success');
      } catch {
        showToast(btn.dataset.failedLabel ?? 'Copy failed', 'error');
      }
    }),
  );
}

/**
 * Progressive enhancement of the Netlify form: without JS it posts normally;
 * with JS it submits in place and reports status through an aria-live region.
 */
export function initContactForm(): void {
  const form = $<HTMLFormElement>('[data-contact-form]');
  const status = $('[data-form-status]', form ?? document);
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!form || !status || !submit) return;

  const label = submit.textContent?.trim() ?? '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    submit.textContent = form.dataset.sendingLabel ?? '…';
    status.textContent = '';
    form.removeAttribute('data-state');

    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      form.dataset.state = 'success';
      status.textContent = form.dataset.successLabel ?? '';
    } catch {
      form.dataset.state = 'error';
      status.textContent = form.dataset.errorLabel ?? '';
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });
}
