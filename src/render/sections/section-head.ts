import { SECTIONS, type SectionId } from '../../content';
import type { RenderContext } from '../context';
import { html } from '../html';

/** Blueprint sheet header: "01 — Profile" on a hairline, then the section title. */
export function sectionHead(ctx: RenderContext, id: SectionId) {
  const index = SECTIONS.findIndex((s) => s.id === id);
  const section = SECTIONS[index];
  return html`
    <header class="section-head">
      <p class="section-head__meta t-label" data-reveal="fade">
        <span class="section-head__index">${String(index + 1).padStart(2, '0')}</span>
        <span>${ctx.t(section.eyebrow)}</span>
      </p>
      <h2 class="section-head__title t-h2" id="${id}-title" data-reveal="lines">${ctx.t(section.title)}</h2>
    </header>
  `;
}
