export function createCharacterController(onMove: (dx: number, dy: number) => void) {
  const keys = new Set<string>();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function getDirection(): { dx: number; dy: number } {
    let dx = 0;
    let dy = 0;
    if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) dy = -1;
    if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) dy = 1;
    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) dx = -1;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) dx = 1;
    return { dx, dy };
  }

  function tick() {
    const { dx, dy } = getDirection();
    if (dx !== 0 || dy !== 0) onMove(dx, dy);
  }

  function onKeyDown(e: KeyboardEvent) {
    keys.add(e.key);
    if (!intervalId) {
      tick();
      intervalId = setInterval(tick, 250);
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    keys.delete(e.key);
    if (keys.size === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return {
    start() {
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
    },
    stop() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      keys.clear();
    },
  };
}
