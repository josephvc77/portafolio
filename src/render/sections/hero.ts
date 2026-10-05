import { PROFILE, UI } from '../../content';
import type { RenderContext } from '../context';
import { html } from '../html';
import { icon } from '../icons';

export function renderHero(ctx: RenderContext) {
  const [primaryRole, ...secondaryRoles] = PROFILE.roles;

  return html`
    <section class="hero" id="top" aria-labelledby="hero-title">
      <!-- 3D stage (Phase 3). Decorative: everything it shows is also in the HTML. -->
      <div class="hero__stage" data-scene="hero" aria-hidden="true">
        <div class="hero__fallback"></div>
      </div>

      <div class="container hero__inner">
        <p class="hero__status t-label" data-intro style="--i:0">
          <span class="live-dot" aria-hidden="true"></span>${ctx.t(UI.availability)}
        </p>

        <h1 class="hero__title" id="hero-title">
          <span class="hero__name t-label" data-intro style="--i:1">${PROFILE.name}</span>
          <span class="hero__role t-display"><span class="hero__role-line" data-intro="rise" style="--i:1">${ctx.t(primaryRole)}</span></span>
        </h1>

        <p class="hero__roles t-mono" data-intro style="--i:2">
          ${secondaryRoles.map((role, i) => html`${i > 0 ? html`<span aria-hidden="true"> / </span>` : ''}${ctx.t(role)}`)}
        </p>

        <p class="hero__pitch t-lede" data-intro style="--i:3">${ctx.t(PROFILE.pitch)}</p>

        <div class="hero__ctas" data-intro style="--i:4">
          <a class="btn btn--primary" href="#projects" data-magnetic>
            ${ctx.t(UI.ctaProjects)} ${icon('arrow-down')}
          </a>
          <a class="btn btn--ghost" href="#experience" data-magnetic>${ctx.t(UI.ctaExperience)}</a>
          <a class="btn btn--ghost" href="#contact" data-magnetic>${ctx.t(UI.ctaContact)}</a>
        </div>

        <dl class="hero__meta t-mono" data-intro style="--i:5">
          <div><dt class="t-label">${ctx.t(UI.basedIn)}</dt><dd>${ctx.t(PROFILE.location)}</dd></div>
          <div><dt class="t-label">${ctx.t(UI.core)}</dt><dd>Angular · TypeScript · RxJS</dd></div>
          <div>
            <dt class="t-label">CV</dt>
            <dd><a class="link" href="${PROFILE.cv}" download>${ctx.t(UI.downloadCv)} ${icon('download')}</a></dd>
          </div>
        </dl>
      </div>
    </section>
  `;
}
