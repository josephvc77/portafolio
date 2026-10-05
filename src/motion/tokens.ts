/**
 * Motion tokens — the JS mirror of the --dur-* / --ease-* CSS tokens.
 * Every GSAP tween in the project pulls from here; no ad-hoc numbers.
 *
 * Levels (from the motion-design skill):
 *   L1 micro      → instant / fast    (hover, press, cursor)
 *   L2 component  → fast / base       (menus, cards entering)
 *   L3 section    → base / slow       (reveals, parallax)
 *   L4 experience → slow / cinematic  (pinned scenes, camera moves)
 */
export const DURATION = {
  instant: 0.12,
  fast: 0.24,
  base: 0.48,
  slow: 0.8,
  cinematic: 1.2,
} as const;

/** GSAP equivalents of the CSS cubic-beziers. */
export const EASE = {
  out: 'expo.out', //         ≈ --ease-out    cubic-bezier(.16,1,.3,1)
  inOut: 'power3.inOut', //   ≈ --ease-in-out cubic-bezier(.65,0,.35,1)
  standard: 'power2.out', //  ≈ --ease-standard
  spring: 'elastic.out(1, 0.6)', // magnetic release only
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

/** Travel distances (px) for entrance presets — small on purpose. */
export const DISTANCE = {
  sm: 12,
  md: 24,
  lg: 48,
} as const;
