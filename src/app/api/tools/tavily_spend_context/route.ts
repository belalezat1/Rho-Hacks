import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import {
  buildSpendContext,
  formatCitationDigest,
} from "@/lib/tavily/spend-context";
import { pushTrace } from "@/lib/session-store";
import { assertToolAccess } from "@/lib/api/tool-auth";

export async function GET(req: Request) {
  const denied = assertToolAccess(req);
  if (denied) return denied;

  const snap = await loadLedgerSnapshot();
  const { rows, source, errors, citationCount } = await buildSpendContext(
    snap.recurrings,
  );
  const digest = formatCitationDigest(rows);
  const payload = {
    demoMode: snap.demoMode,
    source,
    citationCount: citationCount ?? 0,
    errors: errors ?? [],
    disclaimer:
      "Public-web market context for decision support. Not a quote, offer, or employment advice. Pilot does not prescribe hire/cut/renew.",
    rows,
    /** Agent-friendly short summary */
    summary: `${rows.length} comps via ${source}; ${citationCount ?? 0} live cites. ${digest}`,
  };
  pushTrace(
    "tavily_spend_context",
    `${rows.length} comps via ${source} (${citationCount ?? 0} cites)`,
    payload,
  );
  return NextResponse.json(payload);
}
