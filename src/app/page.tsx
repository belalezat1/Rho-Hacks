import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #cdfbf2 0%, transparent 40%), radial-gradient(circle at 80% 0%, #e8eaeb 0%, transparent 45%)",
        }}
      />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <PilotWordmark size="sm" />
        <div className="flex items-center gap-4 text-sm">
          <Link href="/talk" className="text-ink">
            Login
          </Link>
          <Link href="/talk" className="btn-primary px-4 py-2 text-sm">
            Start briefing
          </Link>
        </div>
      </header>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center px-6 pb-20">
        <PilotWordmark size="lg" href={null} />
        <h1 className="mt-8 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl">
          Live liquidity intelligence you can brief in minutes
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Talk to Pilot like a CFO — compare what you pay on Rho to public market
          context, then ship the pack. Decision support, never financial advice.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/talk" className="btn-primary px-6 py-3">
            Start briefing
          </Link>
          <Link href="/money" className="btn-secondary px-6 py-3">
            Open Demo Mode
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          <span className="chip">Read-only · Cannot move money</span>
          <span className="chip">Not financial advice</span>
        </div>
      </div>
    </div>
  );
}
