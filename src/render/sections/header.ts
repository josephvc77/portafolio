import { PROFILE, SECTIONS, UI } from '../../content';
import type { RenderContext } from '../context';
import { html } from '../html';
import { icon } from '../icons';

export function renderHeader(ctx: RenderContext) {
  const navLinks = SECTIONS.filter((s) => s.id !== 'contact');
  const langLabel = ctx.otherLocale.toUpperCase();

  const links = (className: string) =>
    navLinks.map((section) => html`<li><a class="${className}" href="#${section.id}" data-nav-link>${ctx.t(section.nav)}</a></li>`);

  return html`
    <a class="skip-link" href="#main">${ctx.t(UI.skipLink)}</a>

    <header class="site-header" data-header>
      <div class="site-header__bar glass glass--pill">
        <a class="site-header__brand" href="#top" aria-label="${PROFILE.name}">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="t-mono">${PROFILE.shortName}</span>
        </a>

        <nav class="site-nav" aria-label="${ctx.t(UI.primaryNav)}">
          <ul class="site-nav__list" role="list">${links('site-nav__link')}</ul>
        </nav>

        <div class="site-header__actions">
          <a class="icon-btn t-mono" href="${ctx.pathFor(ctx.otherLocale)}" hreflang="${ctx.otherLocale}" lang="${ctx.otherLocale}"
             aria-label="${ctx.t(UI.switchLanguage)}" data-lang-switch>${langLabel}</a>
          <button class="icon-btn" type="button" aria-label="${ctx.t(UI.themeToggle)}" data-theme-toggle>
            ${icon('sun', 'icon icon--sun')}${icon('moon', 'icon icon--moon')}
          </button>
          <a class="btn btn--primary btn--sm site-header__cta" href="#contact" data-magnetic>${ctx.t(UI.hire)}</a>
          <button class="icon-btn site-header__menu" type="button" aria-label="${ctx.t(UI.openMenu)}"
                  aria-haspopup="dialog" aria-controls="mobile-menu" data-menu-open>
            ${icon('menu')}
          </button>
        </div>
      </div>
    </header>

    <dialog class="mobile-menu" id="mobile-menu" aria-label="${ctx.t(UI.primaryNav)}">
      <div class="mobile-menu__inner">
        <button class="icon-btn mobile-menu__close" type="button" aria-label="${ctx.t(UI.closeMenu)}" data-menu-close>
          ${icon('x')}
        </button>
        <nav aria-label="${ctx.t(UI.primaryNav)}">
          <ol class="mobile-menu__list" role="list">
            ${SECTIONS.map(
              (section, i) => html`
                <li>
                  <a class="mobile-menu__link" href="#${section.id}" data-menu-link>
                    <span class="t-label">${String(i + 1).padStart(2, '0')}</span>
                    <span>${ctx.t(section.nav)}</span>
                  </a>
                </li>`,
            )}
          </ol>
        </nav>
      </div>
    </dialog>
  `;
}
