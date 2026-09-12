import Link from "next/link";

type Size = "sm" | "md" | "lg";

const sizeClass: Record<Size, string> = {
  sm: "text-[1.35rem]",
  md: "text-3xl",
  lg: "text-6xl md:text-7xl",
};

const rhoClass: Record<Size, string> = {
  sm: "text-[0.45rem] -right-0.5 -bottom-0.5",
  md: "text-[0.55rem] -right-1 bottom-0",
  lg: "text-[0.85rem] md:text-base -right-1 bottom-1",
};

export function PilotWordmark({
  size = "sm",
  href = "/",
  className = "",
}: {
  size?: Size;
  href?: string | null;
  className?: string;
}) {
  const mark = (
    <span
      className={`wordmark relative inline-block text-ink ${sizeClass[size]} ${className}`}
      aria-label="Pilot by rho"
    >
      Pilot
      <span
        className={`wordmark absolute ${rhoClass[size]} text-ink/80`}
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
