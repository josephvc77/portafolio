import { PROFILE, UI } from '../../content';
import type { RenderContext } from '../context';
import { html } from '../html';
import { sectionHead } from './section-head';

export function renderAbout(ctx: RenderContext) {
  return html`
    <section class="section about" id="about" aria-labelledby="about-title">
      <div class="container">
        ${sectionHead(ctx, 'about')}

        <div class="about__grid">
          <div class="about__copy" data-reveal-group>
            ${PROFILE.about.map((paragraph) => html`<p data-reveal="fade-up">${ctx.t(paragraph)}</p>`)}
          </div>

          <dl class="stats" data-reveal-group>
            ${PROFILE.stats.map(
              (stat) => html`
                <div class="stats__item" data-reveal="fade-up">
                  <dt class="t-muted">${ctx.t(stat.label)}</dt>
                  <dd class="stats__value">${stat.value}</dd>
                </div>`,
            )}
          </dl>
        </div>

        <div class="education">
          <h3 class="t-label">${ctx.t(UI.education)}</h3>
          <ol class="education__list" role="list" data-reveal-group>
            ${PROFILE.education.map(
              (item) => html`
                <li class="education__item" data-reveal="fade-up">
                  <span class="t-mono t-muted">${item.period}</span>
                  <span class="education__degree">${ctx.t(item.degree)}</span>
                  <span class="t-muted">${item.school}</span>
                </li>`,
            )}
          </ol>
        </div>
      </div>
    </section>
  `;
}
