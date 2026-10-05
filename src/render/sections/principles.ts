import { PROFILE } from '../../content';
import type { RenderContext } from '../context';
import { html } from '../html';
import { sectionHead } from './section-head';

export function renderPrinciples(ctx: RenderContext) {
  return html`
    <section class="section principles" id="principles" aria-labelledby="principles-title">
      <div class="container">
        ${sectionHead(ctx, 'principles')}
        <ol class="principles__list" role="list" data-reveal-group>
          ${PROFILE.principles.map(
            (item, i) => html`
              <li class="principles__item" data-reveal="fade-up">
                <span class="t-mono principles__index">${String(i + 1).padStart(2, '0')}</span>
                <h3 class="principles__title">${ctx.t(item.title)}</h3>
                <p class="t-muted">${ctx.t(item.body)}</p>
              </li>`,
          )}
        </ol>
      </div>
    </section>
  `;
}
