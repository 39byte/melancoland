"use client";

import type { EmotionAnalysis } from "@/engine/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diary: { content: string; createdAt: string; analysis: EmotionAnalysis } | null;
  plantName: string;
  isPrivate: boolean;
  isOwner: boolean;
}

export default function DiaryModal({ isOpen, onClose, diary, plantName, isPrivate, isOwner }: Props) {
  if (!isOpen || !diary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{plantName}</h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {diary.createdAt}
            </p>
          </div>
          <button onClick={onClose} className="text-xl leading-none">&times;</button>
        </div>

        {isPrivate && !isOwner ? (
          <div className="text-center py-8">
            <p className="text-2xl mb-2">🔒</p>
            <p className="font-medium">이 이야기는 비공개입니다</p>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              이 식물에는 {diary.analysis.primaryEmotion}의 감정이 담겨 있어요.
            </p>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap leading-relaxed mb-4">{diary.content}</p>
            <div className="border-t pt-3 mt-3" style={{ borderColor: "var(--bg-secondary)" }}>
              <p className="text-sm">
                감정: {diary.analysis.primaryEmotion} · 강도: {diary.analysis.intensity}/10
              </p>
              <p className="text-sm italic mt-1" style={{ color: "var(--text-secondary)" }}>
                &ldquo;{diary.analysis.gardenMessage}&rdquo;
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
