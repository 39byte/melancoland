"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDiaryStore } from "@/stores/diaryStore";
import DiaryEditor from "@/components/diary/DiaryEditor";
import PrivacyToggle from "@/components/diary/PrivacyToggle";
import EmotionPreview from "@/components/diary/EmotionPreview";
import PlantReveal from "@/components/diary/PlantReveal";
import type { EmotionAnalysis } from "@/engine/types";

type Step = "write" | "preview" | "reveal";

export default function WritePage() {
  const router = useRouter();
  const { content, isPrivate, setPrivate, setAnalyzing, reset } = useDiaryStore();
  const [step, setStep] = useState<Step>("write");
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);

  async function handleSubmit() {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data: EmotionAnalysis = await res.json();
      setAnalysis(data);
      setStep("preview");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handlePlant() {
    if (!analysis) return;
    await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, isPrivate, analysis }),
    });
    setStep("reveal");
  }

  function handleRevealComplete() {
    reset();
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 min-h-[80vh]">
      <h2 className="text-xl font-bold">일기 쓰기</h2>

      {step === "write" && (
        <>
          <DiaryEditor onSubmit={handleSubmit} />
          <PrivacyToggle isPrivate={isPrivate} onChange={setPrivate} />
        </>
      )}

      {step === "preview" && analysis && (
        <>
          <EmotionPreview analysis={analysis} />
          <button
            onClick={handlePlant}
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: "var(--accent)" }}
          >
            🌱 정원에 심기
          </button>
        </>
      )}

      {step === "reveal" && analysis && (
        <PlantReveal
          speciesId={analysis.plantRecommendation.species}
          onComplete={handleRevealComplete}
        />
      )}
    </div>
  );
}
