import { WeatherEffect } from "./types";

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

export interface WeatherSystem {
  effect: WeatherEffect | null;
  setEffect: (effect: WeatherEffect | null) => void;
  update: (delta: number) => void;
  render: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export function createWeatherSystem(): WeatherSystem {
  let particles: Particle[] = [];
  let currentEffect: WeatherEffect | null = null;
  let time = 0;

  function initParticles(effect: WeatherEffect, width: number, height: number) {
    particles = [];
    const count = effect === "rainy" ? 60 : effect === "snowy" ? 30 : 20;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: effect === "snowy" ? 0.2 + Math.random() * 0.3 : 0.8 + Math.random() * 1.2,
        size: 1,
        opacity: 0.4 + Math.random() * 0.6,
      });
    }
  }

  return {
    get effect() { return currentEffect; },

    setEffect(effect: WeatherEffect | null) {
      currentEffect = effect;
      if (effect) initParticles(effect, 320, 240);
      else particles = [];
    },

    update(delta: number) {
      time += delta;
      for (const p of particles) {
        if (currentEffect === "rainy") {
          p.y += p.speed * 2;
          p.x += p.speed * 0.3;
          if (p.y > 240) { p.y = -2; p.x = Math.random() * 320; }
        } else if (currentEffect === "snowy") {
          p.y += p.speed;
          p.x += Math.sin(time * 0.001 + p.y * 0.05) * 0.2;
          if (p.y > 240) { p.y = -1; p.x = Math.random() * 320; }
        }
      }
    },

    render(ctx: CanvasRenderingContext2D, width: number, height: number) {
      if (!currentEffect) return;

      switch (currentEffect) {
        case "rainy":
          for (const p of particles) {
            ctx.globalAlpha = p.opacity * 0.6;
            ctx.fillStyle = "#4A90D9";
            ctx.fillRect(p.x, p.y, 1, 3);
          }
          ctx.globalAlpha = 1;
          break;

        case "snowy":
          for (const p of particles) {
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(p.x, p.y, 1, 1);
          }
          ctx.globalAlpha = 1;
          break;

        case "sunny":
          ctx.globalAlpha = 0.08;
          ctx.fillStyle = "#FFD700";
          for (let i = 0; i < 5; i++) {
            const startX = 40 + i * 60;
            ctx.beginPath();
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX + 30, height * 0.6);
            ctx.lineTo(startX + 5, height * 0.6);
            ctx.lineTo(startX - 25, 0);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          break;

        case "foggy":
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, height * 0.4, width, height * 0.6);
          ctx.globalAlpha = 0.08;
          ctx.fillRect(0, height * 0.2, width, height * 0.4);
          ctx.globalAlpha = 1;
          break;

        case "starry": {
          const starCount = 25;
          for (let i = 0; i < starCount; i++) {
            const sx = (i * 97 + 13) % width;
            const sy = (i * 53 + 7) % (height * 0.4);
            const twinkle = Math.sin(time * 0.003 + i) * 0.3 + 0.7;
            ctx.globalAlpha = twinkle;
            ctx.fillStyle = "#E2E2E2";
            ctx.fillRect(sx, sy, 1, 1);
          }
          ctx.globalAlpha = 1;
          break;
        }

        case "cloudy":
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = "#B0B0B0";
          for (let i = 0; i < 3; i++) {
            const cx = (i * 110 + Math.sin(time * 0.0005 + i) * 10) % (width + 40) - 20;
            ctx.beginPath();
            ctx.arc(cx, 20 + i * 8, 15, 0, Math.PI * 2);
            ctx.arc(cx + 10, 15 + i * 8, 12, 0, Math.PI * 2);
            ctx.arc(cx + 20, 18 + i * 8, 14, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          break;

        case "rainbow":
          ctx.globalAlpha = 0.12;
          const colors = ["#FF0000", "#FF7700", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];
          colors.forEach((color, i) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(width * 0.5, height * 0.8, 80 + i * 3, Math.PI, 0);
            ctx.stroke();
          });
          ctx.globalAlpha = 1;
          break;
      }
    },
  };
}
