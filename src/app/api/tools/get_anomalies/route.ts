import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { pushTrace } from "@/lib/session-store";
import { assertToolAccess } from "@/lib/api/tool-auth";

export async function GET(req: Request) {
  const denied = assertToolAccess(req);
  if (denied) return denied;

  const snap = await loadLedgerSnapshot();
  const top = snap.anomalies
    .slice(0, 3)
    .map((a) => `${a.severity}:${a.title}`)
    .join("; ");
  const payload = {
    demoMode: snap.demoMode,
    anomalies: snap.anomalies,
    note: "Radar flags only - not compliance clearance or a verdict.",
    summary: `${snap.anomalies.length} anomalies. ${top || "None"}`,
  };
  pushTrace("get_anomalies", `${snap.anomalies.length} anomalies`, payload);
  return NextResponse.json(payload);
}
