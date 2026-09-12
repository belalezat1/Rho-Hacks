import { formatUsd } from "@/lib/ledger/analytics";
import type { Anomaly, RhoTransaction } from "@/lib/types";

export type AttentionBucket = {
  id: string;
  label: string;
  tone: "info" | "warn" | "ok" | "neutral";
  amountCents: number;
  count: number;
  countLabel: string;
};

export function buildAttentionBuckets(
  anomalies: Anomaly[],
  transactions: RhoTransaction[],
): AttentionBucket[] {
  const high = anomalies.filter((a) => a.severity === "high");
  const medium = anomalies.filter((a) => a.severity === "medium");
  const pending = transactions.filter(
    (t) => t.status === "pending" || t.status === "awaiting_approval",
  );
  const posted = transactions.filter((t) => t.status === "posted");

  const sum = (xs: { amountCents: number }[]) =>
    xs.reduce((a, x) => a + Math.abs(x.amountCents), 0);

  return [
    {
      id: "attention",
      label: "Needs attention",
      tone: "info",
      amountCents: sum(high.length ? high : medium),
      count: high.length || medium.length,
      countLabel: "exceptions",
    },
    {
      id: "overdue",
      label: "Overdue",
      tone: "warn",
      amountCents: sum(high),
      count: high.length,
      countLabel: "flags",
    },
    {
      id: "posted",
      label: "Posted",
      tone: "ok",
      amountCents: sum(posted.slice(0, 40)),
      count: posted.length,
      countLabel: "movements",
    },
    {
      id: "pending",
      label: "Unpaid / pending",
      tone: "neutral",
      amountCents: sum(pending),
      count: pending.length,
      countLabel: "items",
    },
  ];
}

/** Deterministic demo revenue series for chart (cents). */
export function demoRevenueSeries(cashTotalCents: number): number[] {
  const base = Math.max(20_000_00, Math.round(cashTotalCents * 0.04));
  const months = [0.55, 0.62, 0.58, 0.7, 0.75, 0.8, 0.78, 0.88, 0.92, 0.95, 1.0, 1.05];
  return months.map((m, i) => Math.round(base * m * (1 + (i % 3) * 0.02)));
}

export type ReceivableSlice = {
  id: string;
  label: string;
  color: string;
  amountCents: number;
  count: number;
};

export function demoReceivables(
  pendingCents: number,
  anomalyHighCents: number,
): ReceivableSlice[] {
  const overdue = Math.round(anomalyHighCents * 0.6) || 250_000;
  const d7 = Math.round(pendingCents * 0.35) || 180_000;
  const d30 = Math.round(pendingCents * 0.4) || 420_000;
  const rest = Math.max(100_000, Math.round(pendingCents * 0.25) || 295_000);
  return [
    { id: "overdue", label: "Overdue", color: "#E8923A", amountCents: overdue, count: 2 },
    { id: "d7", label: "Due in next 7 days", color: "#3D5A5A", amountCents: d7, count: 3 },
    { id: "d30", label: "Due in next 30 days", color: "#6BC4B8", amountCents: d30, count: 4 },
    { id: "rest", label: "> 30 days", color: "#D5D8D7", amountCents: rest, count: 2 },
  ];
}

export { formatUsd };
