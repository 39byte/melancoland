import type { GrowthStage } from "@/engine/types";

export class PlantAnimator {
  private elapsed = 0;
  private duration: number;
  private running = false;

  constructor(duration: number = 3000) {
    this.duration = duration;
  }

  start() {
    this.elapsed = 0;
    this.running = true;
  }

  update(delta: number) {
    if (!this.running) return;
    this.elapsed += delta;
    if (this.elapsed >= this.duration) {
      this.elapsed = this.duration;
      this.running = false;
    }
  }

  getProgress(): number {
    return Math.min(this.elapsed / this.duration, 1);
  }

  getStage(): GrowthStage {
    const p = this.getProgress();
    if (p < 0.15) return "seed";
    if (p < 0.35) return "sprout";
    if (p < 0.65) return "grow";
    if (p < 0.85) return "bloom";
    return "full";
  }

  isComplete(): boolean {
    return this.elapsed >= this.duration;
  }
}
