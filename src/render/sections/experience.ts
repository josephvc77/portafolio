import { EXPERIENCE, PROJECTS, UI, techById, type Experience } from '../../content';
import type { RenderContext } from '../context';
import { html } from '../html';
import { icon } from '../icons';
import { sectionHead } from './section-head';

export const techTags = (ctx: RenderContext, ids: readonly string[]) => html`
  <ul class="tag-list" role="list">
    ${ids.map((id, i) => {
      const tech = techById.get(id);
      return tech ? html`<li class="tag t-mono" data-tech="${id}" style="--t:${i}">${ctx.t(tech.label)}</li>` : '';
    })}
  </ul>
`;

const projectsOf = (exp: Experience) => exp.projects.map((id) => PROJECTS.find((p) => p.id === id)!).filter(Boolean);

/**
 * Decorative 3D runway (CSS 3D, aria-hidden): one waypoint per role, with the
 * projects delivered in that role branching off. Everything it shows is also in
 * the cards. Driven by --p (journey progress) from sections/journey.
 */
function renderTrack(ctx: RenderContext) {
  return html`
    <div class="journey__track" aria-hidden="true" data-journey-track>
      <div class="journey__plane" data-journey-plane>
        <div class="journey__spine"></div>
        ${EXPERIENCE.map(
          (exp, i) => html`
            <div class="journey__node" style="--i:${i}" data-journey-node="${i}">
              <span class="journey__marker"></span>
              <div class="journey__sign">
                <span class="journey__period t-mono">${exp.period}</span>
                <span class="journey__org">${ctx.t(exp.short)}</span>
              </div>
              ${projectsOf(exp).map(
                (project, b) => html`
                  <div class="journey__branch" style="--b:${b}">
                    <span class="journey__branch-line"></span>
                    <span class="journey__branch-label t-mono">${ctx.t(project.name)}</span>
                  </div>`,
              )}
            </div>`,
        )}
      </div>
    </div>
  `;
}

export function renderExperience(ctx: RenderContext) {
  return html`
    <section class="section experience" id="experience" aria-labelledby="experience-title">
      <div class="container">
        ${sectionHead(ctx, 'experience')}

        <div class="journey" data-journey>
          ${renderTrack(ctx)}

          <ol class="timeline" role="list" data-journey-list>
            ${EXPERIENCE.map(
              (exp, i) => html`
                <li class="timeline__item" id="exp-${exp.id}" data-journey-item="${i}" data-tech="${exp.tech.join(' ')}">
                  <article class="timeline__card" aria-labelledby="exp-${exp.id}-role">
                    <header class="timeline__head" data-reveal="fade-up">
                      <p class="timeline__period t-mono">${exp.period}</p>
                      <h3 class="timeline__role t-h3" id="exp-${exp.id}-role">${ctx.t(exp.role)}</h3>
                      <p class="timeline__org t-muted">${ctx.t(exp.org)} · ${ctx.t(exp.location)}</p>
                    </header>
                    <div class="timeline__body" data-reveal-group>
                      <p data-reveal="fade-up">${ctx.t(exp.summary)}</p>
                      <ul class="bullet-list" role="list">
                        ${exp.highlights.map((item) => html`<li data-reveal="fade-up">${ctx.t(item)}</li>`)}
                      </ul>
                      ${projectsOf(exp).length
                        ? html`
                            <div class="timeline__projects" data-reveal="fade-up">
                              <p class="t-label">${ctx.t(UI.projectsInRole)}</p>
                              <ul class="timeline__project-links" role="list">
                                ${projectsOf(exp).map(
                                  (project) => html`
                                    <li>
                                      <a class="link" href="#project-${project.id}">
                                        ${ctx.t(project.name)} <span class="t-muted">— ${ctx.t(project.tagline)}</span> ${icon('arrow-down')}
                                      </a>
                                    </li>`,
                                )}
                              </ul>
                            </div>`
                        : ''}
                      <div class="timeline__tags">${techTags(ctx, exp.tech)}</div>
                    </div>
                  </article>
                </li>`,
            )}
          </ol>
        </div>
      </div>
    </section>
  `;
}
