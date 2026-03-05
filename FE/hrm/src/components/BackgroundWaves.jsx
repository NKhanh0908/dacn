import { useEffect, useRef } from "react";

class Grad {
  constructor(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }
  dot2(x, y) {
    return this.x * x + this.y * y;
  }
}

class Noise {
  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1,1,0), new Grad(-1,1,0), new Grad(1,-1,0), new Grad(-1,-1,0),
      new Grad(1,0,1), new Grad(-1,0,1), new Grad(1,0,-1), new Grad(-1,0,-1),
      new Grad(0,1,1), new Grad(0,-1,1), new Grad(0,1,-1), new Grad(0,-1,-1),
    ];
    this.p = [...Array(256).keys()];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  seed(seed) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;

    for (let i = 0; i < 256; i++) {
      const v = this.p[i];
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  perlin2(x, y) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);

    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);

    const u = this.fade(x);
    return this.lerp(
      this.lerp(n00, n10, u),
      this.lerp(n01, n11, u),
      this.fade(y)
    );
  }
}

export default function BackgroundWaves() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const noise = new Noise(Math.random());

    const config = {
      lineColor: "rgba(255,255,255,0.15)",
      waveSpeedX: 0.008,
      waveSpeedY: 0.003,
      waveAmpX: 24,
      waveAmpY: 12,
      xGap: 12,
      yGap: 24,
    };

    let lines = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createLines();
    };

    const createLines = () => {
      lines = [];
      const cols = Math.ceil(canvas.width / config.xGap);
      const rows = Math.ceil(canvas.height / config.yGap);

      for (let i = 0; i <= cols; i++) {
        const points = [];
        for (let j = 0; j <= rows; j++) {
          points.push({
            x: i * config.xGap,
            y: j * config.yGap,
          });
        }
        lines.push(points);
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = config.lineColor;

      lines.forEach((line) => {
        line.forEach((p, i) => {
          const move =
            noise.perlin2(
              (p.x + t * config.waveSpeedX) * 0.002,
              (p.y + t * config.waveSpeedY) * 0.0015
            ) * 12;

          const x = p.x + Math.cos(move) * config.waveAmpX;
          const y = p.y + Math.sin(move) * config.waveAmpY;

          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
      });

      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw(0);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
