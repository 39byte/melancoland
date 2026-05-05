import type { CharacterAppearance } from "@/engine/types";

export interface CharacterPartDef {
  bodyCount: number;
  headCount: number;
  accessoryCount: number;
  accessoryChance: number;
}

export const CHARACTER_PARTS: CharacterPartDef = {
  bodyCount: 8,
  headCount: 10,
  accessoryCount: 8,
  accessoryChance: 0.3,
};

export function isValidAppearance(appearance: CharacterAppearance): boolean {
  return (
    appearance.bodyType >= 0 && appearance.bodyType < CHARACTER_PARTS.bodyCount &&
    appearance.headType >= 0 && appearance.headType < CHARACTER_PARTS.headCount &&
    (appearance.accessory === null || (appearance.accessory >= 0 && appearance.accessory < CHARACTER_PARTS.accessoryCount))
  );
}
