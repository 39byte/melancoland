import { create } from "zustand";
import type {
  CharacterState,
  CharacterAppearance,
  CharacterDirection,
} from "@/engine/types";

interface CharacterStoreState {
  myCharacter: CharacterState | null;
  otherCharacters: Map<string, CharacterState>;
  setMyCharacter: (character: CharacterState) => void;
  updatePosition: (position: { col: number; row: number }) => void;
  setDirection: (direction: CharacterDirection) => void;
  setOtherCharacters: (characters: Map<string, CharacterState>) => void;
  removeCharacter: (userId: string) => void;
}

export const useCharacterStore = create<CharacterStoreState>((set) => ({
  myCharacter: null,
  otherCharacters: new Map(),
  setMyCharacter: (character) => set({ myCharacter: character }),
  updatePosition: (position) =>
    set((state) =>
      state.myCharacter
        ? { myCharacter: { ...state.myCharacter, position } }
        : {}
    ),
  setDirection: (direction) =>
    set((state) =>
      state.myCharacter
        ? { myCharacter: { ...state.myCharacter, direction } }
        : {}
    ),
  setOtherCharacters: (characters) => set({ otherCharacters: characters }),
  removeCharacter: (userId) =>
    set((state) => {
      const next = new Map(state.otherCharacters);
      next.delete(userId);
      return { otherCharacters: next };
    }),
}));
