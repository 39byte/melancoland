import { GardenConfig, DEFAULT_GARDEN_CONFIG } from "./types";

export function createCanvas(
  container: HTMLElement,
  config: GardenConfig = DEFAULT_GARDEN_CONFIG
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = config.cols * config.cellSize;
  canvas.height = config.rows * config.cellSize;
  canvas.style.width = `${canvas.width * config.scale}px`;
  canvas.style.height = `${canvas.height * config.scale}px`;
  canvas.style.imageRendering = "pixelated";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Melancoland 공유 정원");
  container.appendChild(canvas);
  return canvas;
}

export function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
}

export function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  data: number[][],
  palette: string[],
  x: number,
  y: number
) {
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      const colorIndex = data[row][col];
      if (colorIndex === 0) continue;
      ctx.fillStyle = palette[colorIndex];
      ctx.fillRect(x + col, y + row, 1, 1);
    }
  }
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string = "#ffffff",
  fontSize: number = 3
) {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}
