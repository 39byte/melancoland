import { create } from "zustand";
import type { ReactNode } from "react";

interface UIState {
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  theme: "day" | "night";
  isMobile: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  setTheme: (theme: "day" | "night") => void;
  setMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  theme: "day",
  isMobile: false,
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  setTheme: (theme) => set({ theme }),
  setMobile: (isMobile) => set({ isMobile }),
}));
