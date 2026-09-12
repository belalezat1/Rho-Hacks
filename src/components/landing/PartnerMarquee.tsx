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
    <div className="relative w-full overflow-hidden py-5">
      {/* Soft edge fades — wider so the track reads full-bleed without a hard cut */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white via-white/80 to-transparent md:w-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white via-white/80 to-transparent md:w-40"
        aria-hidden
      />
      <div className="partner-marquee flex w-max items-center gap-24 md:gap-32">
        {row.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex h-16 shrink-0 items-center text-ink md:h-[4.25rem]"
            title={p.name}
          >
            <p.Logo />
          </div>
        ))}
      </div>
    </div>
  );
}
