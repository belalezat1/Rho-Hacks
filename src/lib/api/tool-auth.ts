import { NextResponse } from "next/server";

/**
 * Optional shared secret for Agent server-tool webhooks.
 * When TOOL_WEBHOOK_SECRET is unset, tools stay open (local demo).
 * When set, require header `x-tool-secret: <secret>` or `Authorization: Bearer <secret>`.
 */
export function assertToolAccess(req: Request): NextResponse | null {
  const secret = process.env.TOOL_WEBHOOK_SECRET?.trim();
  if (!secret) return null;

  const header = req.headers.get("x-tool-secret");
  const auth = req.headers.get("authorization");
  const bearer =
    auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : null;

  if (header === secret || bearer === secret) return null;

  return NextResponse.json(
    { ok: false, error: "Unauthorized tool call" },
    { status: 401 },
  );
}
