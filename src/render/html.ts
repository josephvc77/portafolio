/**
 * Minimal, safe HTML templating for build-time rendering.
 * Every interpolated value is escaped unless it is already `Raw`
 * (i.e. produced by another `html` call) — content can never inject markup.
 */
export class Raw {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

type Value = Raw | string | number | boolean | null | undefined | readonly Value[];

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (text: string): string => text.replace(/[&<>"']/g, (char) => ESCAPES[char]);

const stringify = (value: Value): string => {
  if (value === null || value === undefined || typeof value === 'boolean') return '';
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(stringify).join('');
  return escapeHtml(String(value));
};

export function html(strings: TemplateStringsArray, ...values: Value[]): Raw {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += stringify(values[i]) + strings[i + 1];
  return new Raw(out);
}

/** Trusted markup only (icons, JSON-LD). */
export const raw = (markup: string): Raw => new Raw(markup);

/** Space-joined class list, skipping falsy entries. */
export const cx = (...names: (string | false | null | undefined)[]): string => names.filter(Boolean).join(' ');
