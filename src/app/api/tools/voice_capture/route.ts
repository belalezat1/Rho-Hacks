import { NextResponse } from "next/server";
import { pushTrace, setVoiceNote } from "@/lib/session-store";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    transcript?: string;
    text?: string;
  };
  const text = (body.transcript || body.text || "").trim();
  if (!text) {
    return NextResponse.json({ ok: false, error: "Empty transcript" }, { status: 400 });
  }
  // Thin-slice Scribe: accept transcript text (from client MediaRecorder + Whisper/Scribe later).
  setVoiceNote(text);
  pushTrace("voice_capture", `Captured ${text.length} chars`, { preview: text.slice(0, 160) });
  return NextResponse.json({
    ok: true,
    message: "Voice note stored for generate_brief. Wire ElevenLabs Scribe for live STT when key is available.",
    transcript: text,
  });
}
