import { PROFILE, UI, validateContent, type Locale } from '../content';
import { createContext } from './context';
import { renderHead } from './head';
import { html } from './html';
import { renderAbout } from './sections/about';
import { renderContact } from './sections/contact';
import { renderExperience } from './sections/experience';
import { renderHeader } from './sections/header';
import { renderHero } from './sections/hero';
import { renderPrinciples } from './sections/principles';
import { renderProjects } from './sections/projects';
import { renderStack } from './sections/stack';

export interface RenderedPage {
  head: string;
  body: string;
}

/** Build-time only: produces the complete, crawlable, no-JS-required page for a locale. */
export function renderPage(locale: Locale): RenderedPage {
  validateContent();
  const ctx = createContext(locale);

  const body = html`
    <div class="ground" aria-hidden="true"></div>
    ${renderHeader(ctx)}
    <main id="main" tabindex="-1">
      ${renderHero(ctx)}
      ${renderAbout(ctx)}
      ${renderStack(ctx)}
      ${renderExperience(ctx)}
      ${renderProjects(ctx)}
      ${renderPrinciples(ctx)}
      ${renderContact(ctx)}
    </main>
    <footer class="site-footer">
      <div class="container site-footer__inner t-mono">
        <span>© ${new Date().getFullYear()} ${PROFILE.name}</span>
        <span class="t-muted">${ctx.t(UI.footer)}</span>
      </div>
    </footer>
    <div class="toast-region" role="status" aria-live="polite" data-toast-region></div>
  `;

  assertUniqueIds(body.value, locale);
  return { head: renderHead(ctx).value, body: body.value };
}

/** Duplicate ids break getElementById, label/aria references and anchors — fail the build instead. */
function assertUniqueIds(markup: string, locale: Locale): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const [, id] of markup.matchAll(/\sid="([^"]+)"/g)) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  if (duplicates.size) throw new Error(`[${locale}] duplicate element ids: ${[...duplicates].join(', ')}`);
}
