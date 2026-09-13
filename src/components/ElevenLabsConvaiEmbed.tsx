"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPT_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";
const SCRIPT_ID = "elevenlabs-convai-embed";

type Props = {
  agentId: string;
  className?: string;
};

/**
 * Official ConvAI embed. The /app/talk-to iframe is blocked by X-Frame-Options
 * ("refused to connect"). Public agents use agent-id; private agents need signed-url.
 */
export function ElevenLabsConvaiEmbed({ agentId, className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () =>
      setHint("Could not load the ElevenLabs widget script (check network).");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptReady || !hostRef.current) return;
    const host = hostRef.current;
    host.innerHTML = "";

    const el = document.createElement("elevenlabs-convai");
    el.setAttribute("agent-id", agentId);
    el.setAttribute("variant", "expanded");

    let cancelled = false;
    async function attach() {
      try {
        const res = await fetch("/api/elevenlabs/signed-url");
        const data = (await res.json()) as {
          ok?: boolean;
          signedUrl?: string;
          error?: string;
        };
        if (cancelled) return;
        if (data.ok && data.signedUrl) {
          el.setAttribute("signed-url", data.signedUrl);
        } else if (data.error) {
          setHint(
            `Using public agent-id (${data.error}). If voice fails, disable Agent auth in ElevenLabs Advanced settings.`,
          );
        }
      } catch {
        if (!cancelled) {
          setHint(
            "Signed URL unavailable — using public agent-id. Disable Agent auth if the widget will not start.",
          );
        }
      }
      if (!cancelled) host.appendChild(el);
    }
    void attach();

    return () => {
      cancelled = true;
      host.innerHTML = "";
    };
  }, [scriptReady, agentId]);

  return (
    <div
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#f3f4f4] ${className}`}
    >
      <div
        ref={hostRef}
        className="flex min-h-0 flex-1 items-center justify-center p-4"
      />
      {!scriptReady && (
        <p className="absolute inset-0 flex items-center justify-center text-[14px] text-muted">
          Loading voice…
        </p>
      )}
      <p className="shrink-0 border-t border-hairline bg-surface px-4 py-2.5 text-center text-[12px] text-muted">
        Allow the microphone when prompted. In ElevenLabs → Agent → Advanced,
        turn <span className="font-medium text-ink">authentication off</span>{" "}
        (public) for the widget to connect.
        {hint ? ` ${hint}` : ""}
      </p>
    </div>
  );
}
