import { NextResponse } from "next/server";
import { buildExternalRisk } from "@/lib/tavily/spend-context";
import { pushTrace } from "@/lib/session-store";
import { isDemoMode } from "@/lib/rho/client";

export async function GET() {
  const { items, source } = await buildExternalRisk();
  const payload = {
    demoMode: isDemoMode(),
    source,
    items,
    disclaimer: "Informational headlines only — not advice.",
  };
  pushTrace("tavily_risk_brief", `${items.length} risk items via ${source}`, payload);
  return NextResponse.json(payload);
}
