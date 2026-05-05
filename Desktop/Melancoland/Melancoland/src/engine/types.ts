export type PrimaryEmotion =
  | "joy" | "sadness" | "anger" | "fear" | "surprise"
  | "love" | "peace" | "anxiety" | "hope" | "nostalgia"
  | "loneliness" | "gratitude" | "excitement" | "melancholy" | "determination";

export type Mood = "bright" | "warm" | "cool" | "dark" | "dreamy" | "stormy" | "serene";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type PlantType = "flower" | "tree" | "moss" | "special";
export type GrowthStage = "seed" | "sprout" | "grow" | "bloom" | "full";
export type WeatherEffect = "sunny" | "rainy" | "cloudy" | "snowy" | "foggy" | "starry" | "rainbow";

export interface EmotionAnalysis {
  primaryEmotion: PrimaryEmotion;
  secondaryEmotion: PrimaryEmotion | null;
  intensity: number;
  mood: Mood;
  season: Season;
  keywords: string[];
  plantRecommendation: {
    type: PlantType;
    species: string;
    reason: string;
  };
  weatherEffect: WeatherEffect | null;
  gardenMessage: string;
}

export interface PlantSprite {
  id: string;
  name: string;
  frames: Record<GrowthStage, SpriteFrame>;
  palette: string[];
  growthDuration: number;
}

export interface SpriteFrame {
  width: number;
  height: number;
  data: number[][];
}

export interface PlantInstance {
  id: string;
  speciesId: string;
  position: { col: number; row: number };
  plantedAt: string;
  emotion: PrimaryEmotion;
  colorVariant?: string;
  growthStage: GrowthStage;
  diaryEntryId: string;
  ownerId: string;
  isPrivate: boolean;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  analysis: EmotionAnalysis;
  plantInstanceId: string;
}

export type CharacterDirection = "down" | "up" | "left" | "right";
export type CharacterAnimState = "idle" | "walk";

export interface CharacterAppearance {
  bodyType: number;
  headType: number;
  skinColor: string;
  hairColor: string;
  outfitColor: string;
  accessory: number | null;
}

export interface CharacterState {
  userId: string;
  nickname: string;
  appearance: CharacterAppearance;
  position: { col: number; row: number };
  direction: CharacterDirection;
  animState: CharacterAnimState;
}

export interface PresenceUser {
  userId: string;
  nickname: string;
  character: CharacterAppearance;
  position: { col: number; row: number };
  direction: CharacterDirection;
}

export interface UserProfile {
  id: string;
  nickname: string;
  character: CharacterAppearance;
  createdAt: string;
  totalPlants: number;
  lastActiveAt: string;
}

export interface PlantMapping {
  default: string;
  tree: string;
  color: string;
}

export interface GardenConfig {
  cols: number;
  rows: number;
  cellSize: number;
  scale: number;
}

export const DEFAULT_GARDEN_CONFIG: GardenConfig = {
  cols: 40,
  rows: 30,
  cellSize: 8,
  scale: 4,
};
