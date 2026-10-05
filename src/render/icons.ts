import { ArrowDown, ArrowUpRight, Check, Copy, Download, Menu, Moon, Sun, X, type IconNode } from 'lucide';
import { raw, type Raw } from './html';

/**
 * Icons are inlined as SVG at build time from Lucide's icon data:
 * zero runtime icon JS, no CDN request, no layout shift.
 */
const ICONS = {
  'arrow-down': ArrowDown,
  'arrow-up-right': ArrowUpRight,
  check: Check,
  copy: Copy,
  download: Download,
  menu: Menu,
  moon: Moon,
  sun: Sun,
  x: X,
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof ICONS;

const attrs = (record: Record<string, string | number>): string =>
  Object.entries(record)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

export function icon(name: IconName, className = 'icon'): Raw {
  const children = ICONS[name].map(([tag, props]) => `<${tag} ${attrs(props as Record<string, string>)}/>`).join('');
  return raw(
    `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${children}</svg>`,
  );
}
