"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => rows.filter((r) => matchesFilter(r, filter)),
    [rows, filter],
  );

  const filters: { id: Filter; label: string }[] = [
    { id: "vendor", label: "All vendors" },
    { id: "account", label: "SaaS" },
    { id: "department", label: "Contractors & roles" },
  ];

  const activeLabel =
    filters.find((f) => f.id === filter)?.label ?? "All vendors";

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointer(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-white px-3.5 py-2 text-[13px] font-medium text-ink shadow-[0_1px_2px_rgba(15,23,22,0.04)] transition hover:bg-canvas"
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
          >
            {activeLabel}
            <span
              className={`text-muted transition ${menuOpen ? "rotate-180" : ""}`}
              aria-hidden
            >
              ▾
            </span>
          </button>
          <div
            className={`absolute left-0 z-20 mt-1.5 w-56 origin-top overflow-hidden rounded-lg border border-hairline bg-white shadow-[0_8px_24px_rgba(15,23,22,0.08)] transition ${
              menuOpen
                ? "pointer-events-auto scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
            role="listbox"
            aria-hidden={!menuOpen}
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="option"
                aria-selected={filter === f.id}
                onClick={() => {
                  setFilter(f.id);
                  setMenuOpen(false);
                }}
                className={`block w-full px-3.5 py-2.5 text-left text-[13px] transition hover:bg-canvas ${
                  filter === f.id ? "font-medium text-ink" : "text-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
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
          <table className="w-full min-w-[960px] table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[12%]" />
              <col className="w-[22%]" />
              <col className="w-[10%]" />
              <col className="w-[14%]" />
              <col className="w-[20%]" />
            </colgroup>
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
                const shown = cites.slice(0, 1);
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
                    <td className="px-4 py-3.5 whitespace-nowrap tabular-nums text-muted">
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
                          className="block truncate text-ink/80 underline-offset-2 hover:underline"
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
