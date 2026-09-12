import Link from "next/link";
import { HalftoneVoice } from "@/components/HalftoneVoice";
import { ParticleField } from "@/components/landing/ParticleField";
import { PartnerMarquee } from "@/components/landing/PartnerMarquee";

const STEPS = [
  {
    kicker: "01 · Talk",
    title: "Ask like a CFO",
    body: "Open a guided briefing conversation. Clarify fuzzy labels, pull live tools, confirm before you publish — decision support, not advice.",
    sponsor: "ElevenLabs",
  },
  {
    kicker: "02 · See",
    title: "Read your Rho books",
    body: "Cash position, burn, runway, concentration, and transaction IDs you can verify. Read-only by design — Pilot never moves money.",
    sponsor: "Rho",
  },
  {
    kicker: "03 · Compare",
    title: "Spend vs public market context",
    body: "See what you pay next to cited public ranges and alternatives for tools and roles — so the brief is grounded, not guessed.",
    sponsor: "Tavily",
  },
  {
    kicker: "04 · Ship",
    title: "Forward the money brief",
    body: "PDF + spoken standup lands as a digital pack you can send to a co-founder or client — the conversation finishes as a deliverable.",
    sponsor: "Stan",
  },
] as const;

const PROMISES = [
  { n: "01", label: "Read-only Rho access", value: "Safe by design" },
  { n: "02", label: "Cash, burn, runway in one briefing", value: "Included" },
  { n: "03", label: "Cited spend context on your stack", value: "Included" },
  { n: "04", label: "Spoken standup on every pack", value: "Included" },
  { n: "05", label: "Forwardable brief for co-founders", value: "Included" },
  { n: "06", label: "Financial / tax / legal advice", value: "Never" },
] as const;

export function LandingScrollSections() {
  return (
    <div className="bg-white text-ink">
      {/* Integrations + particle cloud */}
      <section
        id="integrations"
        className="relative overflow-hidden border-t border-hairline px-5 py-16 md:px-8 md:py-20"
      >
        <ParticleField className="opacity-90" density={1.15} />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="mx-auto w-fit rounded-full border border-hairline px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted md:text-[11px]">
            Integrated with extraordinary companies such as
          </p>
          <div className="mt-10">
            <PartnerMarquee />
          </div>
        </div>
      </section>

      {/* Easy to start — Rho two-column */}
      <section className="relative px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
              Built for the Monday brief
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl md:leading-[1.15]">
              Easy to start,
              <br />
              sharp when you scale.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted md:text-base">
              Pilot sits on Rho as a CFO-style briefing layer — liquidity
              intelligence, spend context, and a pack you can forward. From first
              demo to weekly ritual, same loop.
            </p>
          </div>
          <div className="relative aspect-square w-full max-w-md justify-self-center overflow-hidden rounded-sm bg-rho-black md:justify-self-end">
            <HalftoneVoice className="h-full w-full" />
          </div>
        </div>
      </section>

      {/* MVP steps — bento inspired by Rho product grid */}
      <section id="how" className="px-5 pb-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Built for how you actually
              <br className="hidden sm:block" /> check the books.
            </h2>
            <Link
              href="/talk"
              className="btn-primary inline-flex w-fit px-4 py-2.5 text-[13px] font-medium"
            >
              Start briefing
            </Link>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {/* Wide financial step with particles behind */}
            <article className="relative overflow-hidden rounded-2xl bg-[#f3f4f4] p-6 md:col-span-2 md:p-8">
              <ParticleField density={0.85} className="opacity-70" />
              <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-end">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Cash pulse · Rho
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    See live liquidity in the briefing.
                  </h3>
                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
                    Balances, burn, and runway pull from your Rho ledger so the
                    conversation starts with numbers you can trust — with IDs on
                    screen.
                  </p>
                </div>
                <div className="rounded-xl border border-hairline bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md border border-hairline px-2.5 py-1 text-[12px]">
                      + Deposit
                    </span>
                    <span className="rounded-md border border-hairline px-2.5 py-1 text-[12px]">
                      Transfer
                    </span>
                    <span className="btn-primary px-2.5 py-1 text-[12px]">Pay</span>
                  </div>
                  <p className="mt-4 text-[12px] text-muted">Cash position</p>
                  <p className="text-2xl font-semibold tracking-tight text-ink">
                    $428,410.22
                  </p>
                  <CashSparkline />
                </div>
              </div>
            </article>

            {STEPS.map((step) => (
              <article
                key={step.kicker}
                className="flex flex-col rounded-2xl bg-[#f3f4f4] p-6 md:p-7"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {step.kicker}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">
                  {step.body}
                </p>
                <p className="mt-6 text-[12px] font-medium text-ink/70">
                  via {step.sponsor}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Second product row — guided path cards */}
      <section className="px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-3">
          <PathCard
            tag="NEW"
            kicker="Spend context"
            title="Is what we pay in range?"
            body="Cited public ranges for your SaaS and contractors — compare, don’t prescribe."
            href="/spend-context"
          />
          <PathCard
            tag="NEW"
            kicker="Anomalies"
            title="Catch weird spend early"
            body="New merchants, spikes, and pending items in a radar queue — context for review in Rho."
            href="/anomalies"
          />
          <PathCard
            kicker="Briefs"
            title="Ship the Monday pack"
            body="Weekly Money Brief or Client Close Pack — PDF, audio standup, Stan link."
            href="/briefs"
          />
        </div>
      </section>

      {/* Dark promises list — Rho fees section pattern */}
      <section className="bg-rho-black px-5 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl md:leading-[1.15]">
            Brief company cash with clarity, not clutter.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/55">
            No second banking dashboard to learn. Pilot is the CFO-style layer on
            Rho — compare, cite, draft, send.
          </p>
          <ul className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {PROMISES.map((row) => (
              <li
                key={row.n}
                className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-5 text-[15px] md:grid-cols-[3rem_1fr_auto] md:gap-6 md:text-base"
              >
                <span className="font-mono text-[12px] text-white/35">{row.n}</span>
                <span className="text-white/90">{row.label}</span>
                <span className="font-medium text-white">{row.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/talk"
              className="btn-primary px-5 py-3 text-[14px] font-medium"
            >
              Start briefing
            </Link>
            <Link
              href="/money"
              className="btn-ghost-light px-5 py-3 text-[14px] font-medium"
            >
              Open Demo Mode
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PathCard({
  tag,
  kicker,
  title,
  body,
  href,
}: {
  tag?: string;
  kicker: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl bg-[#f3f4f4] p-6 transition hover:bg-[#eceeee] md:p-7"
    >
      <div className="flex items-center gap-2">
        {tag ? (
          <span className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink bg-mint">
            {tag}
          </span>
        ) : null}
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {kicker}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink group-hover:underline">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-muted">{body}</p>
    </Link>
  );
}

function CashSparkline() {
  return (
    <svg
      viewBox="0 0 280 72"
      className="mt-3 h-16 w-full text-mint"
      aria-hidden
    >
      <defs>
        <linearGradient id="pilotCashFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 58 C 30 54, 45 40, 70 42 C 100 45, 120 28, 150 30 C 180 32, 200 18, 230 22 C 250 24, 265 16, 280 12 L 280 72 L 0 72 Z"
        fill="url(#pilotCashFill)"
      />
      <path
        d="M0 58 C 30 54, 45 40, 70 42 C 100 45, 120 28, 150 30 C 180 32, 200 18, 230 22 C 250 24, 265 16, 280 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
