import type { PlantInstance } from "@/engine/types";

export function cellToPixel(col: number, row: number, cellSize: number = 8) {
  return { x: col * cellSize, y: row * cellSize };
}

export function pixelToCell(x: number, y: number, cellSize: number = 8) {
  return { col: Math.floor(x / cellSize), row: Math.floor(y / cellSize) };
}

export function isOccupied(col: number, row: number, plants: PlantInstance[]): boolean {
  return plants.some((p) => p.position.col === col && p.position.row === row);
}

export function findEmptyCell(
  plants: PlantInstance[],
  cols: number = 40,
  rows: number = 30
): { col: number; row: number } {
  const grassStartRow = Math.floor(rows * 0.4);

  for (let attempt = 0; attempt < 100; attempt++) {
    const col = Math.floor(Math.random() * cols);
    const row = grassStartRow + Math.floor(Math.random() * (rows - grassStartRow));
    if (!isOccupied(col, row, plants)) {
      return { col, row };
    }
  }

  for (let row = grassStartRow; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!isOccupied(col, row, plants)) {
        return { col, row };
      }
    }
  }

  return { col: 0, row: grassStartRow };
}
