import { EMOTION_PLANT_MAP } from "@/data/emotion-map";
import type { EmotionAnalysis, PlantType } from "@/engine/types";

export function mapEmotionToPlant(analysis: EmotionAnalysis): {
  speciesId: string;
  type: PlantType;
} {
  if (analysis.plantRecommendation?.species) {
    return {
      speciesId: analysis.plantRecommendation.species,
      type: analysis.plantRecommendation.type,
    };
  }

  const mapping = EMOTION_PLANT_MAP[analysis.primaryEmotion];
  if (!mapping) {
    return { speciesId: "wildflower", type: "flower" };
  }

  if (analysis.intensity >= 7) {
    return { speciesId: mapping.tree, type: "tree" };
  }

  return { speciesId: mapping.default, type: "flower" };
}
