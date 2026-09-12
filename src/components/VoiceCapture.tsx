"use client";

import { useState } from "react";

export function VoiceCapture() {
  const [text, setText] = useState(
    "Investor asked about SaaS concentration and designer spend - include in Monday brief.",
  );
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    const res = await fetch("/api/tools/voice_capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: text }),
    });
    const data = await res.json();
    setStatus(data.ok ? "Stored for generate_brief." : data.error);
  }

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold">Voice Capture</h3>
      <p className="meta mt-1">
        Paste a transcript now; wire ElevenLabs Scribe when the key is available.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="mt-3 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 outline-none focus:border-ink/30"
      />
      <button type="button" onClick={() => void save()} className="btn-dark mt-2 px-4 py-2 text-sm">
        Add to session
      </button>
      {status && <p className="meta mt-2">{status}</p>}
    </div>
  );
}
