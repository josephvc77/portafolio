import { relative, sep } from 'node:path';
import type { Plugin } from 'vite';
import type { Locale } from '../src/content/types';
import { renderPage } from '../src/render/page';

/**
 * Static site generation without a framework: each locale's HTML shell
 * (`index.html` → es, `en/index.html` → en) receives the fully rendered page
 * at build time and in dev. Content edits restart the dev server automatically
 * because these modules are dependencies of vite.config.ts.
 */
export function pages(): Plugin {
  let root = process.cwd();

  return {
    name: 'portfolio-pages',
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const file = relative(root, ctx.filename).split(sep).join('/');
        const locale: Locale = file.startsWith('en/') ? 'en' : 'es';
        const page = renderPage(locale);
        return html
          .replace('%LANG%', locale)
          .replace('<!--app-head-->', page.head)
          .replace('<!--app-body-->', page.body);
      },
    },
  };
}
