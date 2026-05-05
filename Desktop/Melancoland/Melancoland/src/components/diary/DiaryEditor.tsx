"use client";

import { useEffect, useRef } from "react";
import { useDiaryStore } from "@/stores/diaryStore";

interface Props {
  onSubmit: () => void;
  disabled?: boolean;
}

export default function DiaryEditor({ onSubmit, disabled }: Props) {
  const { content, setContent, isAnalyzing } = useDiaryStore();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("melancoland-draft");
    if (saved) setContent(saved);
  }, [setContent]);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (content) localStorage.setItem("melancoland-draft", content);
    }, 2000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [content]);

  const isValid = content.length >= 20 && content.length <= 2000;

  return (
    <div className="w-full max-w-lg">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="오늘 하루를 들려주세요..."
        className="w-full h-48 p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{ borderColor: "var(--bg-secondary)", backgroundColor: "white" }}
        maxLength={2000}
        disabled={disabled || isAnalyzing}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs" style={{ color: content.length < 20 ? "#DC143C" : "var(--text-secondary)" }}>
          {content.length} / 2000자 {content.length < 20 && "(최소 20자)"}
        </span>
        <button
          onClick={() => { localStorage.removeItem("melancoland-draft"); onSubmit(); }}
          disabled={!isValid || isAnalyzing || disabled}
          className="px-6 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {isAnalyzing ? "분석 중..." : "🌱 정원에 심기"}
        </button>
      </div>
    </div>
  );
}
