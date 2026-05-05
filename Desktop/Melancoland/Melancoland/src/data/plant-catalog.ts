import type { PrimaryEmotion, PlantType } from "@/engine/types";

export interface PlantCatalogEntry {
  id: string;
  name: string;
  type: PlantType;
  emotion: PrimaryEmotion;
  description: string;
}

export const PLANT_CATALOG: PlantCatalogEntry[] = [
  { id: "sunflower", name: "해바라기", type: "flower", emotion: "joy", description: "밝은 기쁨을 담은 황금빛 꽃" },
  { id: "blue_hydrangea", name: "파란 수국", type: "flower", emotion: "sadness", description: "조용한 슬픔을 품은 푸른 꽃" },
  { id: "red_rose", name: "빨간 장미", type: "flower", emotion: "anger", description: "타오르는 분노를 담은 붉은 꽃" },
  { id: "nightshade", name: "밤그늘꽃", type: "flower", emotion: "fear", description: "두려움 속에 피어난 어둠의 꽃" },
  { id: "jack_in_box", name: "깜짝꽃", type: "flower", emotion: "surprise", description: "예상치 못한 순간에 피어난 꽃" },
  { id: "pink_tulip", name: "분홍 튤립", type: "flower", emotion: "love", description: "사랑의 마음을 담은 부드러운 꽃" },
  { id: "white_lily", name: "흰 백합", type: "flower", emotion: "peace", description: "평온한 마음을 비추는 순백의 꽃" },
  { id: "thistle", name: "엉겅퀴", type: "flower", emotion: "anxiety", description: "불안이 뾰족하게 피어난 꽃" },
  { id: "dandelion", name: "민들레", type: "flower", emotion: "hope", description: "바람에 실려가는 희망의 씨앗" },
  { id: "dried_lavender", name: "마른 라벤더", type: "flower", emotion: "nostalgia", description: "지난 시간의 향기를 품은 꽃" },
  { id: "single_daisy", name: "외로운 데이지", type: "flower", emotion: "loneliness", description: "홀로 피어난 작은 꽃" },
  { id: "golden_dahlia", name: "금빛 달리아", type: "flower", emotion: "gratitude", description: "감사의 마음이 빛나는 꽃" },
  { id: "firecracker", name: "폭죽꽃", type: "flower", emotion: "excitement", description: "흥분으로 터져 나온 불꽃 같은 꽃" },
  { id: "forget_me_not", name: "물망초", type: "flower", emotion: "melancholy", description: "잊지 못할 우수를 담은 꽃" },
  { id: "cactus_flower", name: "선인장꽃", type: "flower", emotion: "determination", description: "강인한 의지로 피어난 꽃" },
  { id: "cherry_blossom", name: "벚꽃나무", type: "tree", emotion: "joy", description: "환희로 물든 분홍빛 나무" },
  { id: "weeping_willow", name: "수양버들", type: "tree", emotion: "sadness", description: "눈물처럼 늘어진 가지의 나무" },
  { id: "thorn_bush", name: "가시덤불", type: "tree", emotion: "anger", description: "날카로운 감정이 엉킨 덤불" },
  { id: "dead_oak", name: "마른 참나무", type: "tree", emotion: "fear", description: "공포에 얼어붙은 나무" },
  { id: "firework_tree", name: "불꽃나무", type: "tree", emotion: "surprise", description: "놀라움이 터져 나온 나무" },
  { id: "heart_tree", name: "하트나무", type: "tree", emotion: "love", description: "사랑으로 자라난 나무" },
  { id: "olive_tree", name: "올리브나무", type: "tree", emotion: "peace", description: "평화의 상징인 고요한 나무" },
  { id: "twisted_vine", name: "꼬인 덩굴", type: "tree", emotion: "anxiety", description: "걱정으로 뒤엉킨 덩굴나무" },
  { id: "young_sprout", name: "어린 새싹", type: "tree", emotion: "hope", description: "미래를 향해 자라나는 새싹" },
  { id: "autumn_maple", name: "단풍나무", type: "tree", emotion: "nostalgia", description: "추억이 물든 가을빛 나무" },
  { id: "lone_pine", name: "외로운 소나무", type: "tree", emotion: "loneliness", description: "홀로 서 있는 고독한 나무" },
  { id: "fruit_tree", name: "열매나무", type: "tree", emotion: "gratitude", description: "감사함이 열매로 맺힌 나무" },
  { id: "rainbow_tree", name: "무지개나무", type: "tree", emotion: "excitement", description: "설렘이 무지개로 피어난 나무" },
  { id: "mist_willow", name: "안개버들", type: "tree", emotion: "melancholy", description: "안개 속에 잠긴 서글픈 나무" },
  { id: "bamboo", name: "대나무", type: "tree", emotion: "determination", description: "꺾이지 않는 결의의 나무" },
  { id: "wildflower", name: "들꽃", type: "moss", emotion: "peace", description: "자연스럽게 피어난 소박한 들꽃" },
  { id: "clover", name: "클로버", type: "moss", emotion: "hope", description: "행운을 품은 작은 풀" },
  { id: "rainbow_flower", name: "무지개꽃", type: "special", emotion: "excitement", description: "모든 감정이 모여 피어난 특별한 꽃" },
];
