"use client";

import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";
import { PartnerMarquee } from "@/components/landing/PartnerMarquee";

const GLASS_LOOP =
  "https://a.storyblok.com/f/332122/x/780bb1b652/6409738_glass-loop-dynamic-abstract_by_bawan_artlist_hd-particles.mp4";

export function LandingScrollSections() {
  return (
    <div className="relative z-10 -mt-px bg-white text-ink">
      <section
        id="integrations"
        className="reveal overflow-hidden px-0 py-20 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="mx-auto w-fit rounded-full border border-hairline px-5 py-2 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
            Enterprise systems used
          </p>
        </div>
        <div className="mt-12 w-full">
          <PartnerMarquee />
        </div>
      </section>

      <section id="how" className="reveal px-6 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Open Pilot
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
              Talk to your books, review spend context, and ship a brief. Four
              doors into the same product.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <EntryLink
                href="/briefs"
                title="Brief Studio"
                body="Assemble and publish the pack"
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
                href="/cash-pulse?pilot=1"
                title="Ask Pilot"
                body="CFO-style briefing assistant"
              />
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[#0a0a0a] md:aspect-square">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={GLASS_LOOP}
              autoPlay
              muted
              loop
              playsInline
              aria-label="Abstract glass particle animation"
            />
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
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="btn-lift flex items-center justify-between rounded-2xl bg-[#f3f4f4] px-5 py-4 text-ink transition hover:bg-[#eceeee]"
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

function LandingFooter() {
  return (
    <footer className="border-t border-hairline bg-[#faf9f6] px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <PilotWordmark size="sm" />
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
            { href: "/cash-pulse", label: "Cash" },
            { href: "/spend-context", label: "Spend" },
            { href: "/anomalies", label: "Exceptions" },
            { href: "/briefs", label: "Brief Studio" },
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
            { href: "/cash-pulse?pilot=1", label: "Ask Pilot" },
            { href: "/briefs", label: "Brief Studio" },
            { href: "/anomalies", label: "Exceptions" },
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
