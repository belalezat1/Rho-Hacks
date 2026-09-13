"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConversationProvider,
  useConversationControls,
  useConversationMode,
  useConversationStatus,
} from "@elevenlabs/react";
import { PilotOrb } from "@/components/PilotOrb";
import { BriefText } from "@/components/BriefText";
import {
  loadPilotWorkspaceContext,
  pilotClientTools,
} from "@/lib/elevenlabs/client-tools";

type Props = {
  agentId: string;
  className?: string;
};

type Line = { role: "user" | "agent"; text: string };

/**
 * In-panel ElevenLabs voice with orb + Rho/Tavily client tools + startup context.
 */
export function ElevenLabsConvaiEmbed({ agentId, className = "" }: Props) {
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onMessage = useCallback(
    (msg: { message?: string; source?: string; role?: string }) => {
      const text = (msg.message ?? "").trim();
      if (!text) return;
      const role: Line["role"] =
        msg.source === "user" || msg.role === "user" ? "user" : "agent";
      setLines((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === role && last.text === text) return prev;
        return [...prev, { role, text }].slice(-40);
      });
    },
    [],
  );

  return (
    <ConversationProvider
      clientTools={pilotClientTools}
      onError={(err: unknown) => {
        const msg =
          typeof err === "string"
            ? err
            : err && typeof err === "object" && "message" in err
              ? String((err as { message: unknown }).message)
              : "Voice error";
        setError(msg);
      }}
      onMessage={onMessage}
    >
      <VoicePanel
        agentId={agentId}
        className={className}
        lines={lines}
        setLines={setLines}
        error={error}
        clearError={() => setError(null)}
      />
    </ConversationProvider>
  );
}

