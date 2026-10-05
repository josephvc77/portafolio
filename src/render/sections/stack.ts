import { EXPERIENCE, PROJECTS, TECH_GROUPS, TECH_LIST, UI } from '../../content';
import type { StackData } from '../../sections/stack/types';
import type { RenderContext } from '../context';
import { html, raw } from '../html';
import { sectionHead } from './section-head';

/** Undirected "works with" graph from the curated `related` lists. */
function neighborsOf(id: string): string[] {
  const out = new Set<string>();
  for (const tech of TECH_LIST) {
    const related: readonly string[] = 'related' in tech ? tech.related : [];
    if (tech.id === id) related.forEach((r) => out.add(r));
    else if (related.includes(id)) out.add(tech.id);
  }
  return [...out];
}

function buildStackData(ctx: RenderContext): StackData {
  return {
    groups: TECH_GROUPS.map((g) => ({ id: g.id, label: ctx.t(g.label) })),
    techs: TECH_LIST.map((tech) => {
      const projects = PROJECTS.filter((p) => p.tech.includes(tech.id));
      const roles = EXPERIENCE.filter((e) => e.tech.includes(tech.id));
      return {
        id: tech.id,
        label: ctx.t(tech.label),
        group: tech.group,
        weight: projects.length + roles.length,
        neighbors: neighborsOf(tech.id),
        usedIn: [
          ...projects.map((p) => ({ label: ctx.t(p.name), href: `#project-${p.id}` })),
          ...roles.map((e) => ({ label: ctx.t(e.short), href: `#exp-${e.id}` })),
        ],
      };
    }),
    strings: {
      usedIn: ctx.t(UI.usedIn),
      worksWith: ctx.t(UI.worksWith),
      notUsed: ctx.t(UI.stackNotUsed),
      clear: ctx.t(UI.clearSelection),
      summary: ctx.t(UI.stackSummary),
    },
  };
}

/**
 * Stack ecosystem. The chip list is the accessible control surface (roving
 * focus, toggle buttons); the 3D constellation in `.stack__stage` mirrors it.
 */
export function renderStack(ctx: RenderContext) {
  const data = buildStackData(ctx);
  const summary = data.strings.summary.replace('{count}', String(data.techs.length)).replace('{groups}', String(data.groups.length));
  let first = true;

  return html`
    <section class="section stack" id="stack" aria-labelledby="stack-title">
      <div class="container">
        ${sectionHead(ctx, 'stack')}

        <div class="stack__layout">
          <aside class="stack__aside">
            <div class="stack__stage" data-scene="stack" aria-hidden="true">
              <div class="stack__labels" data-stack-labels></div>
            </div>
            <div class="stack__detail glass glass--panel" data-stack-detail>
              <p class="t-label">${summary}</p>
              <p class="stack__detail-empty t-muted">${ctx.t(UI.stackIntro)}</p>
            </div>
          </aside>

          <div class="stack__groups" role="group" aria-label="${ctx.t(UI.stackTechnologies)}" aria-describedby="stack-hint" data-stack-chips>
            <p class="sr-only" id="stack-hint">${ctx.t(UI.stackHint)}</p>
            ${data.groups.map((group) => {
              const techs = data.techs.filter((tech) => tech.group === group.id);
              return html`
                <section class="stack__group" aria-labelledby="stack-${group.id}" data-group="${group.id}" data-reveal-group>
                  <h3 class="t-label" id="stack-${group.id}">${group.label}</h3>
                  <ul class="chip-list" role="list">
                    ${techs.map((tech) => {
                      const tabindex = first ? '0' : '-1';
                      first = false;
                      return html`
                        <li data-reveal="fade-up">
                          <button class="chip" type="button" data-tech="${tech.id}" aria-pressed="false" tabindex="${tabindex}">
                            ${tech.label}
                          </button>
                        </li>`;
                    })}
                  </ul>
                </section>`;
            })}
          </div>
        </div>

        <p class="sr-only" role="status" aria-live="polite" data-stack-status></p>
        <script type="application/json" id="stack-graph">${raw(JSON.stringify(data).replace(/</g, '\\u003c'))}</script>
      </div>
    </section>
  `;
}
