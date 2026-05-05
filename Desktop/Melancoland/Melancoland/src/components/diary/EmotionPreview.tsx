"use client";

import type { EmotionAnalysis } from "@/engine/types";

const EMOTION_LABELS: Record<string, string> = {
  joy: "기쁨", sadness: "슬픔", anger: "분노", fear: "두려움", surprise: "놀라움",
  love: "사랑", peace: "평화", anxiety: "불안", hope: "희망", nostalgia: "향수",
  loneliness: "외로움", gratitude: "감사", excitement: "설렘", melancholy: "우울", determination: "결의",
};

interface Props {
  analysis: EmotionAnalysis;
}

export default function EmotionPreview({ analysis }: Props) {
  return (
    <div className="w-full max-w-lg p-4 rounded-lg border" style={{ borderColor: "var(--bg-secondary)", backgroundColor: "white" }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-lg font-bold">
          {EMOTION_LABELS[analysis.primaryEmotion] ?? analysis.primaryEmotion}
        </span>
        <div className="flex-1 h-2 rounded-full bg-gray-200">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${analysis.intensity * 10}%`, backgroundColor: "var(--accent)" }}
          />
        </div>
        <span className="text-sm font-medium">{analysis.intensity}/10</span>
      </div>

      <p className="text-sm mb-2">
        추천 식물: <span className="font-medium">{analysis.plantRecommendation.species}</span>
      </p>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {analysis.plantRecommendation.reason}
      </p>

      <blockquote className="mt-3 pl-3 border-l-2 italic text-sm" style={{ borderColor: "var(--accent-warm)", color: "var(--text-secondary)" }}>
        {analysis.gardenMessage}
      </blockquote>
    </div>
  );
}
