import {
  LogoElevenLabs,
  LogoRho,
  LogoStan,
  LogoTavily,
} from "@/components/landing/PartnerLogos";

const PARTNERS = [
  { name: "Rho", Logo: LogoRho },
  { name: "ElevenLabs", Logo: LogoElevenLabs },
  { name: "Tavily", Logo: LogoTavily },
  { name: "Stan", Logo: LogoStan },
] as const;

/** Slow L to R logo marquee with real brand lockups. */
export function PartnerMarquee() {
  const row = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <div className="relative overflow-hidden py-3">
      <div className="partner-marquee flex w-max items-center gap-16 md:gap-24">
        {row.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex shrink-0 items-center text-ink"
            title={p.name}
          >
            <p.Logo className="h-9 w-auto md:h-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
