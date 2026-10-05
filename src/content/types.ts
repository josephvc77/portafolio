export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

/** A string authored side by side in every locale. */
export type L10n = Record<Locale, string>;

export type TechGroup = 'frontend' | 'backend' | 'data' | 'devops' | 'architecture' | 'ux';

export interface Tech<Id extends string = string> {
  id: Id;
  /** Brand names stay as plain strings; descriptive labels are translated. */
  label: string | L10n;
  group: TechGroup;
  /** Technologies this one is used together with — drives the stack constellation. */
  related?: readonly Id[];
  /** Short context shown on hover/focus. Only real usage, never invented claims. */
  note?: L10n;
}

export interface Link {
  label: L10n;
  href: string;
  external?: boolean;
}

export interface Metric {
  value: string;
  label: L10n;
}

/** One layer of an architecture diagram, top (user) to bottom (data). */
export interface ArchLayer {
  label: L10n;
  tech: readonly string[];
}

export interface Experience {
  id: string;
  /** Compact label for cross-references ("used in …"). */
  short: L10n;
  period: string;
  role: L10n;
  org: L10n;
  location: L10n;
  summary: L10n;
  highlights: readonly L10n[];
  tech: readonly string[];
  /** Project ids delivered within this role. */
  projects: readonly string[];
}

export type ProjectKind = 'professional' | 'product';

export interface Project {
  id: string;
  kind: ProjectKind;
  name: string | L10n;
  tagline: L10n;
  role: L10n;
  context: L10n;
  summary: L10n;
  highlights: readonly L10n[];
  tech: readonly string[];
  metrics?: readonly Metric[];
  architecture?: readonly ArchLayer[];
  links?: readonly Link[];
  /**
   * Public site to capture for the visual preview (`npm run previews`).
   * Internal systems have none — they show their architecture diagram instead.
   */
  preview?: { url: string };
  /**
   * Video preview for work without a live site (games): a short silent loop that plays
   * inside a screen frame, its poster, and the full trailer per locale.
   */
  video?: { loop: string; poster: string; trailer: L10n };
  /**
   * Case-study chapters. Optional on purpose: a chapter only renders when real
   * information exists for it — nothing is filled with invented copy.
   */
  caseStudy?: Partial<Record<CaseStudyChapter, L10n>>;
}

export type CaseStudyChapter =
  | 'problem'
  | 'context'
  | 'role'
  | 'architecture'
  | 'challenges'
  | 'solution'
  | 'results'
  | 'lessons';

export const t = (value: L10n | string, locale: Locale): string =>
  typeof value === 'string' ? value : value[locale];
