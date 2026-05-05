import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EmotionAnalysis, Season } from "@/engine/types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? "");

const SYSTEM_PROMPT = `당신은 감정 정원 "Melancoland"의 정원사 AI입니다.
사용자의 일기를 읽고, 글에서 느껴지는 감정과 분위기를 분석하여
정원에 심을 식물을 추천합니다.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 절대 포함하지 마세요:

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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(`오늘의 일기:\n\n${content}`);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return FALLBACK_ANALYSIS;

    return JSON.parse(jsonMatch[0]) as EmotionAnalysis;
  } catch {
    return FALLBACK_ANALYSIS;
  }
}
