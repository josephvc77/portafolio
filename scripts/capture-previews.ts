/**
 * Captures project previews from their live sites with headless Chrome (DevTools protocol, no deps).
 *
 *   bun scripts/capture-previews.ts            # every project with `preview.url`
 *   bun scripts/capture-previews.ts kiln-store # just one
 *
 * Writes to public/previews/:
 *   <id>-desktop.webp   1440×900 first screen
 *   <id>-scroll.webp    first ~3 screens at 0.75× — loaded only on hover (scroll-through effect)
 *   <id>-mobile.webp    390×844 @2x first screen
 *   manifest.json       dimensions per image → width/height attributes (no layout shift)
 *
 * Runs on Bun (or Node ≥ 22) because it needs a global WebSocket.
 * Requires Google Chrome; override the path with CHROME_PATH.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { PROJECTS } from '../src/content/projects';

const OUT = resolve(import.meta.dirname, '../public/previews');
const MANIFEST = join(OUT, 'manifest.json');
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const SCROLL_SCREENS = 3;
const SCROLL_SCALE = 0.75;

/** Host overlays and interruptions that are not part of the site's design. */
const HIDE_OVERLAYS = `
  iframe#nl-badge-frame, [id^="netlify"], #onetrust-banner-sdk, .cookie-banner,
  .modal, [class*="modal-backdrop"], dialog[open], [role="dialog"], [role="alertdialog"] { display: none !important; }
  body.modal-open { overflow: auto !important; padding-right: 0 !important; }
`;

/**
 * Fixed bars that talk about cookies/privacy (consent banners). Matched by text so
 * fixed elements that ARE the design (3D canvases, pinned sections) are untouched.
 */
