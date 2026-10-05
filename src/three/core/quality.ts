import type { Capabilities, QualityTier } from '../../core/capabilities';

/**
 * Per-tier budgets. Scenes read limits from here — no scene decides its own
 * particle counts or frame rate.
 */
export interface QualityBudget {
  antialias: boolean;
  fps?: number;
  /** Component nodes per interface panel (cols × rows). */
  panelGrid: [number, number];
  pulses: number;
  /** Pointer-reactive camera + hover highlighting. */
  interactive: boolean;
}

const BUDGETS: Record<Exclude<QualityTier, 'off'>, QualityBudget> = {
  high: { antialias: true, panelGrid: [4, 3], pulses: 28, interactive: true },
  medium: { antialias: true, panelGrid: [3, 3], pulses: 16, interactive: true },
  low: { antialias: false, fps: 30, panelGrid: [3, 2], pulses: 0, interactive: false },
};

export function budgetFor(caps: Capabilities): QualityBudget {
  const budget = BUDGETS[caps.tier === 'off' ? 'low' : caps.tier];
  return { ...budget, interactive: budget.interactive && caps.finePointer && !caps.reducedMotion };
}
