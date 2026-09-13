import Link from "next/link";
import {
  IconBriefs,
  IconCash,
  IconExceptions,
  IconSpend,
} from "@/components/NavIcons";

const prompts = [
  "How's cash this week?",
  "Spend vs market ranges",
  "Anything weird since Monday?",
  "Draft Monday brief",
];

const nav = [
  { label: "Cash", Icon: IconCash, active: true },
  { label: "Spend", Icon: IconSpend, active: false },
  { label: "Exceptions", Icon: IconExceptions, active: false },
  { label: "Brief Studio", Icon: IconBriefs, active: false },
];

/** Current Pilot app chrome peeking under the dark hero. */
export function LandingDashboardPreview() {
  return (
    <div className="landing-dash-frame relative mx-auto w-full max-w-5xl overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-[#f7f8f8] shadow-[0_-24px_80px_rgba(0,0,0,0.45)]">
      <div className="flex min-h-[240px] md:min-h-[300px]">
        <aside className="hidden w-[200px] shrink-0 border-r border-hairline bg-white p-4 sm:block">
          <div className="wordmark text-[1.35rem] text-ink">Pilot</div>
          <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-hairline bg-white px-2.5 py-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
              NS
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-semibold text-ink">
                Northstar Co.
              </span>
              <span className="block text-[10px] text-muted">Demo · Read-only</span>
            </span>
          </div>
          <nav className="mt-4 space-y-0.5 text-[13px]">
            {nav.map((item) => {
              const Icon = item.Icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                    item.active
                      ? "bg-nav-active font-medium text-ink"
                      : "text-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="relative flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-hairline bg-white px-4 py-3">
            <p className="text-[15px] font-semibold tracking-tight text-ink">
              Cash
            </p>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full border border-hairline px-2.5 py-1 text-[11px] text-muted md:inline">
                Demo Mode
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-medium text-white">
                NS
              </span>
            </div>
          </header>

          <div className="relative px-4 pb-28 pt-5 md:px-6 md:pt-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Balance" value="$788k" />
              <Stat label="Pending" value="$15.6k" />
              <Stat label="30d burn" value="$251k" />
              <Stat label="Runway" value="94d" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 opacity-90">
              <div className="rounded-lg bg-[#f3f4f4] px-3 py-2.5">
                <p className="text-[11px] text-muted">Accounts</p>
                <p className="mt-1 text-[13px] font-medium text-ink">
                  Operating · Reserve · Treasury
                </p>
              </div>
              <div className="rounded-lg bg-[#f3f4f4] px-3 py-2.5">
                <p className="text-[11px] text-muted">Exceptions</p>
                <p className="mt-1 text-[13px] font-medium text-ink">
                  5 radar items
                </p>
              </div>
            </div>

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
                    href="/cash-pulse?pilot=1"
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
                      href="/cash-pulse?pilot=1"
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
    <div className="rounded-lg bg-[#f3f4f4] px-3 py-2.5">
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
