"use client";

import { useEffect, useRef } from "react";

/** Soft organic particle cloud (Rho-style) behind light landing sections. */
export function ParticleField({
  className = "",
  density = 1,
  color = "15, 23, 22",
}: {
  className?: string;
  density?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Dot = { x: number; y: number; r: number; vx: number; vy: number; a: number };
    let dots: Dot[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor(90 * density * (w / 800));
      dots = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.random() * 0.18;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          a: 0.12 + Math.random() * 0.35,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Soft cloud mask - denser toward center-bottom
      for (const d of dots) {
        if (!reduceMotion) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < -4) d.x = w + 4;
          if (d.x > w + 4) d.x = -4;
          if (d.y < -4) d.y = h + 4;
          if (d.y > h + 4) d.y = -4;
        }

        const cx = w * 0.5;
        const cy = h * 0.55;
        const dist = Math.hypot(d.x - cx, d.y - cy) / (Math.min(w, h) * 0.55);
        const cloud = Math.max(0, 1 - dist * dist);
        const pulse = reduceMotion ? 1 : 0.85 + 0.15 * Math.sin(t * 0.02 + d.x * 0.01);
        const alpha = d.a * cloud * pulse;
        if (alpha < 0.02) continue;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      t += 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}
