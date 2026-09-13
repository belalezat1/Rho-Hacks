import { formatUsd } from "@/lib/ledger/analytics";

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
