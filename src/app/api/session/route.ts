import { NextResponse } from "next/server";
import { listBriefs, listTraces, getVoiceNote } from "@/lib/session-store";

export async function GET() {
  return NextResponse.json({
    traces: listTraces(),
    briefs: listBriefs(),
    voiceNote: getVoiceNote() ?? null,
  });
}
