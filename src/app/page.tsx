import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";
import { LandingDashboardPreview } from "@/components/landing/LandingDashboardPreview";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingScrollSections } from "@/components/landing/LandingScrollSections";
import { ScrollRevealInit } from "@/components/landing/ScrollRevealInit";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollRevealInit />

      <div className="landing-root relative flex min-h-[min(100vh,920px)] flex-col bg-rho-black text-white">
        {/* Noise stays in the upper hero only so particles stay off the gradient seam */}
        <div
          className="landing-noise pointer-events-none absolute inset-x-0 top-0 h-[70%]"
          aria-hidden
        />
        <div
          className="landing-fade pointer-events-none absolute inset-x-0 bottom-0 h-[35%]"
          aria-hidden
        />

        <LandingHeader />

        <main className="relative z-10 flex flex-1 flex-col">
          <section className="reveal mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-10 text-center md:px-10 md:pt-14">
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
                className="btn-primary rounded-full px-8 py-4 text-center text-[17px] font-medium"
              >
                Start briefing
              </Link>
              <Link
                href="/briefs"
                className="btn-ghost-light rounded-full px-8 py-4 text-center text-[17px] font-medium"
              >
                Open Brief Studio
              </Link>
            </div>

            <p className="mt-6 max-w-md text-[13px] leading-relaxed text-white/40">
              Read-only on Rho. Cannot move money. Not tax, legal, or investment
              advice.
            </p>
          </section>

          {/* Dashboard sits inside the black→white wash so the fade and product peek align */}
          <div className="landing-hero-bottom relative z-10 mt-auto w-full">
            <div className="landing-bw-fade absolute inset-0" aria-hidden />
            <div className="relative px-4 pt-16 md:px-8 md:pt-20">
              <div className="reveal reveal-delay">
                <LandingDashboardPreview />
              </div>
            </div>
          </div>
        </main>
      </div>

      <LandingScrollSections />
    </div>
  );
}
