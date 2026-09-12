import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { formatUsd } from "@/lib/ledger/analytics";
import { pushTrace } from "@/lib/session-store";

export async function GET() {
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
  };
  pushTrace("get_balances", `Cash position ${payload.formatted.total}`, payload);
  return NextResponse.json(payload);
}
