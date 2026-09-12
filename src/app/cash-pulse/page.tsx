import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ReceivablesCard, RevenueChart } from "@/components/cash/CashCharts";
import { VendorMark } from "@/components/VendorMark";
import {
  demoReceivables,
  demoRevenueSeries,
} from "@/lib/cash/demo-metrics";
import { formatUsd, resolveMerchant } from "@/lib/ledger/analytics";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";

function statusTone(status: string) {
  if (status === "posted") return "bg-emerald-50 text-ok";
  if (status === "pending") return "bg-amber-50 text-warn";
  return "bg-canvas text-muted";
}

export default async function CashPulsePage() {
  const snap = await loadLedgerSnapshot();
  const pendingCents = snap.transactions
    .filter((t) => t.status === "pending" || t.status === "awaiting_approval")
    .reduce((a, t) => a + Math.abs(t.amountCents), 0);
  const highCents = snap.anomalies
    .filter((a) => a.severity === "high")
    .reduce((a, x) => a + Math.abs(x.amountCents), 0);
  const revenue = demoRevenueSeries(snap.cash.totalCents);
  const receivables = demoReceivables(pendingCents, highCents);
  const dayDelta = Math.round(snap.burn.dailyBurnCents * 0.05);

  return (
    <AppShell active="/cash-pulse">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <h1 className="page-title">Cash</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/anomalies" className="btn-secondary px-4 text-[13px]">
            Exceptions
          </Link>
          <span className="chip">
            {snap.demoMode ? "Demo Mode" : "Live Rho"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="metric-tile">
          <p className="metric-tile-label">Balance</p>
          <p className="metric-tile-value">
            {formatUsd(snap.cash.totalCents)}
          </p>
        </div>
        <div className="metric-tile">
          <p className="metric-tile-label">Pending</p>
          <p className="metric-tile-value">{formatUsd(pendingCents)}</p>
        </div>
        <div className="metric-tile">
          <p className="metric-tile-label">30d burn</p>
          <p className="metric-tile-value">
            {formatUsd(snap.burn.burn30Cents)}
          </p>
          <p className="metric-tile-delta">
            <span className="up" aria-hidden>
              ↑
            </span>
            <span className="font-medium text-[color:var(--ok)]">
              {formatUsd(dayDelta)}
            </span>
            <span className="text-muted">since last day</span>
          </p>
        </div>
        <div className="metric-tile">
          <p className="metric-tile-label">Runway</p>
          <p className="metric-tile-value">
            {snap.burn.runwayDays != null
              ? `${snap.burn.runwayDays} days`
              : "n/a"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="panel-soft">
          <p className="text-[12px] font-medium text-muted">Accounts</p>
          <ul className="mt-3 space-y-0">
            {snap.accounts.map((a) => (
              <li
                key={a.id}
                className="flex justify-between gap-3 border-t border-white/80 py-2.5 text-sm first:border-0 first:pt-0"
              >
                <span>
                  <span className="font-medium text-ink">{a.name}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-muted">
                    {a.id}
                  </span>
                </span>
                <span className="font-semibold tabular-nums">
                  {formatUsd(a.balanceCents)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel-soft">
          <p className="text-[12px] font-medium text-muted">30 / 60 / 90 burn</p>
          <ul className="mt-3 space-y-3 text-sm">
            {[
              ["30d", snap.burn.burn30Cents],
              ["60d", snap.burn.burn60Cents],
              ["90d", snap.burn.burn90Cents],
            ].map(([label, cents]) => (
              <li key={label as string} className="flex justify-between">
                <span className="text-muted">{label}</span>
                <span className="font-semibold tabular-nums">
                  {formatUsd(cents as number)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel-soft">
          <p className="text-[12px] font-medium text-muted">
            Vendor concentration (30d)
          </p>
          <ul className="mt-3 space-y-2.5">
            {snap.concentration.slice(0, 6).map((row) => (
              <li
                key={row.merchantKey}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <VendorMark
                    name={row.displayName}
                    vendorKey={row.merchantKey}
                    size={26}
                  />
                  <span className="truncate font-medium">{row.displayName}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {row.pctOfBurn.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <RevenueChart series={revenue} />
        <ReceivablesCard slices={receivables} />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Recent movements
          </h2>
          <p className="text-[12px] text-muted">Rho transaction IDs</p>
        </div>
        <ul className="space-y-2">
          {snap.transactions.slice(0, 12).map((tx) => {
            const m = resolveMerchant(tx);
            return (
              <li key={tx.id} className="txn-row">
                <VendorMark
                  name={m?.displayName}
                  vendorKey={m?.key}
                  size={34}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-semibold tabular-nums text-ink">
                      {formatUsd(tx.amountCents)}
                    </span>
                    <span className="text-[13px] text-muted">
                      {m?.displayName ?? "Unmapped"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
                    {tx.rawDescriptor}
                    <span className="mx-1.5 text-hairline">·</span>
                    {tx.id}
                  </p>
                </div>
                <span className="hidden text-[13px] text-muted sm:inline">
                  {new Date(tx.postedAt).toLocaleDateString()}
                </span>
                <span className="hidden text-[12px] capitalize text-muted md:inline">
                  {tx.type}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusTone(tx.status)}`}
                >
                  {tx.status.replaceAll("_", " ")}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
