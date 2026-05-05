import type { EmotionAnalysis, Season } from "@/engine/types";

function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

const FALLBACK: EmotionAnalysis = {
  primaryEmotion: "peace",
  secondaryEmotion: null,
  intensity: 5,
  mood: "serene",
  season: getCurrentSeason(),
  keywords: [],
  plantRecommendation: {
    type: "flower",
    species: "wildflower",
    reason: "오늘의 이야기를 담아 작은 들꽃이 피어났어요.",
  },
  weatherEffect: null,
  gardenMessage: "정원에 조용히 꽃 한 송이가 피어났어요.",
};

export function parseEmotionResponse(text: string): EmotionAnalysis {
  try {
    const parsed = JSON.parse(text);
    if (
      !parsed.primaryEmotion ||
      !parsed.mood ||
      !parsed.season ||
      !parsed.plantRecommendation
    ) {
      return FALLBACK;
    }
    return parsed as EmotionAnalysis;
  } catch {
    return FALLBACK;
  }
}
