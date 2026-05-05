interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface ParticleEmitter {
  emit: (x: number, y: number, color: string, count?: number) => void;
  update: (delta: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
  clear: () => void;
}

export function createParticleSystem(maxParticles: number = 200): ParticleEmitter {
  const particles: Particle[] = [];

  return {
    emit(x: number, y: number, color: string, count: number = 5) {
      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) break;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.3 - 0.1,
          life: 0,
          maxLife: 800 + Math.random() * 1200,
          color,
          size: 1,
        });
      }
    },

    update(delta: number) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += delta;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.001;
      }
    },

    render(ctx: CanvasRenderingContext2D) {
      for (const p of particles) {
        const alpha = 1 - p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx.globalAlpha = 1;
    },

    clear() {
      particles.length = 0;
    },
  };
}

export function createSparkleEffect(): ParticleEmitter {
  const system = createParticleSystem(50);
  let timer = 0;
  const sources: Array<{ x: number; y: number; color: string }> = [];

  const original = { ...system };

  return {
    ...system,
    emit(x: number, y: number, color: string) {
      sources.push({ x, y, color });
    },
    update(delta: number) {
      timer += delta;
      if (timer > 300) {
        timer = 0;
        for (const src of sources) {
          const ox = src.x + (Math.random() - 0.5) * 8;
          const oy = src.y + (Math.random() - 0.5) * 4;
          original.emit(ox, oy, src.color, 1);
        }
      }
      original.update(delta);
    },
    render(ctx: CanvasRenderingContext2D) {
      original.render(ctx);
    },
    clear() {
      sources.length = 0;
      original.clear();
    },
  };
}
