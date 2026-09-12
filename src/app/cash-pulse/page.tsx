import { AppShell } from "@/components/AppShell";
import { formatUsd, resolveMerchant } from "@/lib/ledger/analytics";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";

export default async function CashPulsePage() {
  const snap = await loadLedgerSnapshot();

  return (
    <AppShell active="/cash-pulse">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Cash Pulse</h1>
          <p className="meta mt-1">
            Multi-account cash, burn/runway, concentration — claims tie to Rho-shaped IDs.
          </p>
        </div>
        <span className="chip">{snap.demoMode ? "Demo Mode" : "Live Rho"}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs text-muted">Cash balance</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {formatUsd(snap.cash.totalCents)}
          </p>
          <div className="dot-grid mt-4 h-16 rounded-lg border border-hairline" />
          <ul className="mt-4 space-y-2 text-sm">
            {snap.accounts.map((a) => (
              <li key={a.id} className="flex justify-between gap-2 border-t border-hairline pt-2">
                <span>
                  {a.name}
                  <span className="mt-0.5 block font-mono text-[11px] text-muted">{a.id}</span>
                </span>
                <span className="font-medium">{formatUsd(a.balanceCents)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <p className="text-xs text-muted">30 / 60 / 90 burn</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">30d</span>
              <span className="font-semibold">{formatUsd(snap.burn.burn30Cents)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">60d</span>
              <span className="font-semibold">{formatUsd(snap.burn.burn60Cents)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">90d</span>
              <span className="font-semibold">{formatUsd(snap.burn.burn90Cents)}</span>
            </li>
          </ul>
          <p className="meta mt-4">
            Approx. runway{" "}
            <span className="font-semibold text-ink">
              {snap.burn.runwayDays != null ? `${snap.burn.runwayDays} days` : "n/a"}
            </span>
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-muted">Vendor concentration (30d)</p>
          <ul className="mt-3 space-y-2 text-sm">
            {snap.concentration.slice(0, 6).map((row) => (
              <li key={row.merchantKey} className="flex justify-between gap-2">
                <span>{row.displayName}</span>
                <span className="font-semibold">{row.pctOfBurn.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mt-5 overflow-hidden">
        <div className="border-b border-hairline px-5 py-3">
          <h2 className="font-semibold">Recent movements</h2>
        </div>
        <div className="overflow-x-auto px-5">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="py-3 font-medium">Date</th>
                <th className="font-medium">Raw → normalized</th>
                <th className="font-medium">Type</th>
                <th className="font-medium">Status</th>
                <th className="font-medium">Amount</th>
                <th className="font-medium">ID</th>
              </tr>
            </thead>
            <tbody>
              {snap.transactions.slice(0, 15).map((tx) => {
                const m = resolveMerchant(tx);
                return (
                  <tr key={tx.id} className="border-t border-hairline">
                    <td className="py-3 whitespace-nowrap">
                      {new Date(tx.postedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="font-mono text-xs text-muted">{tx.rawDescriptor}</span>
                      <span className="mt-0.5 block">{m?.displayName ?? "—"}</span>
                    </td>
                    <td>{tx.type}</td>
                    <td>{tx.status}</td>
                    <td className="font-medium">{formatUsd(tx.amountCents)}</td>
                    <td className="font-mono text-xs text-muted">{tx.id}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
