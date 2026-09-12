"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

function badgeClass(a: Anomaly) {
  if (a.kind === "awaiting_approval") return "bg-[#E8F1F8] text-[#2E6D92]";
  if (a.kind === "failed" || a.severity === "high")
    return "bg-[#FDE8EA] text-[#C91829]";
  if (a.kind === "pending") return "bg-[#FEF3E2] text-[#9A5B12]";
  return "bg-canvas text-muted";
}

export function ExceptionsBoard({ anomalies }: { anomalies: Anomaly[] }) {
  const [filter, setFilter] = useState<Filter>("all");

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

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-lg px-3.5 py-2 text-[13px] font-medium transition ${
              filter === f.id
                ? "bg-ink text-white"
                : "bg-[#f3f4f4] text-ink hover:bg-[#ebecec]"
            }`}
            aria-pressed={filter === f.id}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {visible.length === 0 && (
          <li className="rounded-2xl bg-[#f3f4f4] px-5 py-10 text-center text-[14px] text-muted">
            No items in this filter.
          </li>
        )}
        {visible.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-hairline bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,22,0.03)]"
          >
            <span className="min-w-[88px] text-[15px] font-semibold tabular-nums text-ink">
              {formatUsd(a.amountCents)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${badgeClass(a)}`}
            >
              {statusLabel(a)}
            </span>
            <VendorMark
              name={a.merchantKey ?? a.title}
              vendorKey={a.merchantKey}
              size={32}
            />
            <div className="min-w-0 flex-1">
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
            <div className="flex flex-wrap gap-2">
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
        ))}
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
