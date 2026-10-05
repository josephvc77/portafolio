import { AdditiveBlending, Color, NormalBlending, type Blending } from 'three';

export interface SceneTheme {
  node: Color;
  line: Color;
  accent: Color;
  live: Color;
  fog: Color;
  /** Additive glow reads well on dark grounds and washes out on light ones. */
  blending: Blending;
  dark: boolean;
}

/** Reads the --scene-* tokens so 3D colours come from the design system, not from code. */
export function readSceneTheme(): SceneTheme {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => style.getPropertyValue(name).trim();
  const color = (name: string) => new Color(token(name));
  const additive = token('--scene-blend') === 'additive';

  return {
    node: color('--scene-node'),
    line: color('--scene-line'),
    accent: color('--scene-accent'),
    live: color('--scene-live'),
    fog: color('--scene-fog'),
    blending: additive ? AdditiveBlending : NormalBlending,
    dark: additive,
  };
}

export function onSceneThemeChange(callback: (theme: SceneTheme) => void): () => void {
  const handler = () => callback(readSceneTheme());
  document.addEventListener('ui:theme-change', handler);
  return () => document.removeEventListener('ui:theme-change', handler);
}
