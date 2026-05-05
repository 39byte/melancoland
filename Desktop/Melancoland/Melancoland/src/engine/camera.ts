import { GardenConfig, DEFAULT_GARDEN_CONFIG } from "./types";

export interface Camera {
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
  follow: (targetX: number, targetY: number) => void;
  worldToScreen: (wx: number, wy: number) => { x: number; y: number };
  screenToWorld: (sx: number, sy: number) => { x: number; y: number };
  isVisible: (wx: number, wy: number, w: number, h: number) => boolean;
}

export function createCamera(
  viewportWidth: number,
  viewportHeight: number,
  config: GardenConfig = DEFAULT_GARDEN_CONFIG
): Camera {
  const worldWidth = config.cols * config.cellSize;
  const worldHeight = config.rows * config.cellSize;

  const camera: Camera = {
    x: 0,
    y: 0,
    viewportWidth,
    viewportHeight,

    follow(targetX: number, targetY: number) {
      camera.x = Math.max(
        0,
        Math.min(targetX - viewportWidth / 2, worldWidth - viewportWidth)
      );
      camera.y = Math.max(
        0,
        Math.min(targetY - viewportHeight / 2, worldHeight - viewportHeight)
      );
    },

    worldToScreen(wx: number, wy: number) {
      return { x: wx - camera.x, y: wy - camera.y };
    },

    screenToWorld(sx: number, sy: number) {
      return { x: sx + camera.x, y: sy + camera.y };
    },

    isVisible(wx: number, wy: number, w: number, h: number) {
      return (
        wx + w > camera.x &&
        wx < camera.x + viewportWidth &&
        wy + h > camera.y &&
        wy < camera.y + viewportHeight
      );
    },
  };

  return camera;
}
