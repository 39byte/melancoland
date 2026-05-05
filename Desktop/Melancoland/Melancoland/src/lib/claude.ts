import Anthropic from "@anthropic-ai/sdk";
import type { EmotionAnalysis, Season } from "@/engine/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `당신은 감정 정원 "Melancoland"의 정원사 AI입니다.
사용자의 일기를 읽고, 글에서 느껴지는 감정과 분위기를 분석하여
정원에 심을 식물을 추천합니다.

반드시 아래 JSON 형식으로만 응답하세요:

{
  "primaryEmotion": "joy" | "sadness" | "anger" | "fear" | "surprise" | "love" | "peace" | "anxiety" | "hope" | "nostalgia" | "loneliness" | "gratitude" | "excitement" | "melancholy" | "determination",
  "secondaryEmotion": string | null,
  "intensity": 1-10,
  "mood": "bright" | "warm" | "cool" | "dark" | "dreamy" | "stormy" | "serene",
  "season": "spring" | "summer" | "autumn" | "winter",
  "keywords": string[],
  "plantRecommendation": {
    "type": "flower" | "tree" | "moss" | "special",
    "species": string,
    "reason": string
  },
  "weatherEffect": "sunny" | "rainy" | "cloudy" | "snowy" | "foggy" | "starry" | "rainbow" | null,
  "gardenMessage": string
}`;

function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

const FALLBACK_ANALYSIS: EmotionAnalysis = {
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

export async function analyzeDiary(content: string): Promise<EmotionAnalysis> {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `오늘의 일기:\n\n${content}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return JSON.parse(text) as EmotionAnalysis;
  } catch {
    return FALLBACK_ANALYSIS;
  }
}
