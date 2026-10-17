/**
 * Card sprites are pre-rendered once (per size / theme change) to offscreen canvases so the
 * frame loop only calls drawImage. Tints come from the PatternArt palette tokens, read from CSS
 * so the dark theme gets its own pinks without a second code path.
 */

type Sprites = { canvases: HTMLCanvasElement[]; size: number; dpr: number };

function readToken(style: CSSStyleDeclaration, name: string): string {
  return style.getPropertyValue(name).trim();
}

function buildSprite(color: string, edge: string, size: number, dpr: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const pixels = Math.ceil(size * dpr);
  canvas.width = pixels;
  canvas.height = pixels;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.scale(dpr, dpr);

  const radius = size * 0.08;
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, size - 1, size - 1, radius);
  ctx.fillStyle = color;
  ctx.fill();

  // Faint halftone: a dot grid clipped to the card, like the PatternArt tiles.
  ctx.save();
  ctx.clip();
  ctx.fillStyle = edge;
  ctx.globalAlpha = 0.35;
  const pitch = Math.max(5, size / 16);
  for (let y = pitch / 2; y < size; y += pitch) {
    for (let x = pitch / 2; x < size; x += pitch) {
      ctx.beginPath();
      ctx.arc(x, y, pitch * 0.14, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // A hairline edge keeps overlapping cards readable as a stepped stack.
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, size - 1, size - 1, radius);
  ctx.strokeStyle = edge;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.stroke();
  return canvas;
}

function buildSprites(reference: Element, size: number, dpr: number): Sprites {
  const style = getComputedStyle(reference);
  const accent = readToken(style, "--accent");
  const tints = [
    readToken(style, "--accent-soft-1"),
    readToken(style, "--accent-soft-2"),
    readToken(style, "--accent-soft-3"),
    readToken(style, "--accent-soft-1"),
  ];
  return {
    canvases: tints.map((tint) => buildSprite(tint, accent, size, dpr)),
    size,
    dpr,
  };
}

export { buildSprites };
export type { Sprites };
