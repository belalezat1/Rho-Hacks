import { NextResponse } from "next/server";
import { listBriefs, pushTrace } from "@/lib/session-store";
import { publishBriefToStan } from "@/lib/stan/publish";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    confirmed?: boolean;
    briefId?: string;
  };
  if (!body.confirmed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Confirm required before publish. Set confirmed: true.",
      },
      { status: 400 },
    );
  }
  const briefs = listBriefs() as { id?: string; title?: string }[];
  const brief =
    (body.briefId ? briefs.find((b) => b.id === body.briefId) : briefs[0]) ??
    null;
  const payload = publishBriefToStan({
    briefId: brief?.id,
    title: brief?.title,
  });
  pushTrace("publish_to_stan", `Published guided link ${payload.stanUrl}`, payload);
  return NextResponse.json(payload);
}
