import Link from "next/link";

type Size = "sm" | "md" | "lg" | "hero" | "nav";
type Tone = "light" | "dark";

const sizeClass: Record<Size, string> = {
  sm: "text-[1.5rem]",
  nav: "text-[1.85rem]",
  md: "text-3xl",
  lg: "text-6xl md:text-7xl",
  hero: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
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
  /** @deprecated ignored — wordmark is just Pilot */
  showByline?: boolean;
}) {
  const color = tone === "dark" ? "text-white" : "text-ink";

  const mark = (
    <span
      className={`wordmark inline-block ${color} ${sizeClass[size]} ${className}`}
      aria-label="Pilot"
    >
      Pilot
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} className="inline-flex items-center no-underline">
      {mark}
    </Link>
  );
}
