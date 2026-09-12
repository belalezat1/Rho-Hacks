/**
 * ElevenLabs Speech-to-Text (Scribe) — optional path for voice_capture.
 */
export async function transcribeWithScribe(input: {
  audioBase64: string;
  mimeType?: string;
}): Promise<{ transcript?: string; error?: string }> {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) return { error: "ELEVENLABS_API_KEY missing" };

  try {
    const bin = Buffer.from(input.audioBase64, "base64");
    const mime = input.mimeType || "audio/mpeg";
    const form = new FormData();
    form.append(
      "file",
      new Blob([bin], { type: mime }),
      mime.includes("wav") ? "note.wav" : "note.mp3",
    );
    form.append("model_id", "scribe_v1");

    const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": key },
      body: form,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        error: `Scribe ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`,
      };
    }
    const data = (await res.json()) as { text?: string; transcript?: string };
    const transcript = (data.text || data.transcript || "").trim();
    if (!transcript) return { error: "Empty Scribe transcript" };
    return { transcript };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Scribe failed" };
  }
}
