import { create } from "zustand";
import type { EmotionAnalysis } from "@/engine/types";

interface DiaryState {
  content: string;
  isPrivate: boolean;
  isAnalyzing: boolean;
  analysis: EmotionAnalysis | null;
  setContent: (content: string) => void;
  setPrivate: (isPrivate: boolean) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysis: (analysis: EmotionAnalysis | null) => void;
  reset: () => void;
}

export const useDiaryStore = create<DiaryState>((set) => ({
  content: "",
  isPrivate: false,
  isAnalyzing: false,
  analysis: null,
  setContent: (content) => set({ content }),
  setPrivate: (isPrivate) => set({ isPrivate }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysis: (analysis) => set({ analysis }),
  reset: () =>
    set({ content: "", isPrivate: false, isAnalyzing: false, analysis: null }),
}));
