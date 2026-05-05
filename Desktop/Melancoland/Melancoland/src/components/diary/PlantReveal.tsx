"use client";

import { useEffect, useState } from "react";
import { PLANT_REGISTRY } from "@/engine/plants";
import type { GrowthStage } from "@/engine/types";

interface Props {
  speciesId: string;
  onComplete: () => void;
}

const STAGES: GrowthStage[] = ["seed", "sprout", "grow", "bloom", "full"];
const STAGE_LABELS = ["씨앗을 심는 중...", "새싹이 올라오고 있어요", "자라나는 중...", "꽃봉오리가 맺히고 있어요", "활짝 피었어요!"];

export default function PlantReveal({ speciesId, onComplete }: Props) {
  const [stageIndex, setStageIndex] = useState(0);
  const plant = PLANT_REGISTRY.get(speciesId);
  const name = plant?.name ?? speciesId;

  useEffect(() => {
    if (stageIndex >= STAGES.length - 1) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setStageIndex((i) => i + 1), 600);
    return () => clearTimeout(timer);
  }, [stageIndex, onComplete]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="w-32 h-32 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <span className="text-4xl">{stageIndex >= 4 ? "🌸" : stageIndex >= 2 ? "🌿" : "🌱"}</span>
      </div>
      <p className="text-sm font-medium">{STAGE_LABELS[stageIndex]}</p>
      {stageIndex >= STAGES.length - 1 && (
        <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>{name}</p>
      )}
    </div>
  );
}
