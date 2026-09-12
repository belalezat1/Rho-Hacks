import { AppShell } from "@/components/AppShell";
import { SparkleChip, VendorMark } from "@/components/VendorMark";
import { formatUsd } from "@/lib/ledger/analytics";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { buildExternalRisk, buildSpendContext } from "@/lib/tavily/spend-context";

function bandClass(band: string) {
  if (band.includes("above") || band.includes("high")) return "danger";
  if (band.includes("below") || band.includes("low")) return "warn";
  return "";
}

export default async function SpendContextPage() {
  const snap = await loadLedgerSnapshot();
  const [{ rows, source }, { items, source: riskSource }] = await Promise.all([
    buildSpendContext(snap.recurrings),
    buildExternalRisk(),
  ]);

  return (
    <AppShell active="/spend-context">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="page-title">Spend Context</h1>
          <p className="meta mt-3">
            What you pay on Rho vs cited public market ranges. Decision support -
            not a quote or hire/cut prescription.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <SparkleChip>Account</SparkleChip>
            <SparkleChip>Department</SparkleChip>
            <SparkleChip>Vendor</SparkleChip>
          </div>
        </div>
        <span className="chip">
          Comps: {source} · Risk: {riskSource}
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-hairline px-5 py-3.5">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Competitive spend
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-hairline text-[12px] text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="py-3 font-medium">You pay (Rho)</th>
                <th className="py-3 font-medium">Cited public range</th>
                <th className="py-3 font-medium">Band</th>
                <th className="py-3 font-medium">Rho IDs</th>
                <th className="px-5 py-3 font-medium">Sources</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-t border-hairline align-middle transition hover:bg-canvas/50"
                >
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-3">
                      <VendorMark name={row.label} size={32} />
                      <span className="font-medium text-ink">{row.label}</span>
                    </span>
                  </td>
                  <td className="font-semibold tabular-nums">
                    {formatUsd(row.rhoAmountMonthlyCents)}
                  </td>
                  <td className="tabular-nums text-muted">
                    {row.citedRangeLowCents != null &&
                    row.citedRangeHighCents != null
                      ? `${formatUsd(row.citedRangeLowCents)}–${formatUsd(row.citedRangeHighCents)}`
                      : " - "}
                  </td>
                  <td>
                    <span
                      className={`band-pill capitalize ${bandClass(row.band)}`}
                    >
                      {row.band.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="max-w-[140px] font-mono text-[11px] text-muted">
                    {row.rhoTransactionIds.slice(0, 2).join(", ") || " - "}
                    {row.rhoTransactionIds.length > 2 ? "…" : ""}
                  </td>
                  <td className="max-w-xs px-5 text-[12px] text-muted">
                    {row.citations.map((c) => (
                      <a
                        key={c.url}
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mb-1 block text-ink/80 underline-offset-2 hover:underline"
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
      </div>

      <section className="card mt-5 p-0">
        <div className="border-b border-hairline px-5 py-3.5">
          <h2 className="text-[15px] font-semibold tracking-tight">
            External Risk
          </h2>
        </div>
        <ul className="divide-y divide-hairline">
          {items.map((item) => (
            <li key={item.merchantKey} className="flex gap-4 px-5 py-4">
              <VendorMark
                name={item.displayName}
                vendorKey={item.merchantKey}
                size={36}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{item.displayName}</p>
                <p className="meta mt-1">{item.headline}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
                  {item.citations.map((c) => (
                    <a
                      key={c.url}
                      href={c.url}
                      className="inline-flex items-center gap-1 text-[#2E6D92] hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span aria-hidden>✦</span>
                      {c.title}
                    </a>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
