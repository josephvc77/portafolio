import { PROJECTS, UI, type Project, type ProjectKind } from '../../content';
import type { RenderContext } from '../context';
import { html } from '../html';
import { icon } from '../icons';
import { previewFor } from '../previews';
import { techTags } from './experience';
import { sectionHead } from './section-head';

/** Text-first architecture diagram; Phase 7 layers the interactive visual on top of this list. */
const architecture = (ctx: RenderContext, project: Project) =>
  project.architecture?.length
    ? html`
        <figure class="arch">
          <figcaption class="t-label">${ctx.t(UI.architecture)}</figcaption>
          <ol class="arch__layers" role="list">
            ${project.architecture.map(
              (layer, i) => html`
                <li class="arch__layer" data-tech="${layer.tech.join(' ')}">
                  <span class="arch__index t-mono">${String(i + 1).padStart(2, '0')}</span>
                  <span>${ctx.t(layer.label)}</span>
                </li>`,
            )}
          </ol>
        </figure>`
    : '';

/** Desktop screen is 1440×900 → its height is 62.5% of its width. */
const SCREEN_RATIO = 900 / 1440;

/**
 * Live-site preview: browser frame (desktop capture) + phone (mobile capture).
 * The whole figure links to the live site. On hover/focus (fine pointers, motion OK)
 * ui/previews.ts swaps in a taller capture and scrolls it inside the frame.
 */
const preview = (ctx: RenderContext, project: Project) => {
  const entry = previewFor(project.id);
  if (!entry) return '';
  const name = ctx.t(project.name);
  const host = new URL(entry.url).host;
  // How far the scroll strip travels: everything below the first screen.
  const visible = (SCREEN_RATIO * entry.scroll.width) / entry.scroll.height;
  const scrolls = visible < 0.9;
  const scrollEnd = `${(-(1 - visible) * 100).toFixed(2)}%`;

  return html`
    <a class="preview" href="${entry.url}" target="_blank" rel="noopener noreferrer"
       ${scrolls ? html`data-preview data-scroll-src="${entry.scroll.src}" style="--scroll-end:${scrollEnd}"` : ''}>
      <span class="sr-only">${ctx.t(UI.viewLive).replace('{name}', name)} ${ctx.t(UI.opensInNewTab)}</span>
      <span class="preview__browser" aria-hidden="true">
        <span class="preview__bar"><span class="preview__dots"></span><span class="preview__url t-mono">${host}</span></span>
        <span class="preview__screen">
          <img class="preview__shot" src="${entry.desktop.src}" width="${entry.desktop.width}" height="${entry.desktop.height}"
               alt="" loading="lazy" decoding="async" />
        </span>
      </span>
      <span class="preview__phone" aria-hidden="true">
        <img src="${entry.mobile.src}" width="${entry.mobile.width}" height="${entry.mobile.height}" alt="" loading="lazy" decoding="async" />
      </span>
    </a>
  `;
};

/**
 * Video preview for work without a live site (the game): a silent gameplay loop in a
 * 16:9 screen frame. It is muted + playsinline so browsers allow autoplay; ui/previews.ts
 * only plays it while on screen and leaves the poster for reduced-motion users.
 * The figure links to the full trailer for the current locale.
 */
const videoPreview = (ctx: RenderContext, project: Project) => {
  const video = project.video;
  if (!video) return '';
  const name = ctx.t(project.name);
  return html`
    <a class="preview preview--video" href="${ctx.t(video.trailer)}" target="_blank" rel="noopener noreferrer">
      <span class="sr-only">${ctx.t(UI.watchTrailer)} — ${name} ${ctx.t(UI.opensInNewTab)}</span>
      <span class="preview__browser preview__game" aria-hidden="true">
        <span class="preview__screen preview__screen--video">
          <video class="preview__video" data-loop-video muted loop playsinline preload="none"
                 poster="${video.poster}" width="1280" height="720" title="${ctx.t(UI.gameplayOf).replace('{name}', name)}">
            <source src="${video.loop}" type="video/mp4" />
          </video>
          <span class="preview__play t-mono">${icon('arrow-up-right')} ${ctx.t(UI.watchTrailer)}</span>
        </span>
      </span>
    </a>
  `;
};

const hasPreview = (project: Project) => Boolean(previewFor(project.id) || project.video);

const projectCard = (ctx: RenderContext, project: Project, index: number) => html`
  <article class="project${hasPreview(project) ? ' project--preview' : ''}" id="project-${project.id}" aria-labelledby="project-${project.id}-name"
           data-project="${project.id}" data-tech="${project.tech.join(' ')}" data-reveal="fade-up">
    <header class="project__head">
      <p class="project__index t-mono">${String(index + 1).padStart(2, '0')}</p>
      <div>
        <h3 class="project__name t-h3" id="project-${project.id}-name">${ctx.t(project.name)}</h3>
        <p class="project__tagline t-muted">${ctx.t(project.tagline)}</p>
      </div>
    </header>

    ${preview(ctx, project)}
    ${videoPreview(ctx, project)}

    <dl class="project__facts">
      <div><dt class="t-label">${ctx.t(UI.role)}</dt><dd>${ctx.t(project.role)}</dd></div>
      <div><dt class="t-label">${ctx.t(UI.context)}</dt><dd>${ctx.t(project.context)}</dd></div>
    </dl>

    <p class="project__summary">${ctx.t(project.summary)}</p>

    ${project.metrics?.length
      ? html`
          <dl class="project__metrics">
            ${project.metrics.map(
              (metric) => html`<div><dt class="t-muted">${ctx.t(metric.label)}</dt><dd class="project__metric-value">${metric.value}</dd></div>`,
            )}
          </dl>`
      : ''}

    ${project.highlights.length
      ? html`<ul class="bullet-list" role="list">${project.highlights.map((item) => html`<li>${ctx.t(item)}</li>`)}</ul>`
      : ''}

    ${architecture(ctx, project)}

    <footer class="project__foot">
      ${techTags(ctx, project.tech)}
      ${project.links?.map(
        (link) => html`
          <a class="link project__link" href="${link.href}" ${link.external ? html`target="_blank" rel="noopener noreferrer"` : ''}>
            ${ctx.t(link.label)}<span class="sr-only"> — ${ctx.t(project.name)} ${link.external ? ctx.t(UI.opensInNewTab) : ''}</span>
            ${icon('arrow-up-right')}
          </a>`,
      )}
    </footer>
  </article>
`;

const group = (ctx: RenderContext, kind: ProjectKind, label: string) => {
  const items = PROJECTS.filter((p) => p.kind === kind);
  return html`
    <section class="projects__group" aria-labelledby="projects-${kind}">
      <h3 class="t-label projects__group-title" id="projects-${kind}">${label}</h3>
      <div class="projects__list">${items.map((project, i) => projectCard(ctx, project, i))}</div>
    </section>
  `;
};

export function renderProjects(ctx: RenderContext) {
  return html`
    <section class="section projects" id="projects" aria-labelledby="projects-title">
      <div class="container">
        ${sectionHead(ctx, 'projects')}
        ${group(ctx, 'professional', ctx.t(UI.professionalWork))}
        ${group(ctx, 'product', ctx.t(UI.ownProducts))}
      </div>
    </section>
  `;
}
