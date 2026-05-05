"use client";

import type { PlantInstance } from "@/engine/types";
import { PLANT_REGISTRY } from "@/engine/plants";

interface Props {
  plant: PlantInstance | null;
  position: { x: number; y: number };
}

export default function PlantTooltip({ plant, position }: Props) {
  if (!plant) return null;

  const sprite = PLANT_REGISTRY.get(plant.speciesId);
  const name = sprite?.name ?? plant.speciesId;

  return (
    <div
      className="absolute pointer-events-none z-50 bg-white/90 border border-[var(--bg-secondary)] rounded-lg px-3 py-2 text-sm shadow-lg"
      style={{ left: position.x, top: position.y - 40 }}
    >
      <p className="font-medium">{name}</p>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {plant.emotion}
      </p>
    </div>
  );
}
