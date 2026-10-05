import { seededRandom } from '../core/math';
import type { StackData } from '../../sections/stack/types';

export interface NodeLayout {
  id: string;
  x: number;
  y: number;
  z: number;
  scale: number;
}

export interface StackLayout {
  nodes: NodeLayout[];
  index: Map<string, number>;
  /** Undirected edges as node-index pairs. */
  edges: [number, number][];
  groups: { id: string; label: string; x: number; y: number; z: number }[];
}

export const RING_RADIUS = 2.6;

/**
 * Orbital layout: each domain is a cluster on a horizontal ring; technologies
 * sit on a small Fibonacci sphere around their cluster centre. Heavier
 * (more-used) technologies are larger. Deterministic — same picture every load.
 */
export function layoutStack(data: StackData): StackLayout {
  const random = seededRandom(42);
  const nodes: NodeLayout[] = [];
  const groups: StackLayout['groups'] = [];

  data.groups.forEach((group, g) => {
    const angle = (g / data.groups.length) * Math.PI * 2;
    const cx = Math.sin(angle) * RING_RADIUS;
    const cz = Math.cos(angle) * RING_RADIUS;
    const cy = (g % 2 === 0 ? 0.25 : -0.25) + (random() - 0.5) * 0.2;
    groups.push({ id: group.id, label: group.label, x: cx, y: cy + 1.05, z: cz });

    const members = data.techs.filter((tech) => tech.group === group.id);
    const radius = 0.45 + Math.sqrt(members.length) * 0.16;
    const golden = Math.PI * (3 - Math.sqrt(5));
    members.forEach((tech, i) => {
      const y = members.length === 1 ? 0 : 1 - (i / (members.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i + random() * 0.3;
      nodes.push({
        id: tech.id,
        x: cx + Math.cos(theta) * r * radius,
        y: cy + y * radius * 0.8,
        z: cz + Math.sin(theta) * r * radius,
        scale: 0.75 + Math.min(tech.weight, 8) * 0.11,
      });
    });
  });

  const index = new Map(nodes.map((node, i) => [node.id, i]));
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (const tech of data.techs) {
    for (const other of tech.neighbors) {
      const key = [tech.id, other].sort().join('|');
      const a = index.get(tech.id);
      const b = index.get(other);
      if (seen.has(key) || a === undefined || b === undefined) continue;
      seen.add(key);
      edges.push([a, b]);
    }
  }

  return { nodes, index, edges, groups };
}
