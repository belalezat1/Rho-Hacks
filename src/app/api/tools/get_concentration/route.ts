import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { pushTrace } from "@/lib/session-store";

export async function GET() {
  const snap = await loadLedgerSnapshot();
  const payload = {
    demoMode: snap.demoMode,
    concentration: snap.concentration,
  };
  pushTrace(
    "get_concentration",
    `Top merchant ${snap.concentration[0]?.displayName ?? "n/a"}`,
    payload,
  );
  return NextResponse.json(payload);
}
