import { create } from "zustand";
import type { PlantInstance, WeatherEffect, Season } from "@/engine/types";

interface GardenState {
  plants: PlantInstance[];
  gridSize: { cols: number; rows: number };
  weather: WeatherEffect | null;
  season: Season;
  addPlant: (plant: PlantInstance) => void;
  removePlant: (id: string) => void;
  updateWeather: (weather: WeatherEffect | null) => void;
  loadGarden: () => Promise<void>;
  setPlants: (plants: PlantInstance[]) => void;
}

export const useGardenStore = create<GardenState>((set) => ({
  plants: [],
  gridSize: { cols: 40, rows: 30 },
  weather: null,
  season: "spring",
  addPlant: (plant) =>
    set((state) => ({ plants: [...state.plants, plant] })),
  removePlant: (id) =>
    set((state) => ({ plants: state.plants.filter((p) => p.id !== id) })),
  updateWeather: (weather) => set({ weather }),
  loadGarden: async () => {
    const res = await fetch("/api/garden");
    const data = await res.json();
    set({ plants: data.plants ?? [] });
  },
  setPlants: (plants) => set({ plants }),
}));
