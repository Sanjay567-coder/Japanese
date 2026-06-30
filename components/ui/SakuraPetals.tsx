"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

const PETAL_COLORS = [
  "rgba(255, 182, 193, 0.7)",
  "rgba(255, 160, 172, 0.6)",
  "rgba(255, 192, 203, 0.5)",
  "rgba(255, 210, 220, 0.65)",
  "rgba(250, 175, 185, 0.6)",
];

function createPetal(canvasWidth: number): Petal {
  return {
    x: Math.random() * canvasWidth,
    y: -20,
    size: Math.random() * 8 + 4,
    speedY: Math.random() * 1.2 + 0.4,
    speedX: (Math.random() - 0.5) * 0.8,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    opacity: Math.random() * 0.5 + 0.3,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate((petal.rotation * Math.PI) / 180);
  ctx.globalAlpha = petal.opacity;
  ctx.fillStyle = petal.color;
  ctx.beginPath();
  // Simple ellipse petal shape
  ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Subtle petal line
  ctx.strokeStyle = "rgba(255, 150, 160, 0.3)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -petal.size * 0.5);
  ctx.lineTo(0, petal.size * 0.5);
  ctx.stroke();
  ctx.restore();
}

export default function SakuraPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const MAX_PETALS = 18; // Keep low for performance
    const SPAWN_INTERVAL = 1200; // ms between new petals

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new petals
      if (
        timestamp - lastSpawnRef.current > SPAWN_INTERVAL &&
        petalsRef.current.length < MAX_PETALS
      ) {
        petalsRef.current.push(createPetal(canvas.width));
        lastSpawnRef.current = timestamp;
      }

      // Update and draw petals
      petalsRef.current = petalsRef.current.filter((petal) => {
        petal.y += petal.speedY;
        petal.x += petal.speedX + Math.sin(petal.y * 0.02) * 0.3;
        petal.rotation += petal.rotationSpeed;

        // Fade out near bottom
        if (petal.y > canvas.height - 80) {
          petal.opacity = Math.max(0, petal.opacity - 0.02);
        }

        drawPetal(ctx, petal);

        return petal.y < canvas.height + 20 && petal.opacity > 0;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{ opacity: 0.7 }}
    />
  );
}
