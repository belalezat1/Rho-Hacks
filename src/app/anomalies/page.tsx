import { AppShell } from "@/components/AppShell";
import { formatUsd } from "@/lib/ledger/analytics";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";

const severityClass = {
  high: "border-danger/30 bg-red-50/50",
  medium: "border-warn/30 bg-amber-50/40",
  low: "border-ok/30 bg-emerald-50/40",
};

export default async function AnomaliesPage() {
  const snap = await loadLedgerSnapshot();

  return (
    <AppShell active="/anomalies">
      <div className="mb-5">
        <h1 className="page-title">Anomaly Radar</h1>
        <p className="meta mt-1">
          Heuristic flags only - radar, not verdict. Escalate in Rho. Not compliance clearance.
        </p>
      </div>
      <ul className="space-y-3">
        {snap.anomalies.map((a) => (
          <li key={a.id} className={`card p-4 ${severityClass[a.severity]}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {a.severity} · {a.kind}
                </p>
                <h2 className="mt-1 font-semibold text-ink">{a.title}</h2>
                <p className="meta mt-1">{a.detail}</p>
                <p className="mt-2 font-mono text-xs text-muted">
                  txs: {a.transactionIds.join(", ")}
                </p>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-ink">
                {formatUsd(a.amountCents)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
