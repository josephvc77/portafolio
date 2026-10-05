import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Shape written by scripts/capture-previews.ts. */
export interface PreviewImage {
  src: string;
  width: number;
  height: number;
}

export interface PreviewEntry {
  url: string;
  capturedAt: string;
  desktop: PreviewImage;
  mobile: PreviewImage;
  scroll: PreviewImage;
}

const MANIFEST = resolve(process.cwd(), 'public/previews/manifest.json');

let cache: Record<string, PreviewEntry> | null = null;

/** Build-time only. A project without captures simply renders without a preview. */
export function previewFor(id: string): PreviewEntry | undefined {
  cache ??= existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, 'utf8')) as Record<string, PreviewEntry>) : {};
  return cache[id];
}
