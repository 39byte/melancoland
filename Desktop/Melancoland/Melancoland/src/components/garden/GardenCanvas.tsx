"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGardenStore } from "@/stores/gardenStore";
import { getContext } from "@/engine/canvas";
import { createAnimationLoop } from "@/engine/animation";
import { PLANT_REGISTRY } from "@/engine/plants";
import { renderFrame } from "@/engine/sprites";
import { createWeatherSystem } from "@/engine/weather";
import type { PlantInstance } from "@/engine/types";

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 240;
const CELL_SIZE = 8;
const SCALE = 4;

export default function GardenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { plants, weather, season, loadGarden } = useGardenStore();

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    const skyHeight = Math.floor(CANVAS_HEIGHT * 0.4);
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, CANVAS_WIDTH, skyHeight);

    ctx.fillStyle = "#7EC850";
    ctx.fillRect(0, skyHeight, CANVAS_WIDTH, CANVAS_HEIGHT - skyHeight);

    ctx.fillStyle = "#6AB040";
    for (let x = 0; x < CANVAS_WIDTH; x += 12) {
      ctx.fillRect(x, skyHeight, 6, 2);
    }
  }, []);

  const drawPlant = useCallback((ctx: CanvasRenderingContext2D, plant: PlantInstance) => {
    const sprite = PLANT_REGISTRY.get(plant.speciesId);
    if (!sprite) return;

    const frame = sprite.frames[plant.growthStage];
    if (!frame) return;

    const x = plant.position.col * CELL_SIZE;
    const y = plant.position.row * CELL_SIZE - frame.height + CELL_SIZE;
    renderFrame(ctx, frame, sprite.palette, x, y);
  }, []);

  useEffect(() => {
    loadGarden();
  }, [loadGarden]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = getContext(canvas);
    const weatherSystem = createWeatherSystem();
    if (weather) weatherSystem.setEffect(weather);

    const loop = createAnimationLoop(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

    loop.addLayer("background", () => {
      drawBackground(ctx);
    });

    loop.addLayer("plants", () => {
      for (const plant of plants) {
        drawPlant(ctx, plant);
      }
    });

    loop.addLayer("weather", (_, delta) => {
      weatherSystem.update(delta);
      weatherSystem.render(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    });

    loop.start();
    return () => loop.stop();
  }, [plants, weather, season, drawBackground, drawPlant]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    const clickedPlant = plants.find(
      (p) => p.position.col === col && p.position.row === row
    );

    if (clickedPlant) {
      window.dispatchEvent(new CustomEvent("plant-click", { detail: clickedPlant }));
    }
  }, [plants]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleClick}
      className="border-2 border-[var(--bg-secondary)] rounded-lg cursor-pointer"
      style={{ width: CANVAS_WIDTH * SCALE, height: CANVAS_HEIGHT * SCALE }}
      role="img"
      aria-label="Melancoland 공유 정원"
    />
  );
}
