import type { CharacterAppearance } from "@/engine/types";

const SKIN_PALETTE = [
  "#FFDCB1", "#F5C6A1", "#E8A87C", "#C68642", "#8D5524", "#6B3E26",
];

const HAIR_PALETTE = [
  "#2C1810", "#4A3728", "#8B6914", "#D4A53C", "#C94C4C", "#5C3D6E",
  "#1A1A2E", "#E8E8E8",
];

const OUTFIT_PALETTE = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#FF8A5C",
];

export function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b) + 0x1234567) | 0;
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) | 0;
    h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967296;
  };
}

export function generateCharacter(seed: string): CharacterAppearance {
  const rng = seededRandom(seed);
  return {
    bodyType: Math.floor(rng() * 8),
    headType: Math.floor(rng() * 10),
    skinColor: SKIN_PALETTE[Math.floor(rng() * SKIN_PALETTE.length)],
    hairColor: HAIR_PALETTE[Math.floor(rng() * HAIR_PALETTE.length)],
    outfitColor: OUTFIT_PALETTE[Math.floor(rng() * OUTFIT_PALETTE.length)],
    accessory: rng() > 0.7 ? Math.floor(rng() * 8) : null,
  };
}
