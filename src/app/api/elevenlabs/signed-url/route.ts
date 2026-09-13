import { NextResponse } from "next/server";

/**
 * Signed conversation URL for private ElevenLabs Agents.
 * Used by ElevenLabsConvaiEmbed when available; public agents can use agentId alone.
 */
export async function GET() {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  const agentId =
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() ||
    process.env.ELEVENLABS_AGENT_ID?.trim();

  if (!key) {
    return NextResponse.json(
      { ok: false, error: "ELEVENLABS_API_KEY missing" },
      { status: 503 },
    );
  }
  if (!agentId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "NEXT_PUBLIC_ELEVENLABS_AGENT_ID (or ELEVENLABS_AGENT_ID) missing",
      },
      { status: 503 },
    );
  }

  try {
    const url = new URL(
      "https://api.elevenlabs.io/v1/convai/conversation/get_signed_url",
    );
    url.searchParams.set("agent_id", agentId);
    const res = await fetch(url, {
      headers: { "xi-api-key": key },
      cache: "no-store",
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error: `signed-url ${res.status}`,
          detail: detail.slice(0, 300),
        },
        { status: 502 },
      );
    }
    const data = (await res.json()) as { signed_url?: string };
    if (!data.signed_url) {
      return NextResponse.json(
        { ok: false, error: "No signed_url in response" },
        { status: 502 },
      );
    }
    return NextResponse.json({
      ok: true,
      signedUrl: data.signed_url,
      agentId,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "signed-url failed",
      },
      { status: 502 },
    );
  }
}
