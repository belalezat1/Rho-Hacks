import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { pushTrace } from "@/lib/session-store";
import { assertToolAccess } from "@/lib/api/tool-auth";

export async function GET(req: Request) {
  const denied = assertToolAccess(req);
  if (denied) return denied;

  const snap = await loadLedgerSnapshot();
  const top = snap.concentration[0]?.displayName ?? "n/a";
  const payload = {
    demoMode: snap.demoMode,
    concentration: snap.concentration,
    summary: `Top concentration: ${top} (${snap.concentration.length} merchants).`,
  };
  pushTrace("get_concentration", `Top merchant ${top}`, payload);
  return NextResponse.json(payload);
}
