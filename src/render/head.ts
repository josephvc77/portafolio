import { LOCALES, PROFILE, PROJECTS, SEO, SITE_URL, TECH_LIST } from '../content';
import type { RenderContext } from './context';
import { html, raw, type Raw } from './html';

const OG_LOCALE = { es: 'es_MX', en: 'en_US' } as const;

/** Runs before first paint: theme without flash, and a `js` hook for progressive enhancement. */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{var s=localStorage.getItem('theme');d.dataset.theme=s||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}catch(e){}})();`;

function structuredData(ctx: RenderContext): Raw {
  const personId = `${SITE_URL}/#person`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: PROFILE.name,
        jobTitle: PROFILE.roles.map((role) => ctx.t(role)).join(' · '),
        email: `mailto:${PROFILE.email}`,
        url: SITE_URL,
        sameAs: Object.values(PROFILE.social),
        worksFor: { '@type': 'Organization', name: PROFILE.company.name, url: PROFILE.company.url },
        knowsAbout: TECH_LIST.map((tech) => ctx.t(tech.label)),
        knowsLanguage: ['es', 'en'],
        alumniOf: { '@type': 'CollegeOrUniversity', name: PROFILE.education[0].school },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${ctx.urlFor(ctx.locale)}#page`,
        url: ctx.urlFor(ctx.locale),
        inLanguage: ctx.locale,
        name: ctx.t(SEO.title),
        description: ctx.t(SEO.description),
        mainEntity: { '@id': personId },
        hasPart: PROJECTS.map((project) => ({
          '@type': 'CreativeWork',
          name: ctx.t(project.name),
          description: ctx.t(project.summary),
          url: `${ctx.urlFor(ctx.locale)}#project-${project.id}`,
        })),
      },
    ],
  };
  // `<` escaped so content can never close the script tag.
  return raw(JSON.stringify(data).replace(/</g, '\\u003c'));
}

export function renderHead(ctx: RenderContext): Raw {
  const url = ctx.urlFor(ctx.locale);
  return html`
    <title>${ctx.t(SEO.title)}</title>
    <meta name="description" content="${ctx.t(SEO.description)}" />
    <meta name="author" content="${PROFILE.name}" />
    <meta name="theme-color" content="#0b0c0f" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#f3f4f6" media="(prefers-color-scheme: light)" />
    <link rel="canonical" href="${url}" />
    ${LOCALES.map((locale) => html`<link rel="alternate" hreflang="${locale}" href="${ctx.urlFor(locale)}" />`)}
    <link rel="alternate" hreflang="x-default" href="${ctx.urlFor('es')}" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${ctx.t(SEO.title)}" />
    <meta property="og:description" content="${ctx.t(SEO.description)}" />
    <meta property="og:locale" content="${OG_LOCALE[ctx.locale]}" />
    <meta property="og:locale:alternate" content="${OG_LOCALE[ctx.otherLocale]}" />
    <meta name="twitter:card" content="summary" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400..600&family=Geist+Mono:wght@400..500&display=swap" />

    <script>${raw(BOOT_SCRIPT)}</script>
    <script type="application/ld+json">${structuredData(ctx)}</script>
  `;
}
