/** Premium B&W partner marks for the landing marquee (no colored plates). */

export function LogoRho({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center text-ink ${className}`}
      style={{
        fontFamily: "var(--font-wordmark), Georgia, serif",
        fontSize: "1.9rem",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        lineHeight: 1,
      }}
      aria-label="Rho"
    >
      Rho
    </span>
  );
}

export function LogoElevenLabs({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-ink ${className}`}
      aria-label="ElevenLabs"
    >
      <svg viewBox="0 0 18 28" className="h-8 w-[13px] shrink-0 md:h-9" aria-hidden>
        <rect x="0" y="0" width="5.5" height="28" rx="0.5" fill="currentColor" />
        <rect x="12.5" y="0" width="5.5" height="28" rx="0.5" fill="currentColor" />
      </svg>
      <span
        className="text-[1.45rem] font-bold tracking-tight md:text-[1.65rem]"
        style={{ letterSpacing: "-0.035em" }}
      >
        ElevenLabs
      </span>
    </span>
  );
}

export function LogoTavily({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-ink ${className}`}
      aria-label="Tavily by Nebius"
    >
      <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0 md:h-12 md:w-12" aria-hidden>
        <rect width="48" height="48" rx="12" fill="currentColor" />
        <g
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M24 24V12" />
          <path d="M21 15l3-3 3 3" />
          <path d="M24 24h12" />
          <path d="M33 21l3 3-3 3" />
          <path d="M24 24l-9 9" />
          <path d="M15 30l0 3 3 0" />
        </g>
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="text-[1.55rem] font-bold tracking-tight md:text-[1.7rem]"
          style={{ letterSpacing: "-0.03em" }}
        >
          tavily
        </span>
        <span className="mt-1 text-[11px] font-medium tracking-wide text-muted">
          by{" "}
          <span className="uppercase tracking-[0.12em] text-ink">NEBIUS</span>
        </span>
      </span>
    </span>
  );
}

/** Circular $ mark + Stan wordmark (B&W, no purple plate). */
export function LogoStan({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-ink ${className}`}
      aria-label="Stan"
    >
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0 md:h-10 md:w-10" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="currentColor" />
        <text
          x="20"
          y="26.5"
          textAnchor="middle"
          fill="#fff"
          style={{
            fontFamily: "var(--font-ui), system-ui, sans-serif",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          $
        </text>
      </svg>
      <span
        className="text-[1.65rem] font-bold tracking-tight md:text-[1.85rem]"
        style={{ letterSpacing: "-0.03em" }}
      >
        Stan
      </span>
    </span>
  );
}

/**
 * Pilot lockup in the Tavily spirit: squircle mark + lowercase name + by Rho.
 * Directional “radar / course” glyph, not a copy of Tavily’s arrows.
 */
export function PilotBrandMark({
  tone = "light",
  size = "md",
  showByline = true,
}: {
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showByline?: boolean;
}) {
  const ink = tone === "dark" ? "#ffffff" : "#111111";
  const cut = tone === "dark" ? "#050505" : "#ffffff";
  const dim = tone === "dark" ? "rgba(255,255,255,0.55)" : "#747c78";
  const box =
    size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const title =
    size === "lg"
      ? "text-4xl md:text-5xl"
      : size === "sm"
        ? "text-xl"
        : "text-2xl";
  const sub = size === "lg" ? "text-sm" : "text-[11px]";

  return (
    <span className="inline-flex items-center gap-3" aria-label="pilot by Rho">
      <span
        className={`relative inline-flex ${box} shrink-0 items-center justify-center rounded-[22%]`}
        style={{ background: ink }}
      >
        <svg viewBox="0 0 48 48" className="h-[62%] w-[62%]" aria-hidden>
          {/* Compass / runway: horizontal beam + rising path */}
          <path
            d="M8 30h32M14 30c6-10 14-16 20-18"
            stroke={cut}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="34" cy="12" r="3.2" fill={cut} />
          <path
            d="M24 18v16M24 34l-5-4M24 34l5-4"
            stroke={cut}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`${title} font-semibold tracking-tight`}
          style={{
            color: ink,
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-ui), system-ui, sans-serif",
          }}
        >
          pilot
        </span>
        {showByline ? (
          <span
            className={`${sub} mt-1.5 font-medium tracking-wide`}
            style={{ color: dim }}
          >
            by{" "}
            <span
              className="uppercase"
              style={{
                fontFamily: "var(--font-wordmark), Georgia, serif",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              Rho
            </span>
          </span>
        ) : null}
      </span>
    </span>
  );
}
