import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { formatUsd } from "@/lib/ledger/analytics";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";

const sections = [
  {
    href: "/cash-pulse",
    title: "Cash Pulse",
    body: "Balances, burn, runway, concentration.",
  },
  {
    href: "/anomalies",
    title: "Anomalies",
    body: "Pending, first-time, and spike radar.",
  },
  {
    href: "/spend-context",
    title: "Spend Context",
    body: "What you pay vs cited public ranges.",
  },
];

export default async function MoneyPage() {
  const snap = await loadLedgerSnapshot();

  return (
    <AppShell active="/money">
      <div className="mb-6">
        <h1 className="page-title">Money</h1>
        <p className="meta mt-1">
          One place for ledger truth. Open a view when you need depth.
        </p>
      </div>

      <div className="card mb-5 p-5">
        <p className="text-xs text-muted">Cash position</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">
          {formatUsd(snap.cash.totalCents)}
        </p>
        <p className="meta mt-2">
          ~{snap.burn.runwayDays ?? "n/a"} days runway · {snap.anomalies.length} radar
          items
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="card block p-5 transition hover:border-ink/20"
          >
            <h2 className="font-semibold">{s.title}</h2>
            <p className="meta mt-1">{s.body}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
