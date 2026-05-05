import type { CharacterState } from "@/engine/types";

export function renderCharacter(
  ctx: CanvasRenderingContext2D,
  state: CharacterState,
  cellSize: number = 8
) {
  const x = state.position.col * cellSize;
  const y = state.position.row * cellSize;

  ctx.fillStyle = state.appearance.outfitColor;
  ctx.fillRect(x + 2, y + 6, 4, 6);

  ctx.fillStyle = state.appearance.skinColor;
  ctx.fillRect(x + 2, y + 2, 4, 4);

  ctx.fillStyle = state.appearance.hairColor;
  ctx.fillRect(x + 1, y + 1, 6, 2);

  ctx.fillStyle = "#000000";
  ctx.fillRect(x + 3, y + 3, 1, 1);
  ctx.fillRect(x + 5, y + 3, 1, 1);
}
