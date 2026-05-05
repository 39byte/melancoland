import { PLANT_REGISTRY } from "@/engine/plants";
import { renderFrame } from "@/engine/sprites";
import type { PlantInstance, Season } from "@/engine/types";

const SEASON_COLORS: Record<Season, { sky: string; grass: string }> = {
  spring: { sky: "#87CEEB", grass: "#7EC850" },
  summer: { sky: "#4DB8FF", grass: "#5CB338" },
  autumn: { sky: "#DEB887", grass: "#C8A951" },
  winter: { sky: "#B0C4DE", grass: "#A8C8A8" },
};

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  season: Season = "spring"
) {
  const colors = SEASON_COLORS[season];
  const skyHeight = Math.floor(height * 0.4);

  ctx.fillStyle = colors.sky;
  ctx.fillRect(0, 0, width, skyHeight);

  ctx.fillStyle = colors.grass;
  ctx.fillRect(0, skyHeight, width, height - skyHeight);
}

export function drawPlantOnCanvas(
  ctx: CanvasRenderingContext2D,
  plant: PlantInstance,
  cellSize: number = 8
) {
  const sprite = PLANT_REGISTRY.get(plant.speciesId);
  if (!sprite) return;

  const frame = sprite.frames[plant.growthStage];
  if (!frame) return;

  const x = plant.position.col * cellSize;
  const y = plant.position.row * cellSize - frame.height + cellSize;
  renderFrame(ctx, frame, sprite.palette, x, y);
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  cellSize: number = 8
) {
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 0.5;
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cellSize, 0);
    ctx.lineTo(c * cellSize, rows * cellSize);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellSize);
    ctx.lineTo(cols * cellSize, r * cellSize);
    ctx.stroke();
  }
}
