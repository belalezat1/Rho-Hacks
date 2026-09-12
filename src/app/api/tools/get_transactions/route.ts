import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { resolveMerchant } from "@/lib/ledger/analytics";
import { pushTrace } from "@/lib/session-store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "25");
  const snap = await loadLedgerSnapshot();
  const txs = snap.transactions.slice(0, limit).map((t) => {
    const m = resolveMerchant(t);
    return {
      ...t,
      normalizedMerchant: m
        ? { key: m.key, displayName: m.displayName, raw: t.rawDescriptor }
        : { key: null, displayName: t.rawDescriptor, raw: t.rawDescriptor },
    };
  });
  const payload = { demoMode: snap.demoMode, transactions: txs };
  pushTrace("get_transactions", `${txs.length} transactions`, payload);
  return NextResponse.json(payload);
}
