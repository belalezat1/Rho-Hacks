import { AppShell } from "@/components/AppShell";
import { VendorMark } from "@/components/VendorMark";
import { SpendFilterTable } from "@/components/spend/SpendFilterTable";
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
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <h1 className="page-title">Spend</h1>
        <span className="chip">
          Comps: {source} · Risk: {riskSource}
        </span>
      </div>

      <SpendFilterTable rows={rows} />

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
