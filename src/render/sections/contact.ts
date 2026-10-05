import { PROFILE, UI } from '../../content';
import type { RenderContext } from '../context';
import { html } from '../html';
import { icon } from '../icons';
import { sectionHead } from './section-head';

export function renderContact(ctx: RenderContext) {
  const f = UI.form;
  return html`
    <section class="section contact" id="contact" aria-labelledby="contact-title">
      <div class="container">
        ${sectionHead(ctx, 'contact')}

        <div class="contact__grid">
          <div class="contact__info" data-reveal-group>
            <p class="t-lede" data-reveal="fade-up">${ctx.t(UI.contactLede)}</p>

            <div class="contact__email" data-reveal="fade-up">
              <a class="contact__email-link" href="mailto:${PROFILE.email}">${PROFILE.email}</a>
              <button class="icon-btn" type="button" data-copy="${PROFILE.email}"
                      data-copied-label="${ctx.t(UI.copied)}" data-failed-label="${ctx.t(UI.copyFailed)}"
                      aria-label="${ctx.t(UI.copyEmail)}">
                ${icon('copy')}
              </button>
            </div>

            <dl class="contact__facts t-mono" data-reveal="fade-up">
              <div><dt class="t-label">${ctx.t(UI.basedIn)}</dt><dd>${ctx.t(PROFILE.location)}</dd></div>
              <div><dt class="t-label">${ctx.t(UI.languages)}</dt><dd>${ctx.t(PROFILE.languages)}</dd></div>
            </dl>

            <ul class="contact__links" role="list" data-reveal="fade-up">
              <li><a class="link" href="${PROFILE.social.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ${icon('arrow-up-right')}<span class="sr-only">${ctx.t(UI.opensInNewTab)}</span></a></li>
              <li><a class="link" href="${PROFILE.social.github}" target="_blank" rel="noopener noreferrer">GitHub ${icon('arrow-up-right')}<span class="sr-only">${ctx.t(UI.opensInNewTab)}</span></a></li>
              <li><a class="link" href="${PROFILE.cv}" download>${ctx.t(UI.downloadCv)} ${icon('download')}</a></li>
            </ul>
          </div>

          <!-- Netlify Forms: must exist in static HTML so Netlify can detect it at deploy. -->
          <form class="form glass glass--panel" name="contact" method="POST" data-netlify="true"
                netlify-honeypot="bot-field" data-contact-form
                data-sending-label="${ctx.t(f.sending)}" data-success-label="${ctx.t(f.success)}" data-error-label="${ctx.t(f.error)}">
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="locale" value="${ctx.locale}" />
            <p class="sr-only"><label>${ctx.t(f.honeypot)} <input name="bot-field" tabindex="-1" autocomplete="off" /></label></p>

            <div class="field">
              <label class="field__label" for="contact-name">${ctx.t(f.name)}</label>
              <input class="field__input" id="contact-name" name="name" type="text" autocomplete="name" required />
            </div>
            <div class="field">
              <label class="field__label" for="contact-email">${ctx.t(f.email)}</label>
              <input class="field__input" id="contact-email" name="email" type="email" autocomplete="email" required />
            </div>
            <div class="field">
              <label class="field__label" for="contact-message">${ctx.t(f.message)}</label>
              <textarea class="field__input field__input--area" id="contact-message" name="message" rows="5" required
                        aria-describedby="contact-message-hint"></textarea>
              <p class="field__hint t-muted" id="contact-message-hint">${ctx.t(f.messageHint)}</p>
            </div>

            <button class="btn btn--primary btn--block" type="submit" data-magnetic>${ctx.t(f.submit)}</button>
            <p class="form__status" role="status" aria-live="polite" data-form-status></p>
          </form>
        </div>
      </div>
    </section>
  `;
}
