import { SpriteFrame } from "./types";

export interface SpriteSheet {
  frames: Map<string, SpriteFrame>;
  palette: string[];
}

export function createSpriteSheet(palette: string[]): SpriteSheet {
  return {
    frames: new Map(),
    palette,
  };
}

export function addFrame(sheet: SpriteSheet, name: string, frame: SpriteFrame) {
  sheet.frames.set(name, frame);
}

export function getFrame(sheet: SpriteSheet, name: string): SpriteFrame | undefined {
  return sheet.frames.get(name);
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  frame: SpriteFrame,
  palette: string[],
  x: number,
  y: number,
  flipX: boolean = false
) {
  for (let row = 0; row < frame.data.length; row++) {
    for (let col = 0; col < frame.data[row].length; col++) {
      const colorIndex = frame.data[row][col];
      if (colorIndex === 0) continue;
      const drawX = flipX ? x + frame.width - 1 - col : x + col;
      ctx.fillStyle = palette[colorIndex];
      ctx.fillRect(drawX, y + row, 1, 1);
    }
  }
}

export function tintSprite(palette: string[], tintColor: string, amount: number = 0.3): string[] {
  return palette.map((color, i) => {
    if (i === 0) return color;
    return blendColors(color, tintColor, amount);
  });
}

function blendColors(base: string, blend: string, amount: number): string {
  const b = hexToRgb(base);
  const t = hexToRgb(blend);
  if (!b || !t) return base;
  const r = Math.round(b.r * (1 - amount) + t.r * amount);
  const g = Math.round(b.g * (1 - amount) + t.g * amount);
  const bl = Math.round(b.b * (1 - amount) + t.b * amount);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
