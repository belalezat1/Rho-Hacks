"use client";

import Link from "next/link";
import { PilotBrandMark } from "@/components/landing/PartnerLogos";
import { ParticleField } from "@/components/landing/ParticleField";
import { PartnerMarquee } from "@/components/landing/PartnerMarquee";

export function LandingScrollSections() {
  return (
    <div className="relative z-10 bg-white text-ink">
      <section
        id="integrations"
        className="reveal relative overflow-hidden px-6 py-20 md:px-10 md:py-24"
      >
        <ParticleField className="opacity-70" density={0.9} />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="mx-auto w-fit rounded-full border border-hairline px-5 py-2 text-center text-[14px] font-medium tracking-wide text-muted">
            Integration using companies such as
          </p>
          <div className="mt-12">
            <PartnerMarquee />
          </div>
        </div>
      </section>

      <section id="how" className="reveal px-6 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Open Pilot
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
              Talk to your books, review spend context, and ship a brief. Three
              doors into the same product.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <EntryLink
                href="/briefs"
                title="Briefs"
                body="Assemble and publish the pack"
                primary
              />
              <EntryLink
                href="/spend-context"
                title="Spend"
                body="Cited public market ranges"
              />
              <EntryLink
                href="/cash-pulse"
                title="Cash"
                body="Balances, burn, runway"
              />
              <EntryLink
                href="/talk"
                title="Talk"
                body="Ask Pilot about the week"
              />
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[#0a0a0a] md:aspect-square">
            <AbstractPilotVisual />
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function EntryLink({
  href,
  title,
  body,
  primary,
}: {
  href: string;
  title: string;
  body: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`btn-lift flex items-center justify-between rounded-2xl px-5 py-4 transition ${
        primary
          ? "bg-mint text-ink"
          : "bg-[#f3f4f4] text-ink hover:bg-[#eceeee]"
      }`}
    >
      <span>
        <span className="block text-[17px] font-semibold tracking-tight">
          {title}
        </span>
        <span className="mt-0.5 block text-[14px] text-ink/60">{body}</span>
      </span>
      <span className="text-xl text-ink/50" aria-hidden>
        →
      </span>
    </Link>
  );
}

function AbstractPilotVisual() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 28% 22%, rgba(57,239,205,0.28), transparent 42%), radial-gradient(circle at 78% 68%, rgba(255,255,255,0.07), transparent 38%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.75) 1px, transparent 1.2px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 75%)",
        }}
      />
      {/* Abstract liquidity curves */}
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path
          d="M0 280 C80 240 120 320 200 260 C280 200 320 220 400 160"
          fill="none"
          stroke="rgba(57,239,205,0.7)"
          strokeWidth="1.5"
        />
        <path
          d="M0 310 C90 270 140 340 210 290 C290 230 340 250 400 200"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.2"
        />
        <path
          d="M0 340 C100 300 160 360 230 320 C300 280 350 290 400 250"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-10 backdrop-blur-sm">
          <PilotBrandMark tone="dark" size="lg" />
          <p className="mt-6 max-w-[14rem] text-[14px] leading-relaxed text-white/50">
            Liquidity intelligence you can brief and forward.
          </p>
        </div>
      </div>
    </div>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-hairline bg-[#faf9f6] px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <PilotBrandMark size="sm" />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
            Built for founders and accountants who want a faster money brief on
            Rho.
          </p>
          <form
            className="mt-6 flex max-w-sm items-center border-b border-ink/20 pb-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
              aria-label="Email"
            />
            <button
              type="submit"
              className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white"
              aria-label="Submit"
            >
              →
            </button>
          </form>
          <p className="mt-3 text-[12px] text-muted-soft">
            Demo waitlist. No spam.
          </p>
        </div>

        <FooterCol
          title="Product"
          links={[
            { href: "/briefs", label: "Briefs" },
            { href: "/spend-context", label: "Spend" },
            { href: "/cash-pulse", label: "Cash" },
            { href: "/talk", label: "Talk" },
          ]}
        />
        <FooterCol
          title="Partners"
          links={[
            { href: "#integrations", label: "Rho" },
            { href: "#integrations", label: "ElevenLabs" },
            { href: "#integrations", label: "Tavily" },
            { href: "#integrations", label: "Stan" },
          ]}
        />
        <FooterCol
          title="Demo"
          links={[
            { href: "/talk", label: "Start briefing" },
            { href: "/briefs", label: "Brief Studio" },
            { href: "/anomalies", label: "Anomalies" },
          ]}
        />
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-3 border-t border-ink/10 pt-6 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Pilot. Demo for Rho Lock In.</p>
        <p>Read-only · Decision support, not advice</p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[15px] text-ink/80 transition hover:text-ink"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
