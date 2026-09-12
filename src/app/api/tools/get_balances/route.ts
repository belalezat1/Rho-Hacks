import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { formatUsd } from "@/lib/ledger/analytics";
import { pushTrace } from "@/lib/session-store";
import { assertToolAccess } from "@/lib/api/tool-auth";

export async function GET(req: Request) {
  const denied = assertToolAccess(req);
  if (denied) return denied;

  const snap = await loadLedgerSnapshot();
  const payload = {
    demoMode: snap.demoMode,
    cashPosition: snap.cash,
    burnRunway: snap.burn,
    formatted: {
      total: formatUsd(snap.cash.totalCents),
      burn30: formatUsd(snap.burn.burn30Cents),
      runwayDays: snap.burn.runwayDays,
    },
    accounts: snap.accounts,
    summary: `Cash ${formatUsd(snap.cash.totalCents)}; 30d burn ${formatUsd(snap.burn.burn30Cents)}; runway ${snap.burn.runwayDays ?? "n/a"} days. Demo=${snap.demoMode}.`,
  };
  pushTrace("get_balances", `Cash position ${payload.formatted.total}`, payload);
  return NextResponse.json(payload);
}
