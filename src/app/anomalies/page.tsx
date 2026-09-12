import { AppShell } from "@/components/AppShell";
import { VendorMark } from "@/components/VendorMark";
import { formatUsd } from "@/lib/ledger/analytics";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";

const severityClass = {
  high: "border-danger/25 bg-red-50/40",
  medium: "border-warn/25 bg-amber-50/35",
  low: "border-ok/25 bg-emerald-50/35",
};

export default async function AnomaliesPage() {
  const snap = await loadLedgerSnapshot();

  return (
    <AppShell active="/anomalies">
      <div className="mb-7 max-w-2xl">
        <h1 className="page-title">Exceptions</h1>
        <p className="meta mt-3">
          Heuristic flags only - radar, not verdict. Escalate in Rho. Not
          compliance clearance.
        </p>
      </div>
      <ul className="space-y-3">
        {snap.anomalies.map((a) => {
          const vendorHint =
            a.title.match(/Intercom|AWS|Amazon|Figma|Notion|Gusto|Jordan|Northpeak|PQRS/i)?.[0] ??
            null;
          return (
            <li
              key={a.id}
              className={`card flex flex-wrap items-start justify-between gap-4 p-5 ${severityClass[a.severity]}`}
            >
              <div className="flex min-w-0 gap-3.5">
                <VendorMark name={vendorHint} size={36} />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    {a.severity} · {a.kind}
                  </p>
                  <h2 className="mt-1 text-[16px] font-semibold tracking-tight text-ink">
                    {a.title}
                  </h2>
                  <p className="meta mt-1.5">{a.detail}</p>
                  <p className="mt-2 font-mono text-[11px] text-muted">
                    txs: {a.transactionIds.join(", ")}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
                {formatUsd(a.amountCents)}
              </p>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
