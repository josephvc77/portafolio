import { seededRandom } from '../core/math';
import type { QualityBudget } from '../core/quality';

/**
 * The hero's subject, as data: the three tiers of the systems Joseph builds.
 *
 *   interface  — three browser panels filled with UI components   (y = +1)
 *   services   — a row of API / backend services                  (y =  0)
 *   data       — database hubs with their records                 (y = -1)
 *
 * Coordinates are layer-local (x, z); a layer's y comes from the live spacing,
 * so the stack can assemble and explode without rebuilding geometry.
 */
export type NodeKind = 'component' | 'anchor' | 'chrome' | 'service' | 'hub' | 'record';

export interface NodeSpec {
  x: number;
  z: number;
  scale: number;
  kind: NodeKind;
}

export interface LayerSpec {
  id: 'interface' | 'services' | 'data';
  /** Multiplier on the live spacing: +1 top, 0 middle, -1 bottom. */
  level: number;
  nodes: NodeSpec[];
  /** Static line segments in layer space, flat [x,y,z, x,y,z, …] (y = 0). */
  lines: number[];
}

/** A connection between two layers — animated as the spacing changes; pulses travel on these. */
export interface LinkSpec {
  from: { layer: number; node: number };
  to: { layer: number; node: number };
}

export interface ArchitectureSpec {
  layers: LayerSpec[];
  links: LinkSpec[];
}

const rect = (x0: number, z0: number, x1: number, z1: number): number[] => [
  x0, 0, z0, x1, 0, z0,
  x1, 0, z0, x1, 0, z1,
  x1, 0, z1, x0, 0, z1,
  x0, 0, z1, x0, 0, z0,
];

const segment = (a: NodeSpec, b: NodeSpec): number[] => [a.x, 0, a.z, b.x, 0, b.z];

export function buildArchitecture(budget: QualityBudget): ArchitectureSpec {
  const random = seededRandom(1337);
  const [cols, rows] = budget.panelGrid;

  // ---- Interface: three browser windows -----------------------------------
  const interfaceNodes: NodeSpec[] = [];
  const interfaceLines: number[] = [];
  const anchors: number[] = [];
  const PANEL_W = 1.8;
  const PANEL_D = 2.2;

  for (const cx of [-2.1, 0, 2.1]) {
    const x0 = cx - PANEL_W / 2;
    const z0 = -PANEL_D / 2;
    interfaceLines.push(...rect(x0, z0, x0 + PANEL_W, z0 + PANEL_D));
    // Title bar.
    interfaceLines.push(x0, 0, z0 + 0.32, x0 + PANEL_W, 0, z0 + 0.32);
    // Window controls.
    for (let i = 0; i < 3; i++) interfaceNodes.push({ x: x0 + 0.18 + i * 0.14, z: z0 + 0.16, scale: 0.45, kind: 'chrome' });

    // Component grid; the cell nearest the centre becomes the panel's root component.
    const cells: NodeSpec[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = cx - 0.62 + (1.24 * c) / Math.max(1, cols - 1);
        const z = -0.5 + (1.35 * r) / Math.max(1, rows - 1);
        if (random() < 0.18 && cells.length > 2) continue; // gaps keep the grid from reading as a template
        cells.push({ x, z, scale: 0.75 + random() * 0.35, kind: 'component' });
      }
    }
    let anchor = 0;
    cells.forEach((cell, i) => {
      if (Math.hypot(cell.x - cx, cell.z - 0.15) < Math.hypot(cells[anchor].x - cx, cells[anchor].z - 0.15)) anchor = i;
    });
    cells[anchor] = { ...cells[anchor], scale: 1.5, kind: 'anchor' };
    anchors.push(interfaceNodes.length + anchor);
    interfaceNodes.push(...cells);
  }

  // ---- Services: an API row ------------------------------------------------
  const serviceNodes: NodeSpec[] = [-2.4, -1.2, 0, 1.2, 2.4].map((x) => ({ x, z: 0, scale: 1.55, kind: 'service' }));
  const serviceLines = [...rect(-3, -0.75, 3, 0.75)];
  for (let i = 1; i < serviceNodes.length; i++) serviceLines.push(...segment(serviceNodes[i - 1], serviceNodes[i]));

  // ---- Data: hubs with records orbiting them ------------------------------
  const dataNodes: NodeSpec[] = [];
  const dataLines = [...rect(-3, -1.15, 3, 1.15)];
  const hubs: number[] = [];
  for (const hx of [-1.8, 0, 1.8]) {
    const hub: NodeSpec = { x: hx, z: 0.15, scale: 2.1, kind: 'hub' };
    hubs.push(dataNodes.length);
    dataNodes.push(hub);
    const records = budget.panelGrid[0] + 2;
    for (let i = 0; i < records; i++) {
      const angle = (i / records) * Math.PI * 2 + random() * 0.4;
      const record: NodeSpec = { x: hx + Math.cos(angle) * 0.48, z: 0.15 + Math.sin(angle) * 0.48, scale: 0.55, kind: 'record' };
      dataLines.push(...segment(hub, record));
      dataNodes.push(record);
    }
  }

  const layers: LayerSpec[] = [
    { id: 'interface', level: 1, nodes: interfaceNodes, lines: interfaceLines },
    { id: 'services', level: 0, nodes: serviceNodes, lines: serviceLines },
    { id: 'data', level: -1, nodes: dataNodes, lines: dataLines },
  ];

  // ---- Links: panel root → two nearest services → nearest data hub --------
  const nearest = (x: number, candidates: number[], nodes: NodeSpec[], count: number) =>
    [...candidates].sort((a, b) => Math.abs(nodes[a].x - x) - Math.abs(nodes[b].x - x)).slice(0, count);

  const links: LinkSpec[] = [];
  const serviceIdx = serviceNodes.map((_, i) => i);
  for (const anchor of anchors) {
    for (const s of nearest(interfaceNodes[anchor].x, serviceIdx, serviceNodes, 2)) {
      links.push({ from: { layer: 0, node: anchor }, to: { layer: 1, node: s } });
    }
  }
  serviceNodes.forEach((service, s) => {
    for (const hub of nearest(service.x, hubs, dataNodes, 1)) links.push({ from: { layer: 1, node: s }, to: { layer: 2, node: hub } });
  });

  return { layers, links };
}
