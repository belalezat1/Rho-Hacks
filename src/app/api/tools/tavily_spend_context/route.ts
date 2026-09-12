import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { buildSpendContext } from "@/lib/tavily/spend-context";
import { pushTrace } from "@/lib/session-store";

export async function GET() {
  const snap = await loadLedgerSnapshot();
  const { rows, source } = await buildSpendContext(snap.recurrings);
  const payload = {
    demoMode: snap.demoMode,
    source,
    disclaimer:
      "Public-web market context for decision support. Not a quote, offer, or employment advice. Pilot does not prescribe hire/cut/renew.",
    rows,
  };
  pushTrace(
    "tavily_spend_context",
    `${rows.length} comps via ${source}`,
    payload,
  );
  return NextResponse.json(payload);
}