const HIDE_CONSENT = `(() => {
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.position !== 'fixed' && style.position !== 'sticky') continue;
    if (/cookie|privacidad|privacy|consent/i.test(el.textContent || '')) el.style.setProperty('display', 'none', 'important');
  }
})()`;

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function launch() {
  const port = 9400 + Math.floor(Math.random() * 400);
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${mkdtempSync(join(tmpdir(), 'previews-'))}`,
      '--enable-unsafe-swiftshader',
      '--use-angle=swiftshader',
      '--hide-scrollbars',
      '--no-first-run',
      '--disable-renderer-backgrounding',
      '--disable-background-timer-throttling',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  let wsUrl: string | undefined;
  for (let i = 0; i < 50 && !wsUrl; i++) {
    await sleep(200);
    try {
      const list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()) as { type: string; webSocketDebuggerUrl: string }[];
      wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
  }
  if (!wsUrl) throw new Error('Chrome did not start');

  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let nextId = 0;
  const pending = new Map<number, (msg: any) => void>();
  ws.onmessage = (event) => {
    const msg = JSON.parse(String(event.data));
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)!(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method: string, params: object = {}): Promise<any> =>
    new Promise((r) => {
      const id = ++nextId;
      pending.set(id, r);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');
  return {
    send,
    close: () => {
      ws.close();
      chrome.kill();
    },
  };
}

type Send = Awaited<ReturnType<typeof launch>>['send'];

const evaluate = (send: Send, expression: string) => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });

async function open(send: Send, url: string, metrics: typeof DESKTOP) {
  await send('Emulation.setDeviceMetricsOverride', metrics);
  await send('Emulation.setTouchEmulationEnabled', { enabled: metrics.mobile });
  await send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-reduced-motion', value: 'no-preference' },
      { name: 'prefers-color-scheme', value: 'light' }, // deterministic: never inherit the host OS theme
    ],
  });
  await send('Page.navigate', { url });
  await sleep(5000); // fonts, WebGL scenes and intro animations
  await evaluate(send, `(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(HIDE_OVERLAYS)}; document.head.append(s); })()`);
  await evaluate(send, HIDE_CONSENT);
  await sleep(300);
}

/** Walk the page once so scroll-triggered reveals and lazy images have fired, then return to the top. */
async function primeScroll(send: Send) {
  await evaluate(
    send,
    `(async () => {
      const step = innerHeight * 0.6;
      for (let y = 0; y < Math.min(document.documentElement.scrollHeight, innerHeight * ${SCROLL_SCREENS + 1}); y += step) {
        scrollTo(0, y); await new Promise(r => setTimeout(r, 350));
      }
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 1500));
    })()`,
  );
}

async function grab(send: Send, format: 'webp' | 'png' = 'webp'): Promise<string> {
  const response = await send('Page.captureScreenshot', { format, quality: 78 });
  if (!response.result) throw new Error(response.error?.message ?? 'capture failed');
  return response.result.data as string;
}

const save = (file: string, base64: string) => writeFileSync(join(OUT, file), Buffer.from(base64, 'base64'));

/**
 * Scroll strip: real viewport captures taken while actually scrolling (so reveal
 * animations and pinned sections render as a visitor sees them), stitched inside
 * Chrome with a canvas. Fixed/sticky chrome is hidden after the first screen so
 * the header doesn't repeat down the strip.
 */
async function scrollStrip(send: Send): Promise<{ data: string; height: number }> {
  const frames: { y: number; data: string }[] = [];
  for (let i = 0; i < SCROLL_SCREENS; i++) {
    const res = await evaluate(
      send,
      `(async () => {
        scrollTo(0, ${i * DESKTOP.height});
        await new Promise(r => setTimeout(r, 1400));
        // Only header-like bars (pinned to the top, short). Fixed canvases or pinned
        // sections are part of the design and must stay.
        if (${i} === 1) for (const el of document.querySelectorAll('body *')) {
          const p = getComputedStyle(el).position;
          if (p !== 'fixed' && p !== 'sticky') continue;
          const r = el.getBoundingClientRect();
          if (r.top <= 8 && r.height > 0 && r.height < 160 && r.width > innerWidth * 0.5) el.style.visibility = 'hidden';
        }
        return Math.round(scrollY);
      })()`,
    );
    const y = Number(res.result?.result?.value ?? i * DESKTOP.height);
    if (frames.length && y === frames[frames.length - 1].y) break; // page shorter than requested
    frames.push({ y, data: await grab(send, 'png') });
  }

  const height = frames[frames.length - 1].y + DESKTOP.height;
  const stitched = await evaluate(
    send,
    `(async () => {
      const frames = ${JSON.stringify(frames)};
      const scale = ${SCROLL_SCALE};
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(${DESKTOP.width} * scale);
      canvas.height = Math.round(${height} * scale);
      const ctx = canvas.getContext('2d');
      for (const f of frames) {
        const img = new Image();
        img.src = 'data:image/png;base64,' + f.data;
        await img.decode();
        ctx.drawImage(img, 0, Math.round(f.y * scale), canvas.width, Math.round(${DESKTOP.height} * scale));
      }
      return canvas.toDataURL('image/webp', 0.78).split(',')[1];
    })()`,
  );
  const data = stitched.result?.result?.value as string | undefined;
  if (!data) throw new Error('stitching failed');
  return { data, height };
}

async function capture(id: string, url: string): Promise<PreviewEntry> {
  const { send, close } = await launch();
  try {
    await open(send, url, DESKTOP);
    await primeScroll(send);
    save(`${id}-desktop.webp`, await grab(send));

    const strip = await scrollStrip(send);
    save(`${id}-scroll.webp`, strip.data);
    const scrollHeight = strip.height;

    await open(send, url, MOBILE);
    save(`${id}-mobile.webp`, await grab(send));

    return {
      url,
      capturedAt: new Date().toISOString().slice(0, 10),
      desktop: { src: `/previews/${id}-desktop.webp`, width: DESKTOP.width, height: DESKTOP.height },
      scroll: { src: `/previews/${id}-scroll.webp`, width: Math.round(DESKTOP.width * SCROLL_SCALE), height: Math.round(scrollHeight * SCROLL_SCALE) },
      mobile: { src: `/previews/${id}-mobile.webp`, width: MOBILE.width * MOBILE.deviceScaleFactor, height: MOBILE.height * MOBILE.deviceScaleFactor },
    };
  } finally {
    close();
  }
}

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
const manifest: Record<string, PreviewEntry> = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const only = process.argv[2];

for (const project of PROJECTS) {
  if (!project.preview || (only && project.id !== only)) continue;
  process.stdout.write(`capturing ${project.id} … `);
  try {
    manifest[project.id] = await capture(project.id, project.preview.url);
    console.log('ok');
  } catch (error) {
    console.log(`failed (${(error as Error).message}) — keeping previous capture if any`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest: ${Object.keys(manifest).length} project(s)`);
