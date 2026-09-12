import { NextResponse } from "next/server";
import { buildExternalRisk } from "@/lib/tavily/spend-context";
import { pushTrace } from "@/lib/session-store";
import { isDemoMode } from "@/lib/rho/client";
import { assertToolAccess } from "@/lib/api/tool-auth";

export async function GET(req: Request) {
  const denied = assertToolAccess(req);
  if (denied) return denied;

  const { items, source, errors } = await buildExternalRisk();
  const heads = items
    .slice(0, 3)
    .map((i) => `${i.displayName}: ${i.headline.slice(0, 80)}`)
    .join(" | ");
  const payload = {
    demoMode: isDemoMode(),
    source,
    items,
    errors: errors ?? [],
    disclaimer: "Informational headlines only - not advice.",
    summary: `${items.length} risk items via ${source}. ${heads}`,
  };
  pushTrace(
    "tavily_risk_brief",
    `${items.length} risk items via ${source}`,
    payload,
  );
  return NextResponse.json(payload);
}
