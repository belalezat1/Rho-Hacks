import Link from "next/link";

type Size = "sm" | "md" | "lg" | "hero";
type Tone = "light" | "dark";

const sizeClass: Record<Size, string> = {
  sm: "text-[1.35rem]",
  md: "text-3xl",
  lg: "text-6xl md:text-7xl",
  hero: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
};

const rhoClass: Record<Size, string> = {
  sm: "text-[0.45rem] -right-0.5 -bottom-0.5",
  md: "text-[0.55rem] -right-1 bottom-0",
  lg: "text-[0.85rem] md:text-base -right-1 bottom-1",
  hero: "text-[0.7rem] sm:text-[0.85rem] md:text-base -right-1 bottom-1",
};

export function PilotWordmark({
  size = "sm",
  tone = "light",
  href = "/",
  className = "",
}: {
  size?: Size;
  tone?: Tone;
  href?: string | null;
  className?: string;
}) {
  const color = tone === "dark" ? "text-white" : "text-ink";
  const rhoColor = tone === "dark" ? "text-white/75" : "text-ink/80";

  const mark = (
    <span
      className={`wordmark relative inline-block ${color} ${sizeClass[size]} ${className}`}
      aria-label="Pilot by rho"
    >
      Pilot
      <span
        className={`wordmark absolute ${rhoClass[size]} ${rhoColor}`}
        aria-hidden
      >
        rho
      </span>
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} className="inline-flex items-end no-underline">
      {mark}
    </Link>
  );
}
