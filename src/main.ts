import './styles/index.css';

import { getCapabilities, onReducedMotionChange } from './core/capabilities';
import { $, whenIdle, whenLoadedAndIdle, whenNear } from './core/dom';
import { initJourney } from './sections/journey/controller';
import { initStack } from './sections/stack/controller';
import { initContactForm, initCopyButtons } from './ui/contact';
import { initMenu } from './ui/menu';
import { initNav } from './ui/nav';
import { initPreviews } from './ui/previews';
import { initTheme } from './ui/theme';

/**
 * Boot order:
 *  1. The page is complete, static HTML — readable with zero JS.
 *  2. Essential UI (theme, menu, nav, form) wires up immediately; it's tiny.
 *  3. Motion (GSAP, Lenis) is code-split and loaded when the browser is idle,
 *     never for reduced-motion users.
 *  4. 3D scenes load per section after `load` + idle, gated by capability tier.
 *     Without WebGL (tier "off") the CSS drawings remain.
 */
const caps = getCapabilities();

// Each feature boots in isolation: one failure must never take the rest of the page down.
const boot = (name: string, init: () => void) => {
  try {
    init();
  } catch (error) {
    console.error(`[boot] ${name} failed`, error);
  }
};

boot('theme', initTheme);
boot('menu', initMenu);
boot('nav', initNav);
boot('copy', initCopyButtons);
boot('contact', initContactForm);
boot('stack', initStack);
boot('journey', initJourney);
boot('previews', initPreviews);

if (!caps.reducedMotion) {
  whenIdle(() => import('./motion').then(({ initMotion }) => initMotion(caps)));
}

let heroScene: { freeze(): void } | null = null;
const heroStage = $('[data-scene="hero"]');
if (heroStage && caps.tier !== 'off') {
  whenLoadedAndIdle(() =>
    import('./three/hero').then(({ mountHero }) => {
      heroScene = mountHero(heroStage, caps);
    }),
  );
}

let stackScene: { freeze(): void } | null = null;
const stackStage = $('[data-scene="stack"]');
if (stackStage && caps.tier !== 'off') {
  whenLoadedAndIdle(() =>
    whenNear(stackStage, () =>
      import('./three/stack').then(({ mountStack }) => {
        stackScene = mountStack(stackStage, caps);
        stackStage.closest('.stack')?.classList.toggle('has-scene', !!stackScene);
      }),
    ),
  );
}
// Reduced motion switched on mid-visit: tear motion down in place, keep 3D as a still frame.
onReducedMotionChange((reduced) => {
  if (!reduced) return;
  heroScene?.freeze();
  stackScene?.freeze();
  import('./motion').then(({ disableMotion }) => disableMotion());
});
