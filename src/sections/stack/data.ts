import type { StackData, StackTech } from './types';

let cached: { data: StackData; byId: Map<string, StackTech> } | null = null;

export function readStackData(): { data: StackData; byId: Map<string, StackTech> } | null {
  if (cached) return cached;
  const script = document.getElementById('stack-graph');
  if (!script?.textContent) return null;
  const data = JSON.parse(script.textContent) as StackData;
  cached = { data, byId: new Map(data.techs.map((tech) => [tech.id, tech])) };
  return cached;
}
