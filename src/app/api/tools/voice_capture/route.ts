import { NextResponse } from "next/server";
import { pushTrace, setVoiceNote } from "@/lib/session-store";
import { assertToolAccess } from "@/lib/api/tool-auth";
import { transcribeWithScribe } from "@/lib/elevenlabs/scribe";

export async function POST(req: Request) {
  const denied = assertToolAccess(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as {
    transcript?: string;
    text?: string;
    audioBase64?: string;
    mimeType?: string;
  };

  let text = (body.transcript || body.text || "").trim();
  let scribeError: string | undefined;

  if (!text && body.audioBase64) {
    const stt = await transcribeWithScribe({
      audioBase64: body.audioBase64,
      mimeType: body.mimeType,
    });
    if (stt.transcript) text = stt.transcript;
    else scribeError = stt.error;
  }

  if (!text) {
    return NextResponse.json(
      {
        ok: false,
        error: scribeError || "Empty transcript (provide transcript or audioBase64)",
      },
      { status: 400 },
    );
  }

  setVoiceNote(text);
  pushTrace("voice_capture", `Captured ${text.length} chars`, {
    preview: text.slice(0, 160),
    viaScribe: Boolean(body.audioBase64),
  });
  return NextResponse.json({
    ok: true,
    message: body.audioBase64
      ? "Voice note transcribed via ElevenLabs Scribe and stored for generate_brief."
      : "Voice note stored for generate_brief.",
    transcript: text,
    viaScribe: Boolean(body.audioBase64),
    summary: `Stored ${text.length}-char voice note.`,
  });
}
