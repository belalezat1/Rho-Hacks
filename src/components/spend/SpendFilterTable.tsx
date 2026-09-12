"use client";

import { useMemo, useState } from "react";
import { SparkleIcon, VendorMark } from "@/components/VendorMark";
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
    { id: "account", label: "Account" },
    { id: "department", label: "Department" },
    { id: "vendor", label: "Vendor" },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium shadow-[0_1px_2px_rgba(15,23,22,0.04)] transition ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-hairline bg-white text-[#2E6D92] hover:bg-canvas"
              }`}
              aria-pressed={active}
            >
              <SparkleIcon
                className={`h-3.5 w-3.5 ${active ? "text-mint" : ""}`}
              />
              {f.label}
            </button>
          );
        })}
        <span className="self-center text-[12px] text-muted">
          {filter === "vendor" && "All competitive spend rows"}
          {filter === "account" && "SaaS / tooling (account-level)"}
          {filter === "department" && "People / contractor spend"}
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-hairline px-5 py-3.5">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Competitive spend
            <span className="ml-2 text-[12px] font-normal text-muted">
              {visible.length} of {rows.length}
            </span>
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
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-muted"
                  >
                    No rows in this lens. Try Vendor.
                  </td>
                </tr>
              )}
              {visible.map((row) => (
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
    </>
  );
}
