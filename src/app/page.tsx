import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";
import { LandingDashboardPreview } from "@/components/landing/LandingDashboardPreview";
import { LandingScrollSections } from "@/components/landing/LandingScrollSections";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero — Rho dark landing */}
      <div className="landing-root relative flex min-h-screen flex-col overflow-hidden bg-rho-black text-white">
        <div className="landing-noise pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="landing-fade pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          aria-hidden
        />

        <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 md:px-8">
          <PilotWordmark size="sm" tone="dark" />
          <nav className="hidden items-center gap-7 text-[13px] text-white/70 md:flex">
            <a href="#how" className="transition hover:text-white">
              How it works
            </a>
            <a href="#integrations" className="transition hover:text-white">
              Integrations
            </a>
            <Link href="/money" className="transition hover:text-white">
              Demo
            </Link>
          </nav>
          <div className="flex items-center gap-4 text-[13px]">
            <Link
              href="/talk"
              className="text-white/80 transition hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/talk"
              className="btn-primary px-3.5 py-2 text-[13px] font-medium"
            >
              Start briefing
            </Link>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col">
          <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 pt-10 text-center md:px-8 md:pt-14">
            <p className="landing-pill inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[11px] tracking-wide text-white/75">
              <span className="inline-block h-1.5 w-1.5 rounded-[2px] bg-mint" />
              Built on Rho · ElevenLabs · Tavily · Stan
            </p>

            <div className="mt-8 md:mt-10">
              <PilotWordmark size="hero" tone="dark" href={null} />
            </div>

            <h1 className="mt-6 max-w-2xl text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              Talk to your company money like a CFO
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-base md:text-lg">
              Live liquidity intelligence on Rho — compare spend to public market
              context, brief by voice, ship the pack. Decision support, not
              advice.
            </p>

            <div className="mt-8 flex w-full max-w-lg flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/talk"
                className="btn-primary px-5 py-3 text-center text-[14px] font-medium"
              >
                Start briefing
              </Link>
              <Link
                href="/money"
                className="btn-ghost-light px-5 py-3 text-center text-[14px] font-medium"
              >
                Open Demo Mode
              </Link>
            </div>

            <p className="mt-5 max-w-md text-[11px] leading-relaxed text-white/35">
              Read-only on Rho — cannot move money. Not tax, legal, or investment
              advice.
            </p>
          </section>

          <div className="relative z-10 mt-auto w-full px-3 pt-14 md:px-6 md:pt-16">
            <LandingDashboardPreview />
          </div>
        </main>
      </div>

      {/* Scroll sections — Rho white / bento / dark list */}
      <LandingScrollSections />
    </div>
  );
}
