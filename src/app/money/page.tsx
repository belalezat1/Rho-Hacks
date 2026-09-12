import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { formatUsd } from "@/lib/ledger/analytics";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";

const hubs = [
  {
    href: "/cash-pulse",
    label: "Cash Pulse",
    blurb: "Balances, burn, runway. Rho-shaped IDs.",
  },
  {
    href: "/anomalies",
    label: "Anomalies",
    blurb: "Radar since the period open. Escalate in Rho.",
  },
  {
    href: "/spend-context",
    label: "Spend Context",
    blurb: "Public-web comps via Tavily. Not quotes.",
  },
] as const;

export default async function MoneyPage() {
  const snap = await loadLedgerSnapshot();

  return (
    <AppShell active="/money">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Money</h1>
        </div>
        <span className="chip">{snap.demoMode ? "Demo Mode" : "Live Rho"}</span>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
            Cash
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {formatUsd(snap.cash.totalCents)}
          </p>
        </div>
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
            30d burn
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {formatUsd(snap.burn.burn30Cents)}
          </p>
        </div>
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
            Runway
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {snap.burn.runwayDays != null ? `${snap.burn.runwayDays}d` : "n/a"}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-hairline border-y border-hairline">
        {hubs.map((h) => (
          <li key={h.href}>
            <Link
              href={h.href}
              className="flex flex-col gap-1 py-5 transition hover:bg-surface/60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="text-[17px] font-medium text-ink">{h.label}</span>
              <span className="text-[14px] text-muted sm:text-right">
                {h.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-[14px] text-muted">
        Prefer voice?{" "}
        <Link href="/talk" className="font-medium text-ink underline-offset-2 hover:underline">
          Talk to Pilot
        </Link>
      </p>
    </AppShell>
  );
}
