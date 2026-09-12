/** Recognizable vendor marks for finance rows (simplified brand glyphs). */

const KEY_ALIASES: Record<string, string> = {
  intercom: "intercom",
  notion: "notion",
  aws: "aws",
  "amazon web services": "aws",
  amazon: "aws",
  figma: "figma",
  gusto: "gusto",
  "gusto payroll": "gusto",
  jordan: "jordan",
  "jordan lee": "jordan",
  "jordan lee (design)": "jordan",
  northpeak: "northpeak",
  "northpeak labs": "northpeak",
  "pqrs cloud": "pqrs",
  pqrs: "pqrs",
  uber: "uber",
  delta: "delta",
  amex: "amex",
  "amex travel": "amex",
};

export function resolveVendorKey(nameOrKey: string | null | undefined): string | null {
  if (!nameOrKey) return null;
  const raw = nameOrKey.trim().toLowerCase();
  if (KEY_ALIASES[raw]) return KEY_ALIASES[raw];
  for (const [alias, key] of Object.entries(KEY_ALIASES)) {
    if (raw.includes(alias)) return key;
  }
  return null;
}

export function VendorMark({
  name,
  vendorKey,
  size = 28,
  className = "",
}: {
  name?: string | null;
  vendorKey?: string | null;
  size?: number;
  className?: string;
}) {
  const key = vendorKey ?? resolveVendorKey(name) ?? "generic";
  const label = name ?? key;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[7px] border border-hairline bg-white ${className}`}
      style={{ width: size, height: size }}
      title={label}
      aria-hidden
    >
      <VendorGlyph id={key} />
    </span>
  );
}

function VendorGlyph({ id }: { id: string }) {
  switch (id) {
    case "aws":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#232F3E" />
          <text
            x="20"
            y="18"
            textAnchor="middle"
            fill="#fff"
            style={{ fontSize: "9px", fontWeight: 700, fontFamily: "Arial, sans-serif" }}
          >
            aws
          </text>
          <path
            d="M8 26c6 5 18 5 24 0"
            fill="none"
            stroke="#FF9900"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "figma":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#fff" />
          <circle cx="16" cy="12" r="5" fill="#F24E1E" />
          <circle cx="24" cy="12" r="5" fill="#FF7262" />
          <circle cx="16" cy="20" r="5" fill="#A259FF" />
          <circle cx="24" cy="20" r="5" fill="#1ABCFE" />
          <circle cx="16" cy="28" r="5" fill="#0ACF83" />
        </svg>
      );
    case "intercom":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#1F8DED" />
          <rect x="10" y="12" width="3.2" height="16" rx="1.5" fill="#fff" />
          <rect x="15.6" y="9" width="3.2" height="19" rx="1.5" fill="#fff" />
          <rect x="21.2" y="11" width="3.2" height="17" rx="1.5" fill="#fff" />
          <rect x="26.8" y="14" width="3.2" height="14" rx="1.5" fill="#fff" />
        </svg>
      );
    case "notion":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#fff" />
          <path
            d="M12 10h14l2 2v16l-2 2H12l-2-2V12l2-2z"
            fill="none"
            stroke="#111"
            strokeWidth="1.6"
          />
          <path d="M16 14v14M16 14h6l4 14" stroke="#111" strokeWidth="2" fill="none" />
        </svg>
      );
    case "gusto":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#F45D48" />
          <circle cx="20" cy="20" r="9" fill="#fff" />
          <circle cx="20" cy="20" r="4.5" fill="#F45D48" />
        </svg>
      );
    case "jordan":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#111" />
          <text
            x="20"
            y="25"
            textAnchor="middle"
            fill="#fff"
            style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-ui), sans-serif" }}
          >
            JL
          </text>
        </svg>
      );
    case "northpeak":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#0F3D3E" />
          <path d="M8 28 L20 10 L32 28 Z" fill="#39EFCD" />
        </svg>
      );
    case "pqrs":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#5B4BFF" />
          <text
            x="20"
            y="25"
            textAnchor="middle"
            fill="#fff"
            style={{ fontSize: "11px", fontWeight: 700, fontFamily: "Arial, sans-serif" }}
          >
            PQRS
          </text>
        </svg>
      );
    case "uber":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#000" />
          <text
            x="20"
            y="24"
            textAnchor="middle"
            fill="#fff"
            style={{ fontSize: "10px", fontWeight: 700, fontFamily: "Arial, sans-serif" }}
          >
            Uber
          </text>
        </svg>
      );
    case "delta":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#fff" />
          <path d="M20 8 L32 30 H8 Z" fill="#C8102E" />
        </svg>
      );
    case "amex":
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#2E77BC" />
          <text
            x="20"
            y="24"
            textAnchor="middle"
            fill="#fff"
            style={{ fontSize: "8px", fontWeight: 700, fontFamily: "Arial, sans-serif" }}
          >
            AMEX
          </text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#F0F1F1" />
          <circle cx="20" cy="20" r="8" fill="#C5CBC9" />
        </svg>
      );
  }
}

/** Rho Close style sparkle chip */
export function SparkleChip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[13px] font-medium text-[#2E6D92] shadow-[0_1px_2px_rgba(15,23,22,0.04)] ${className}`}
    >
      <SparkleIcon />
      {children}
    </span>
  );
}

export function SparkleIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`shrink-0 ${className}`} aria-hidden>
      <path
        d="M8 1.5l1.1 4.2L13.5 7 9.1 8.3 8 12.5 6.9 8.3 2.5 7l4.4-1.3L8 1.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
