const PARTNERS = [
  { name: "Rho", blurb: "Ledger truth" },
  { name: "ElevenLabs", blurb: "Briefing voice" },
  { name: "Tavily", blurb: "Spend context" },
  { name: "Stan", blurb: "Ship the pack" },
] as const;

/** Slow L→R logo marquee — Rho landing pattern, Pilot sponsors. */
export function PartnerMarquee() {
  const row = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <div className="relative overflow-hidden py-2">
      <div className="partner-marquee flex w-max items-center gap-14 md:gap-20">
        {row.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex shrink-0 items-baseline gap-2 text-ink"
          >
            <span className="text-[1.35rem] font-semibold tracking-tight md:text-[1.6rem]">
              {p.name}
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted sm:inline">
              {p.blurb}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
