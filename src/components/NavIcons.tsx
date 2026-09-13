/** Rho-style outline icons for app nav and marketing menus. */

type IconProps = { className?: string };

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconCash({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.25" />
      <path d="M3 10h1.5M19.5 10H21M3 14h1.5M19.5 14H21" />
    </svg>
  );
}

export function IconSpend({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15V9" />
      <path d="M12 15V7" />
      <path d="M16 15v-3" />
    </svg>
  );
}

export function IconExceptions({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M12 3.5 20.5 18.5H3.5L12 3.5Z" />
      <path d="M12 10v4" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

export function IconBriefs({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M8 4h8a2 2 0 0 1 2 2v13l-6-2.5L6 19V6a2 2 0 0 1 2-2Z" />
      <path d="M9 9h6M9 12h4" />
    </svg>
  );
}

export function IconTalk({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H11l-4 3.5V15H8.5A3.5 3.5 0 0 1 5 11.5v-5Z" />
    </svg>
  );
}

export function IconAnomalies({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12h8M12 8v8" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
