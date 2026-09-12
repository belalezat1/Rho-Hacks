"use client";

import { useEffect, useRef } from "react";

type Props = {
  active?: boolean;
  className?: string;
};

/** Abstract organic halftone field — pulses harder when `active` (voice/tool busy). */
export function HalftoneVoice({ active = false, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

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

    const dots: { a: number; b: number; phase: number; base: number }[] = [];
    const rings = 14;
    const perRing = 28;
    for (let r = 1; r <= rings; r++) {
      const count = Math.floor(perRing * (r / rings) + 8);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + r * 0.15;
        // Petal-ish radius modulation
        const petal = 1 + 0.22 * Math.sin(angle * 5) + 0.12 * Math.cos(angle * 3);
        dots.push({
          a: angle,
          b: (r / rings) * petal,
          phase: Math.random() * Math.PI * 2,
          base: 0.6 + Math.random() * 1.8,
        });
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      if (!canvas || !ctx) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.42;
      const energy = activeRef.current ? 1.65 : 1;

      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, w, h);

      for (const d of dots) {
        const wobble =
          Math.sin(t * 0.9 * energy + d.phase) * 0.04 * energy +
          Math.cos(t * 0.55 + d.a * 2) * 0.03 * energy;
        const rad = maxR * (d.b + wobble);
        const x = cx + Math.cos(d.a + t * 0.08 * energy) * rad;
        const y = cy + Math.sin(d.a + t * 0.08 * energy) * rad;
        const pulse =
          0.55 +
          0.45 * Math.sin(t * 1.4 * energy + d.phase + d.b * 6);
        const size = d.base * pulse * (0.85 + 0.35 * energy) * (w / 280);

        ctx.beginPath();
        ctx.fillStyle = `rgba(245,245,245,${0.35 + 0.55 * pulse})`;
        ctx.arc(x, y, Math.max(0.4, size), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        t += 0.016;
        raf = requestAnimationFrame(frame);
      }
    }

    resize();
    frame();
    if (reduceMotion) {
      // one static paint already done
    }

    const onResize = () => {
      resize();
      if (reduceMotion) frame();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#121212] ${className}`}
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[10px] uppercase tracking-[0.2em] text-white/40">
        {active ? "Listening · briefing" : "Voice field"}
      </div>
    </div>
  );
}
