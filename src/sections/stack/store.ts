/**
 * Selection state shared by the chip list and the 3D constellation.
 *   preview — transient (hover / keyboard focus)
 *   pinned  — committed (click / Enter)
 * The highlighted technology is `preview ?? pinned`.
 */
export interface StackSelection {
  preview: string | null;
  pinned: string | null;
}

type Listener = (active: string | null, selection: StackSelection) => void;

class StackStore {
  private selection: StackSelection = { preview: null, pinned: null };
  private readonly listeners = new Set<Listener>();

  get active(): string | null {
    return this.selection.preview ?? this.selection.pinned;
  }

  get pinned(): string | null {
    return this.selection.pinned;
  }

  preview(id: string | null): void {
    if (id === this.selection.preview) return;
    this.set({ ...this.selection, preview: id });
  }

  /** Toggle: pinning the pinned tech again clears it. */
  pin(id: string | null): void {
    this.set({ preview: null, pinned: id === this.selection.pinned ? null : id });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.active, this.selection);
    return () => this.listeners.delete(listener);
  }

  private set(next: StackSelection): void {
    const before = this.active;
    const pinnedBefore = this.selection.pinned;
    this.selection = next;
    if (before !== this.active || pinnedBefore !== next.pinned) this.listeners.forEach((fn) => fn(this.active, this.selection));
  }
}

export const stackStore = new StackStore();
