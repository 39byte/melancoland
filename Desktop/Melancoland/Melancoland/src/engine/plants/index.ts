import { PlantSprite } from "../types";
import { ALL_FLOWERS } from "./flowers";
import { ALL_TREES } from "./trees";
import { ALL_MOSS } from "./moss";
import { ALL_SPECIAL } from "./special";

export { SUNFLOWER, BLUE_HYDRANGEA, RED_ROSE, PINK_TULIP, DANDELION } from "./flowers";
export { CHERRY_BLOSSOM, WEEPING_WILLOW, BAMBOO } from "./trees";
export { WILDFLOWER, CLOVER } from "./moss";
export { RAINBOW_FLOWER } from "./special";

const ALL_PLANTS: PlantSprite[] = [
  ...ALL_FLOWERS,
  ...ALL_TREES,
  ...ALL_MOSS,
  ...ALL_SPECIAL,
];

export const PLANT_REGISTRY: Map<string, PlantSprite> = new Map(
  ALL_PLANTS.map((plant) => [plant.id, plant])
);
