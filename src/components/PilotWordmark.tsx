import Link from "next/link";
import { PilotBrandMark } from "@/components/landing/PartnerLogos";

type Size = "sm" | "md" | "lg" | "hero" | "nav";
type Tone = "light" | "dark";

const sizeMap: Record<Size, "sm" | "md" | "lg"> = {
  sm: "sm",
  nav: "sm",
  md: "md",
  lg: "lg",
  hero: "lg",
};

export function PilotWordmark({
  size = "sm",
  tone = "light",
  href = "/",
  className = "",
  showByline = true,
}: {
  size?: Size;
  tone?: Tone;
  href?: string | null;
  className?: string;
  showByline?: boolean;
}) {
  const mark = (
    <span className={className}>
      <PilotBrandMark
        tone={tone}
        size={sizeMap[size]}
        showByline={showByline}
      />
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} className="inline-flex items-center no-underline">
      {mark}
    </Link>
  );
}
