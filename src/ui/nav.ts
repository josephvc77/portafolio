import { $, $$, latest } from '../core/dom';

/**
 * Header state + active-section indicator, both via IntersectionObserver
 * (no scroll listeners).
 */
export function initNav(): void {
  const header = $('[data-header]');
  const hero = $('#top');
  if (header && hero) {
    new IntersectionObserver((entries) => header.classList.toggle('is-scrolled', !latest(entries).isIntersecting), {
      rootMargin: '-80px 0px 0px 0px',
    }).observe(hero);
  }

  const links = $$<HTMLAnchorElement>('[data-nav-link]');
  const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

  const setActive = (id: string | null) =>
    links.forEach((link) => {
      if (link.hash.slice(1) === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

  // A section is "current" while it crosses the band 40–60% down the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
  if (hero) new IntersectionObserver((entries) => latest(entries).isIntersecting && setActive(null), { threshold: 0.6 }).observe(hero);
}
