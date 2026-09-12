/** Local brand marks (no external fetch). Official colors; simplified lockups. */

export function LogoRho({ className = "h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 28"
      fill="currentColor"
      aria-label="Rho"
      role="img"
    >
      <text
        x="0"
        y="22"
        style={{
          fontFamily: "var(--font-wordmark), Georgia, serif",
          fontSize: "26px",
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        Rho
      </text>
    </svg>
  );
}

export function LogoElevenLabs({ className = "h-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 28"
      fill="currentColor"
      aria-label="ElevenLabs"
      role="img"
    >
      <circle cx="8" cy="14" r="5" />
      <circle cx="22" cy="14" r="5" />
      <text
        x="34"
        y="19"
        style={{
          fontFamily: "var(--font-ui), system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "-0.03em",
        }}
      >
        ElevenLabs
      </text>
    </svg>
  );
}

export function LogoTavily({ className = "h-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 28"
      fill="currentColor"
      aria-label="Tavily"
      role="img"
    >
      <path d="M6 6h10v3.2H12.4V22H9.6V9.2H6V6z" />
      <text
        x="22"
        y="19"
        style={{
          fontFamily: "var(--font-ui), system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "-0.03em",
        }}
      >
        Tavily
      </text>
    </svg>
  );
}

export function LogoStan({ className = "h-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 88 28"
      fill="currentColor"
      aria-label="Stan"
      role="img"
    >
      <rect x="2" y="5" width="18" height="18" rx="4" />
      <text
        x="7"
        y="18"
        fill="#fff"
        style={{
          fontFamily: "var(--font-ui), system-ui, sans-serif",
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        S
      </text>
      <text
        x="26"
        y="19"
        style={{
          fontFamily: "var(--font-ui), system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        Stan
      </text>
    </svg>
  );
}
