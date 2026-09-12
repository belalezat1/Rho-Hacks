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

export function PartnerMarquee() {
  const row = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <div className="relative overflow-hidden py-4">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent"
        aria-hidden
      />
      <div className="partner-marquee flex w-max items-center gap-20 md:gap-28">
        {row.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex h-14 shrink-0 items-center text-ink"
            title={p.name}
          >
            <p.Logo />
          </div>
        ))}
      </div>
    </div>
  );
}
