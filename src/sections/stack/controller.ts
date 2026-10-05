import { $, $$ } from '../../core/dom';
import { readStackData } from './data';
import { stackStore } from './store';
import type { StackData, StackTech } from './types';

/**
 * Chip list behaviour:
 *  - one Tab stop; arrows / Home / End move focus (roving tabindex) and preview
 *  - Enter / Space / click pins (aria-pressed); Escape clears
 *  - hover previews; leaving the list falls back to the pinned tech
 * Visual state is applied as classes; the detail panel and a concise
 * screen-reader status are rendered from the embedded graph data.
 */
export function initStack(): void {
  const root = $('[data-stack-chips]');
  const detail = $('[data-stack-detail]');
  const status = $('[data-stack-status]');
  const source = readStackData();
  if (!root || !detail || !status || !source) return;

  const { data, byId } = source;
  const chips = $$<HTMLButtonElement>('.chip[data-tech]', root);
  const chipById = new Map(chips.map((chip) => [chip.dataset.tech!, chip]));
  const aside = detail.parentElement!;
  const emptyDetail = detail.innerHTML;
  const narrow = matchMedia('(max-width: 63.99em)');

  // ---- Roving focus --------------------------------------------------------
  const focusChip = (index: number) => {
    const chip = chips[(index + chips.length) % chips.length];
    chips.forEach((c) => (c.tabIndex = c === chip ? 0 : -1));
    chip.focus();
  };

  root.addEventListener('keydown', (event) => {
    const index = chips.indexOf(event.target as HTMLButtonElement);
    if (index === -1) return;
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: chips.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      focusChip(moves[event.key]);
    } else if (event.key === 'Escape') {
      stackStore.pin(null);
    }
  });

  // ---- Input → store -------------------------------------------------------
  root.addEventListener('click', (event) => {
    const chip = (event.target as Element).closest<HTMLButtonElement>('.chip[data-tech]');
    if (chip) stackStore.pin(chip.dataset.tech!);
  });
  root.addEventListener('focusin', (event) => {
    const chip = (event.target as Element).closest<HTMLButtonElement>('.chip[data-tech]');
    if (chip && chip.matches(':focus-visible')) stackStore.preview(chip.dataset.tech!);
  });
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget as Node)) stackStore.preview(null);
  });
  root.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return;
    const chip = (event.target as Element).closest<HTMLButtonElement>('.chip[data-tech]');
    if (chip) stackStore.preview(chip.dataset.tech!);
  });
  root.addEventListener('pointerleave', () => stackStore.preview(null));

  detail.addEventListener('click', (event) => {
    const target = (event.target as Element).closest<HTMLElement>('[data-select-tech], [data-clear]');
    if (!target) return;
    if (target.hasAttribute('data-clear')) {
      const pinned = stackStore.pinned;
      stackStore.pin(null);
      if (pinned) chipById.get(pinned)?.focus();
    } else {
      const id = target.dataset.selectTech!;
      stackStore.pin(id);
      chipById.get(id)?.focus({ preventScroll: true });
    }
  });

  // ---- Store → DOM ---------------------------------------------------------
  stackStore.subscribe((active, { pinned }) => {
    const tech = active ? byId.get(active) : undefined;
    const neighbors = new Set(tech?.neighbors);

    root.classList.toggle('has-active', !!tech);
    for (const [id, chip] of chipById) {
      chip.classList.toggle('is-active', id === active);
      chip.classList.toggle('is-related', neighbors.has(id));
      chip.setAttribute('aria-pressed', String(id === pinned));
    }

    renderDetail(detail, tech, data, byId, !!pinned && pinned === active, emptyDetail);
    status.textContent = tech && pinned === active ? summarize(tech, data, byId) : '';

    // Narrow screens: the panel follows the selection so it's never off-screen.
    const group = tech ? chipById.get(tech.id)?.closest('.stack__group') : null;
    if (narrow.matches && group) group.after(detail);
    else if (detail.parentElement !== aside) aside.append(detail);
  });
}

function summarize(tech: StackTech, data: StackData, byId: Map<string, StackTech>): string {
  const used = tech.usedIn.length ? `${data.strings.usedIn}: ${tech.usedIn.map((u) => u.label).join(', ')}.` : data.strings.notUsed;
  const works = tech.neighbors.length ? ` ${data.strings.worksWith}: ${tech.neighbors.map((id) => byId.get(id)?.label).join(', ')}.` : '';
  return `${tech.label}. ${used}${works}`;
}

/** Built with DOM APIs (textContent) — no HTML string injection. */
function renderDetail(
  panel: HTMLElement,
  tech: StackTech | undefined,
  data: StackData,
  byId: Map<string, StackTech>,
  pinned: boolean,
  emptyMarkup: string,
): void {
  if (!tech) {
    panel.innerHTML = emptyMarkup; // trusted: captured from our own build output
    panel.classList.remove('is-filled');
    return;
  }

  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const head = el('div', 'stack__detail-head');
  head.append(el('p', 't-label', data.groups.find((g) => g.id === tech.group)?.label ?? ''), el('h3', 'stack__detail-title', tech.label));
  if (pinned) {
    const clear = el('button', 'icon-btn stack__detail-clear', '×');
    clear.type = 'button';
    clear.dataset.clear = '';
    clear.setAttribute('aria-label', data.strings.clear);
    head.append(clear);
  }

  const used = el('div', 'stack__detail-block');
  used.append(el('p', 't-label', data.strings.usedIn));
  if (tech.usedIn.length) {
    const list = el('ul', 'stack__detail-links');
    list.setAttribute('role', 'list');
    for (const item of tech.usedIn) {
      const li = el('li');
      const link = el('a', 'link', item.label);
      link.href = item.href;
      li.append(link);
      list.append(li);
    }
    used.append(list);
  } else {
    used.append(el('p', 't-muted', data.strings.notUsed));
  }

  panel.replaceChildren(head, used);

  if (tech.neighbors.length) {
    const works = el('div', 'stack__detail-block');
    works.append(el('p', 't-label', data.strings.worksWith));
    const list = el('ul', 'tag-list');
    list.setAttribute('role', 'list');
    for (const id of tech.neighbors) {
      const li = el('li');
      const btn = el('button', 'tag tag--button t-mono', byId.get(id)?.label ?? id);
      btn.type = 'button';
      btn.dataset.selectTech = id;
      li.append(btn);
      list.append(li);
    }
    works.append(list);
    panel.append(works);
  }
  panel.classList.add('is-filled');
}
