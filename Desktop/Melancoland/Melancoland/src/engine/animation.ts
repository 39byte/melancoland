export type RenderCallback = (ctx: CanvasRenderingContext2D, delta: number) => void;

export interface AnimationLoop {
  start: () => void;
  stop: () => void;
  addLayer: (name: string, callback: RenderCallback) => void;
  removeLayer: (name: string) => void;
}

const TARGET_FPS = 30;
const FRAME_DURATION = 1000 / TARGET_FPS;

export function createAnimationLoop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): AnimationLoop {
  const layers = new Map<string, RenderCallback>();
  let animationId: number | null = null;
  let lastTime = 0;

  function loop(currentTime: number) {
    animationId = requestAnimationFrame(loop);

    const delta = currentTime - lastTime;
    if (delta < FRAME_DURATION) return;
    lastTime = currentTime - (delta % FRAME_DURATION);

    ctx.clearRect(0, 0, width, height);

    for (const callback of layers.values()) {
      callback(ctx, delta);
    }
  }

  return {
    start() {
      if (animationId !== null) return;
      lastTime = performance.now();
      animationId = requestAnimationFrame(loop);
    },
    stop() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    addLayer(name: string, callback: RenderCallback) {
      layers.set(name, callback);
    },
    removeLayer(name: string) {
      layers.delete(name);
    },
  };
}

export interface GrowthAnimation {
  progress: number;
  isComplete: boolean;
  update: (delta: number) => void;
}

export function createGrowthAnimation(duration: number): GrowthAnimation {
  let elapsed = 0;

  return {
    get progress() {
      return Math.min(elapsed / duration, 1);
    },
    get isComplete() {
      return elapsed >= duration;
    },
    update(delta: number) {
      elapsed += delta;
    },
  };
}

export function getGrowthStageFromProgress(progress: number) {
  if (progress < 0.15) return "seed";
  if (progress < 0.35) return "sprout";
  if (progress < 0.65) return "grow";
  if (progress < 0.85) return "bloom";
  return "full";
}