function VoicePanel({
  agentId,
  className,
  lines,
  setLines,
  error,
  clearError,
}: {
  agentId: string;
  className: string;
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
  error: string | null;
  clearError: () => void;
}) {
  const { startSession, endSession, sendUserMessage, sendContextualUpdate } =
    useConversationControls();
  const { status, message } = useConversationStatus();
  const { mode, isSpeaking, isListening } = useConversationMode();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [starting, setStarting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [contextReady, setContextReady] = useState(false);

  const connected = status === "connected";
  const connecting = starting || status === "connecting";

  useEffect(() => {
    if (connected || status === "error" || status === "disconnected") {
      setStarting(false);
    }
  }, [connected, status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines, isSpeaking, isListening]);

  useEffect(() => {
    return () => {
      try {
        endSession();
      } catch {
        /* ignore */
      }
    };
    // Intentionally empty deps: only end on real unmount, not endSession identity churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!connected || contextReady) return;
    let cancelled = false;
    async function pushContext() {
      try {
        const ctx = await loadPilotWorkspaceContext();
        if (cancelled) return;
        sendContextualUpdate(ctx);
        setContextReady(true);
        setLines((prev) =>
          prev.length
            ? prev
            : [
                {
                  role: "agent",
                  text: "Workspace loaded. Northstar demo ledger is available. Ask about cash, anomalies, spend vs market, or a Monday brief.",
                },
              ],
        );
      } catch {
        if (!cancelled) {
          try {
            sendContextualUpdate(
              "WORKSPACE CONTEXT: Northstar demo ledger on Rho is available via get_balances / get_anomalies / tavily_spend_context tools. Decision support only.",
            );
            setContextReady(true);
          } catch {
            setLocalError(
              "Voice is live; workspace snapshot delayed. Ask for cash - tools still work.",
            );
          }
        }
      }
    }
    void pushContext();
    return () => {
      cancelled = true;
    };
  }, [connected, contextReady, sendContextualUpdate, setLines]);

  async function connect() {
    clearError();
    setLocalError(null);
    setContextReady(false);
    setStarting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      void loadPilotWorkspaceContext().catch(() => {});

      let signedUrl: string | undefined;
      let signedError: string | undefined;
      try {
        const res = await fetch("/api/elevenlabs/signed-url");
        const data = (await res.json()) as {
          ok?: boolean;
          signedUrl?: string;
          error?: string;
        };
        if (data.ok && data.signedUrl) {
          signedUrl = data.signedUrl;
        } else if (data.error) {
          signedError = data.error;
        }
      } catch {
        /* public agentId path still available */
      }

      try {
        if (signedUrl) {
          await Promise.resolve(startSession({ signedUrl }));
        } else {
          await Promise.resolve(startSession({ agentId }));
        }
      } catch (startErr) {
        const msg =
          startErr instanceof Error
            ? startErr.message
            : "Could not start ElevenLabs session";
        setLocalError(
          signedError
            ? `${msg}. Signed URL: ${signedError}`
            : msg,
        );
        setStarting(false);
      }
    } catch (e) {
      setLocalError(
        e instanceof Error
          ? e.name === "NotAllowedError"
            ? "Microphone permission denied. Allow mic access, or use Chat."
            : e.message
          : "Could not start voice",
      );
      setStarting(false);
    }
  }

  const statusLabel = connecting
    ? "Connecting"
    : !connected
      ? "Ready"
      : isSpeaking
        ? "Speaking"
        : isListening
          ? "Listening"
          : mode || "Connected";

  const orbHint = connecting
    ? "Starting session…"
    : connected
      ? isSpeaking
        ? "Pilot is speaking"
        : "Your turn - speak naturally"
      : "Start when ready";

  const banner = localError || error || (!connected && message ? message : null);

  return (
    <div
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-hairline bg-[#f3f4f4] ${className}`}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline bg-surface px-4 py-2.5">
        <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-white to-[#f3f4f4]">
          <PilotOrb
            active={connected}
            speaking={isSpeaking}
            listening={isListening && !isSpeaking}
            size={connected ? 72 : 56}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold tracking-tight text-ink">
            {statusLabel}
          </p>
          <p className="text-[12px] text-muted">{orbHint}</p>
          <p className="mt-0.5 text-[11px] text-muted-soft">
            {contextReady
              ? "Rho workspace context loaded"
              : connected
                ? "Loading workspace…"
                : "ElevenLabs · in-panel"}
          </p>
        </div>
        {connected ? (
          <button
            type="button"
            onClick={() => {
              endSession();
              setContextReady(false);
            }}
            className="btn-secondary px-4 py-2 text-[13px]"
          >
            End
          </button>
        ) : (
          <button
            type="button"
            disabled={connecting}
            onClick={() => void connect()}
            className="btn-primary px-5 py-2.5 text-[14px] disabled:opacity-50"
          >
            {connecting ? "Connecting…" : "Start voice"}
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4"
      >
        {lines.length === 0 && (
          <p className="rounded-xl bg-surface px-4 py-3 text-[14px] leading-relaxed text-muted">
            {connected
              ? "Speak when Listening - cash, anomalies, spend vs market, or draft a brief."
              : "Start voice to load the Northstar demo ledger into the session for judges."}
          </p>
        )}
        {lines.map((line, i) => (
          <div
            key={`${line.role}-${i}-${line.text.slice(0, 12)}`}
            className={`flex ${line.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                line.role === "user"
                  ? "rounded-br-md bg-mint-soft text-ink"
                  : "rounded-bl-md border border-hairline bg-surface text-ink/90"
              }`}
            >
              {line.role === "agent" ? (
                <BriefText text={line.text} />
              ) : (
                line.text
              )}
            </div>
          </div>
        ))}
      </div>

      {banner && (
        <p className="shrink-0 border-t border-hairline bg-[#fef3e2] px-4 py-2.5 text-[12px] leading-snug text-ink/85">
          {banner}
          {!connected && !localError?.includes("Microphone") && (
            <span className="mt-1 block text-muted">
              Needs mic permission,{" "}
              <code className="rounded bg-canvas px-1 text-[11px]">
                ELEVENLABS_API_KEY
              </code>
              , and a public agent (auth off) or a working signed URL. Restart
              the dev server after changing env.
            </span>
          )}
        </p>
      )}

      {connected && (
        <div className="shrink-0 border-t border-hairline bg-surface px-4 py-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements.namedItem(
                "voiceText",
              ) as HTMLInputElement;
              const text = input.value.trim();
              if (!text) return;
              sendUserMessage(text);
              setLines((prev) =>
                [...prev, { role: "user" as const, text }].slice(-40),
              );
              input.value = "";
            }}
          >
            <input
              name="voiceText"
              className="flex-1 rounded-full border border-hairline bg-canvas px-4 py-2.5 text-[14px] outline-none focus:border-ink/25"
              placeholder="Type if mic fails…"
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn-icon-mint"
              aria-label="Send text"
            >
              →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
