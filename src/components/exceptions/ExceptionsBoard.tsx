"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { VendorMark } from "@/components/VendorMark";
import { formatUsd } from "@/lib/ledger/analytics";
import type { Anomaly } from "@/lib/types";

type Filter = "all" | "awaiting_approval" | "high" | "other";

function statusLabel(a: Anomaly) {
  if (a.kind === "awaiting_approval") return "Awaiting approval";
  if (a.kind === "pending") return "Pending";
  if (a.kind === "failed") return "Failed";
  if (a.severity === "high") return "High";
  return a.kind.replaceAll("_", " ");
}

export function ExceptionsBoard({ anomalies }: { anomalies: Anomaly[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const awaiting = anomalies.filter((a) => a.kind === "awaiting_approval");
  const high = anomalies.filter((a) => a.severity === "high");
  const flaggedCents = anomalies.reduce((s, a) => s + Math.abs(a.amountCents), 0);

  const visible = useMemo(() => {
    if (filter === "awaiting_approval") return awaiting;
    if (filter === "high") return high;
    if (filter === "other")
      return anomalies.filter(
        (a) => a.kind !== "awaiting_approval" && a.severity !== "high",
      );
    return anomalies;
  }, [anomalies, filter, awaiting, high]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "awaiting_approval", label: "Awaiting approval" },
    { id: "high", label: "High" },
    { id: "other", label: "Other" },
  ];

  const activeLabel =
    filters.find((f) => f.id === filter)?.label ?? "All";

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
    <div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Needs attention" value={String(anomalies.length)} />
        <MetricTile
          label="Awaiting approval"
          value={String(awaiting.length)}
        />
        <MetricTile label="High severity" value={String(high.length)} />
        <MetricTile label="Flagged amount" value={formatUsd(flaggedCents)} />
      </div>

      <div className="relative mt-6" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-white px-3.5 py-2 text-[13px] font-medium text-ink shadow-[0_1px_2px_rgba(15,23,22,0.04)] transition hover:bg-canvas"
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
        >
          Filter: {activeLabel}
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

      <ul className="mt-4 space-y-2">
        {visible.length === 0 && (
          <li className="rounded-2xl bg-[#f3f4f4] px-5 py-10 text-center text-[14px] text-muted">
            No items in this filter.
          </li>
        )}
        {visible.map((a) => {
          const needsAction = a.kind === "awaiting_approval";
          return (
            <li
              key={a.id}
              className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-hairline bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,22,0.03)] md:grid-cols-[7rem_9.5rem_2.5rem_minmax(0,1fr)_auto]"
            >
              <span className="text-[15px] font-semibold tabular-nums text-ink">
                {formatUsd(a.amountCents)}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 md:flex-col md:items-start md:gap-1">
                <span className="rounded-md bg-[#f3f4f4] px-2.5 py-1 text-[11px] font-medium capitalize text-ink/80">
                  {statusLabel(a)}
                </span>
                {needsAction && (
                  <span className="rounded-md bg-mint-soft px-2 py-0.5 text-[10px] font-semibold text-ink">
                    Needs action
                  </span>
                )}
              </div>
              <VendorMark
                name={a.merchantKey ?? a.title}
                vendorKey={a.merchantKey}
                size={32}
              />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-ink">
                  {a.title}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-muted">
                  {a.detail}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">
                  {a.transactionIds.join(", ")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Link
                  href="/cash-pulse"
                  className="btn-secondary !min-h-9 px-3 text-[12px]"
                >
                  Open Cash
                </Link>
                <a
                  href="https://rho.co"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-dark !min-h-9 px-3 text-[12px]"
                >
                  Review in Rho
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-tile">
      <p className="metric-tile-label">{label}</p>
      <p className="metric-tile-value">{value}</p>
    </div>
  );
}
