import { LOCALES, SITE_URL, t, type L10n, type Locale } from '../content';

export interface RenderContext {
  locale: Locale;
  /** Translate a localized value (or pass a plain string through). */
  t: (value: L10n | string) => string;
  /** Absolute path of a locale's home page. */
  pathFor: (locale: Locale) => string;
  /** Absolute URL of a locale's home page. */
  urlFor: (locale: Locale) => string;
  otherLocale: Locale;
}

const PATHS: Record<Locale, string> = { es: '/', en: '/en/' };

export function createContext(locale: Locale): RenderContext {
  return {
    locale,
    t: (value) => t(value, locale),
    pathFor: (target) => PATHS[target],
    urlFor: (target) => `${SITE_URL}${PATHS[target]}`,
    otherLocale: LOCALES.find((l) => l !== locale)!,
  };
}
