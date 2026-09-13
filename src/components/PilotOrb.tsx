"use client";

type Props = {
  active?: boolean;
  speaking?: boolean;
  listening?: boolean;
  size?: number;
  className?: string;
};

/**
 * ElevenLabs-style gradient orb — pulses when speaking / listening.
 */
export function PilotOrb({
  active = false,
  speaking = false,
  listening = false,
  size = 160,
  className = "",
}: Props) {
  const intensity = speaking ? 1 : listening ? 0.7 : active ? 0.45 : 0.3;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="absolute inset-0 rounded-full opacity-40 blur-2xl transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #39efcd 0%, #7dd3fc 40%, #c4b5fd 75%, transparent 70%)",
          opacity: 0.25 + intensity * 0.45,
          transform: speaking ? "scale(1.15)" : listening ? "scale(1.08)" : "scale(1)",
        }}
      />
      <span
        className={`absolute rounded-full transition-transform duration-700 ${
          speaking ? "animate-pulse" : listening ? "animate-[orbBreath_2.4s_ease-in-out_infinite]" : ""
        }`}
        style={{
          width: size * 0.92,
          height: size * 0.92,
          background:
            "radial-gradient(circle at 32% 28%, #e8fffa 0%, #39efcd 28%, #38bdf8 55%, #818cf8 82%, #1e1b4b 100%)",
          boxShadow: speaking
            ? "0 0 40px rgba(57,239,205,0.55), 0 12px 40px rgba(15,23,22,0.2)"
            : "0 0 28px rgba(57,239,205,0.28), 0 10px 28px rgba(15,23,22,0.15)",
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          width: size * 0.38,
          height: size * 0.22,
          top: size * 0.22,
          left: size * 0.22,
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}
