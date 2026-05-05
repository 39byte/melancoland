import type { PrimaryEmotion, PlantMapping } from "@/engine/types";

export const EMOTION_PLANT_MAP: Record<PrimaryEmotion, PlantMapping> = {
  joy: { default: "sunflower", tree: "cherry_blossom", color: "#FFD700" },
  sadness: { default: "blue_hydrangea", tree: "weeping_willow", color: "#4A90D9" },
  anger: { default: "red_rose", tree: "thorn_bush", color: "#DC143C" },
  fear: { default: "nightshade", tree: "dead_oak", color: "#483D8B" },
  surprise: { default: "jack_in_box", tree: "firework_tree", color: "#FF69B4" },
  love: { default: "pink_tulip", tree: "heart_tree", color: "#FF8FAB" },
  peace: { default: "white_lily", tree: "olive_tree", color: "#98FB98" },
  anxiety: { default: "thistle", tree: "twisted_vine", color: "#9370DB" },
  hope: { default: "dandelion", tree: "young_sprout", color: "#7CFC00" },
  nostalgia: { default: "dried_lavender", tree: "autumn_maple", color: "#DEB887" },
  loneliness: { default: "single_daisy", tree: "lone_pine", color: "#B0C4DE" },
  gratitude: { default: "golden_dahlia", tree: "fruit_tree", color: "#DAA520" },
  excitement: { default: "firecracker", tree: "rainbow_tree", color: "#FF4500" },
  melancholy: { default: "forget_me_not", tree: "mist_willow", color: "#778899" },
  determination: { default: "cactus_flower", tree: "bamboo", color: "#228B22" },
};
