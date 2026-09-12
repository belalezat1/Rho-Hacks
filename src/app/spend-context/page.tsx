import { AppShell } from "@/components/AppShell";
import { formatUsd } from "@/lib/ledger/analytics";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { buildExternalRisk, buildSpendContext } from "@/lib/tavily/spend-context";

export default async function SpendContextPage() {
  const snap = await loadLedgerSnapshot();
  const [{ rows, source }, { items, source: riskSource }] = await Promise.all([
    buildSpendContext(snap.recurrings),
    buildExternalRisk(),
  ]);

  return (
    <AppShell active="/spend-context">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Spend Context</h1>
          <p className="meta mt-1 max-w-2xl">
            What you pay on Rho vs cited public market ranges. Decision support - not a quote or
            hire/cut prescription.
          </p>
        </div>
        <span className="chip">
          Comps: {source} · Risk: {riskSource}
        </span>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-hairline text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="font-medium">You pay (Rho)</th>
              <th className="font-medium">Cited public range</th>
              <th className="font-medium">Band</th>
              <th className="font-medium">Rho IDs</th>
              <th className="font-medium">Sources</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-hairline align-top">
                <td className="px-4 py-3 font-medium">{row.label}</td>
                <td>{formatUsd(row.rhoAmountMonthlyCents)}</td>
                <td>
                  {row.citedRangeLowCents != null && row.citedRangeHighCents != null
                    ? `${formatUsd(row.citedRangeLowCents)}–${formatUsd(row.citedRangeHighCents)}`
                    : " - "}
                </td>
                <td className="capitalize">{row.band.replaceAll("_", " ")}</td>
                <td className="font-mono text-xs text-muted">
                  {row.rhoTransactionIds.join(", ") || " - "}
                </td>
                <td className="max-w-xs text-xs text-muted">
                  {row.citations.map((c) => (
                    <a
                      key={c.url}
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mb-1 block text-ink underline-offset-2 hover:underline"
                    >
                      {c.title}
                    </a>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="card mt-5 p-5">
        <h2 className="font-semibold">External Risk</h2>
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.merchantKey} className="border-t border-hairline pt-3 first:border-0 first:pt-0">
              <p className="font-medium">{item.displayName}</p>
              <p className="meta">{item.headline}</p>
              <div className="mt-1 text-xs">
                {item.citations.map((c) => (
                  <a
                    key={c.url}
                    href={c.url}
                    className="mr-3 text-ink hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.title}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
