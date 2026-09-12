import Link from "next/link";

const prompts = [
  "How’s cash this week?",
  "Spend vs market ranges",
  "Anything weird since Monday?",
  "Draft Monday brief",
];

/** Light Rho-style product chrome peeking under the dark hero - teases the briefing dashboard. */
export function LandingDashboardPreview() {
  return (
    <div className="landing-dash-frame relative mx-auto w-full max-w-5xl overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-[#f7f8f8] shadow-[0_-24px_80px_rgba(0,0,0,0.45)]">
      {/* App chrome */}
      <div className="flex min-h-[220px] md:min-h-[280px]">
        <aside className="hidden w-48 shrink-0 border-r border-hairline bg-white p-4 sm:block">
          <div className="wordmark text-xl text-ink">Pilot</div>
          <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-muted">
            Northstar Co.
          </p>
          <nav className="mt-4 space-y-1 text-[13px] text-muted">
            <div className="rounded-md bg-nav-active px-2 py-1.5 text-ink">
              Briefs
            </div>
            <div className="px-2 py-1.5">Spend</div>
            <div className="px-2 py-1.5">Cash</div>
            <div className="px-2 py-1.5">Talk</div>
          </nav>
        </aside>

        <div className="relative flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-hairline bg-white px-4 py-3">
            <div className="hidden h-8 flex-1 max-w-xs rounded-md border border-hairline bg-canvas px-3 text-[12px] leading-8 text-muted sm:block">
              Search
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full border border-hairline px-2.5 py-1 text-[11px] text-muted md:inline">
                Read-only
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-medium text-white">
                NS
              </span>
            </div>
          </header>

          <div className="relative px-4 pb-24 pt-5 md:px-8 md:pt-8">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md border border-hairline bg-white px-3 py-1.5 text-[13px] font-medium text-ink"
              >
                + Deposit
              </button>
              <button
                type="button"
                className="rounded-md border border-hairline bg-white px-3 py-1.5 text-[13px] font-medium text-ink"
              >
                Transfer
              </button>
              <button
                type="button"
                className="btn-primary px-3 py-1.5 text-[13px]"
              >
                Pay
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 opacity-90">
              <Stat label="Cash" value="$428k" />
              <Stat label="Burn / mo" value="$62k" />
              <Stat label="Runway" value="6.9 mo" />
            </div>

            {/* Floating ask bar - Rho AI Demo pattern */}
            <div className="absolute bottom-4 left-1/2 z-10 w-[min(100%-1.5rem,34rem)] -translate-x-1/2 md:bottom-6">
              <div className="rounded-2xl border border-hairline bg-white p-3 shadow-[0_12px_40px_rgba(15,23,22,0.12)]">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-[11px] font-medium text-ink">
                    You
                  </span>
                  <span className="flex-1 text-[14px] text-muted">
                    Ask your question
                  </span>
                  <Link
                    href="/talk"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint text-ink"
                    aria-label="Start briefing"
                  >
                    <SendIcon />
                  </Link>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {prompts.map((p) => (
                    <Link
                      key={p}
                      href="/talk"
                      className="rounded-full border border-hairline px-2.5 py-1 text-[11px] text-muted transition hover:border-ink/20 hover:text-ink"
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-white px-3 py-2.5">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h12M12 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
