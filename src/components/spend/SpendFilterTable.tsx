"use client";

import { useMemo, useState } from "react";
import { VendorMark } from "@/components/VendorMark";
import { formatUsd } from "@/lib/ledger/analytics";
import type { SpendContextRow } from "@/lib/types";

type Filter = "vendor" | "account" | "department";

function bandClass(band: string) {
  if (band.includes("above") || band.includes("high")) return "danger";
  if (band.includes("below") || band.includes("low")) return "warn";
  return "";
}

function matchesFilter(row: SpendContextRow, filter: Filter) {
  if (filter === "vendor") return true;
  if (filter === "account") return row.kind === "saas";
  return row.kind === "contractor" || row.kind === "role";
}

export function SpendFilterTable({ rows }: { rows: SpendContextRow[] }) {
  const [filter, setFilter] = useState<Filter>("vendor");
  const visible = useMemo(
    () => rows.filter((r) => matchesFilter(r, filter)),
    [rows, filter],
  );

  const filters: { id: Filter; label: string }[] = [
    { id: "vendor", label: "All vendors" },
    { id: "account", label: "SaaS" },
    { id: "department", label: "Contractors & roles" },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                active
                  ? "bg-ink text-white"
                  : "bg-[#f3f4f4] text-ink hover:bg-[#ebecec]"
              }`}
              aria-pressed={active}
            >
              {f.label}
            </button>
          );
        })}
        <span className="text-[12px] text-muted">
          {visible.length} of {rows.length} rows
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-hairline px-5 py-3.5">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Competitive spend
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead className="border-b border-hairline text-[12px] text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">You pay (Rho)</th>
                <th className="px-4 py-3 font-medium">Cited public range</th>
                <th className="px-4 py-3 font-medium">Band</th>
                <th className="px-4 py-3 font-medium">Rho IDs</th>
                <th className="px-5 py-3 font-medium">Sources</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-muted"
                  >
                    No rows in this lens. Try All vendors.
                  </td>
                </tr>
              )}
              {visible.map((row) => {
                const cites = row.citations ?? [];
                const shown = cites.slice(0, 2);
                const extra = cites.length - shown.length;
                return (
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
                    <td className="px-4 py-3.5 font-semibold tabular-nums text-ink">
                      {formatUsd(row.rhoAmountMonthlyCents)}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-muted">
                      {row.citedRangeLowCents != null &&
                      row.citedRangeHighCents != null
                        ? `${formatUsd(row.citedRangeLowCents)} to ${formatUsd(row.citedRangeHighCents)}`
                        : " - "}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`band-pill capitalize ${bandClass(row.band)}`}
                      >
                        {row.band.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-muted">
                      {row.rhoTransactionIds.slice(0, 2).join(", ") || " - "}
                      {row.rhoTransactionIds.length > 2 ? "…" : ""}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-muted">
                      {shown.length === 0 && " - "}
                      {shown.map((c) => (
                        <a
                          key={c.url}
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mb-0.5 block truncate text-ink/80 underline-offset-2 hover:underline"
                          title={c.title}
                        >
                          {c.title}
                        </a>
                      ))}
                      {extra > 0 && (
                        <span className="text-[11px] text-muted-soft">
                          +{extra} more
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
