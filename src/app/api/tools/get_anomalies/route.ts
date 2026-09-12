import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { pushTrace } from "@/lib/session-store";

export async function GET() {
  const snap = await loadLedgerSnapshot();
  const payload = {
    demoMode: snap.demoMode,
    anomalies: snap.anomalies,
    note: "Radar flags only - not compliance clearance or a verdict.",
  };
  pushTrace("get_anomalies", `${snap.anomalies.length} anomalies`, payload);
  return NextResponse.json(payload);
}
