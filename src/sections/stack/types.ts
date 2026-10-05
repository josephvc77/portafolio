/**
 * Payload embedded in the page at build time (<script type="application/json" id="stack-graph">)
 * so the client never bundles the content modules.
 */
export interface StackTech {
  id: string;
  label: string;
  group: string;
  /** Number of projects + roles it appears in — drives node size. */
  weight: number;
  /** Undirected neighbours in the "works with" graph. */
  neighbors: string[];
  usedIn: { label: string; href: string }[];
}

export interface StackData {
  groups: { id: string; label: string }[];
  techs: StackTech[];
  strings: {
    usedIn: string;
    worksWith: string;
    notUsed: string;
    clear: string;
    summary: string;
  };
}
