import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";
import { LandingDashboardPreview } from "@/components/landing/LandingDashboardPreview";
import { LandingScrollSections } from "@/components/landing/LandingScrollSections";
import { ScrollColorBridge } from "@/components/landing/ScrollColorBridge";
import { ScrollRevealInit } from "@/components/landing/ScrollRevealInit";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollRevealInit />

      <div className="landing-root landing-hero-blend relative flex min-h-screen flex-col overflow-hidden bg-rho-black text-white">
        <div className="landing-noise pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="landing-fade pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          aria-hidden
        />

        <header className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-6 py-6 md:px-10">
          <div className="justify-self-start">
            <PilotWordmark size="nav" tone="dark" />
          </div>
          <div className="flex items-center justify-end gap-4">
            <a
              href="#integrations"
              className="nav-link hidden text-[15px] text-white/75 transition hover:text-white sm:inline"
            >
              Integrations
            </a>
            <Link
              href="/talk"
              className="btn-primary btn-lift px-6 py-3.5 text-[16px] font-medium"
            >
              Start briefing
            </Link>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col">
          <section className="reveal mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-12 text-center md:px-10 md:pt-16">
            <p className="landing-pill inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-[13px] tracking-wide text-white/75">
              <span className="inline-block h-1.5 w-1.5 rounded-[2px] bg-mint" />
              Built on Rho, ElevenLabs, Tavily, and Stan
            </p>

            <div className="mt-10 md:mt-12">
              <PilotWordmark size="hero" tone="dark" href={null} />
            </div>

            <h1 className="mt-8 max-w-2xl text-[2rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[3rem] md:leading-[1.1]">
              Talk to your company money like a CFO
            </h1>

            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/65 sm:text-lg md:text-[1.25rem]">
              Live liquidity intelligence on Rho. Compare spend to public market
              context, brief by voice, ship the pack. Decision support, not
              advice.
            </p>

            <div className="mt-10 flex w-full max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/talk"
                className="btn-primary btn-lift px-8 py-4 text-center text-[17px] font-medium"
              >
                Start briefing
              </Link>
              <Link
                href="/briefs"
                className="btn-ghost-light btn-lift px-8 py-4 text-center text-[17px] font-medium"
              >
                Open Brief Studio
              </Link>
            </div>

            <p className="mt-6 max-w-md text-[13px] leading-relaxed text-white/40">
              Read-only on Rho. Cannot move money. Not tax, legal, or investment
              advice.
            </p>
          </section>

          <div className="reveal reveal-delay relative z-10 mt-auto w-full px-4 pt-16 md:px-8 md:pt-20">
            <LandingDashboardPreview />
          </div>
        </main>
      </div>

      <ScrollColorBridge />
      <LandingScrollSections />
    </div>
  );
}
