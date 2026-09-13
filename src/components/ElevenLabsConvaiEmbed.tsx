"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConversationProvider,
  useConversationControls,
  useConversationMode,
  useConversationStatus,
} from "@elevenlabs/react";
import { PilotOrb } from "@/components/PilotOrb";
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
      onDisconnect={() => {
        // #region agent log
        fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "cb3dba",
          },
          body: JSON.stringify({
            sessionId: "cb3dba",
            runId: "post-fix",
            hypothesisId: "A",
            location: "ElevenLabsConvaiEmbed.tsx:onDisconnect",
            message: "provider onDisconnect fired",
            data: {},
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
      }}
      onError={(err) => {
        const msg =
          typeof err === "string"
            ? err
            : err && typeof err === "object" && "message" in err
              ? String((err as { message: unknown }).message)
              : "Voice error";
        // #region agent log
        fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "cb3dba",
          },
          body: JSON.stringify({
            sessionId: "cb3dba",
            hypothesisId: "A",
            location: "ElevenLabsConvaiEmbed.tsx:onError",
            message: "ConversationProvider onError",
            data: { msg: String(msg).slice(0, 300) },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
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

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cb3dba",
      },
      body: JSON.stringify({
        sessionId: "cb3dba",
        hypothesisId: "D",
        location: "ElevenLabsConvaiEmbed.tsx:status",
        message: "voice status changed",
        data: {
          status,
          message: message?.slice?.(0, 160) ?? message,
          starting,
          isSpeaking,
          isListening,
          contextReady,
          hasAgentId: Boolean(agentId),
          toolKeys: Object.keys(pilotClientTools),
          runId: "post-fix",
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [
    status,
    message,
    starting,
    isSpeaking,
    isListening,
    contextReady,
    agentId,
  ]);
  // #endregion

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines, isSpeaking, isListening]);

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cb3dba",
      },
      body: JSON.stringify({
        sessionId: "cb3dba",
        runId: "post-fix",
        hypothesisId: "C",
        location: "ElevenLabsConvaiEmbed.tsx:endSessionEffect",
        message: "endSession cleanup effect mounted (unmount-only)",
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return () => {
      // #region agent log
      fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "cb3dba",
        },
        body: JSON.stringify({
          sessionId: "cb3dba",
          runId: "post-fix",
          hypothesisId: "C",
          location: "ElevenLabsConvaiEmbed.tsx:endSessionCleanup",
          message: "endSession cleanup RUNNING — may kill session",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
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
        // #region agent log
        fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "cb3dba",
          },
          body: JSON.stringify({
            sessionId: "cb3dba",
            runId: "post-fix-2",
            hypothesisId: "E",
            location: "ElevenLabsConvaiEmbed.tsx:pushContext",
            message: "sending contextual update",
            data: { ctxLen: ctx.length, isFallback: ctx.includes("about $2.4M") },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        sendContextualUpdate(ctx);
        setContextReady(true);
        setLines((prev) =>
          prev.length
            ? prev
            : [
                {
                  role: "agent",
                  text: "Workspace loaded — Northstar demo ledger is available. Ask about cash, anomalies, spend vs market, or a Monday brief.",
                },
              ],
        );
      } catch (err) {
        // #region agent log
        fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "cb3dba",
          },
          body: JSON.stringify({
            sessionId: "cb3dba",
            runId: "post-fix-2",
            hypothesisId: "E",
            location: "ElevenLabsConvaiEmbed.tsx:pushContextError",
            message: "contextual update failed",
            data: {
              err: err instanceof Error ? err.message : String(err),
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        if (!cancelled) {
          try {
            sendContextualUpdate(
              "WORKSPACE CONTEXT: Northstar demo ledger on Rho is available via get_balances / get_anomalies / tavily_spend_context tools. Decision support only.",
            );
            setContextReady(true);
          } catch {
            setLocalError(
              "Voice is live; workspace snapshot delayed. Ask for cash — tools still work.",
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
    // #region agent log
    fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "cb3dba",
      },
      body: JSON.stringify({
        sessionId: "cb3dba",
        runId: "post-fix",
        hypothesisId: "A",
        location: "ElevenLabsConvaiEmbed.tsx:connect",
        message: "Start voice clicked",
        data: { agentIdPrefix: agentId?.slice(0, 12), status },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    clearError();
    setLocalError(null);
    setContextReady(false);
    setStarting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Prefetch in background; never block or throw into connect
      void loadPilotWorkspaceContext().catch(() => {});

      // Prefer public agentId. Signed URL + overrides caused instant disconnect
      // after connected (debug session cb3dba). Keep signed URL as fallback only.
      let startMode: "agentId" | "signedUrl" = "agentId";
      let signedUrl: string | undefined;
      try {
        const res = await fetch("/api/elevenlabs/signed-url");
        const data = (await res.json()) as {
          ok?: boolean;
          signedUrl?: string;
          error?: string;
        };
        // #region agent log
        fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "cb3dba",
          },
          body: JSON.stringify({
            sessionId: "cb3dba",
            runId: "post-fix",
            hypothesisId: "A",
            location: "ElevenLabsConvaiEmbed.tsx:signedUrl",
            message: "signed-url available but preferring agentId",
            data: {
              signedAvailable: Boolean(data.ok && data.signedUrl),
              error: data.error ?? null,
              using: "agentId",
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        if (!agentId && data.ok && data.signedUrl) {
          signedUrl = data.signedUrl;
          startMode = "signedUrl";
        }
      } catch {
        /* ignore */
      }

      // #region agent log
      fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "cb3dba",
        },
        body: JSON.stringify({
          sessionId: "cb3dba",
          runId: "post-fix",
          hypothesisId: "A",
          location: "ElevenLabsConvaiEmbed.tsx:beforeStartSession",
          message: "calling startSession without overrides",
          data: {
            mode: startMode,
            hasOverrides: false,
            hasClientTools: true,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      if (startMode === "signedUrl" && signedUrl) {
        startSession({ signedUrl });
      } else {
        startSession({ agentId });
      }

      // #region agent log
      fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "cb3dba",
        },
        body: JSON.stringify({
          sessionId: "cb3dba",
          runId: "post-fix",
          hypothesisId: "A",
          location: "ElevenLabsConvaiEmbed.tsx:afterStartSession",
          message: "startSession returned (void API)",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    } catch (e) {
      // #region agent log
      fetch("http://127.0.0.1:7435/ingest/337cbcb5-4535-4001-b783-55a87b5e182d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "cb3dba",
        },
        body: JSON.stringify({
          sessionId: "cb3dba",
          runId: "post-fix",
          hypothesisId: "A",
          location: "ElevenLabsConvaiEmbed.tsx:connectCatch",
          message: "connect threw",
          data: { err: e instanceof Error ? e.message : String(e) },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setLocalError(e instanceof Error ? e.message : "Could not start voice");
    } finally {
      setStarting(false);
    }
  }

  const statusLabel = !connected
    ? "Ready"
    : isSpeaking
      ? "Speaking"
      : isListening
        ? "Listening"
        : mode || "Connected";

  return (
    <div
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-hairline bg-[#f3f4f4] ${className}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-hairline bg-surface px-5 py-3.5">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-ink">
            {statusLabel}
          </p>
          <p className="text-[12px] text-muted">
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
            disabled={starting || status === "connecting"}
            onClick={() => void connect()}
            className="btn-primary px-5 py-2.5 text-[14px] disabled:opacity-50"
          >
            {starting || status === "connecting" ? "Connecting…" : "Start voice"}
          </button>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-center justify-center gap-2 border-b border-hairline bg-gradient-to-b from-white to-[#f3f4f4] px-4 py-6">
        <PilotOrb
          active={connected}
          speaking={isSpeaking}
          listening={isListening && !isSpeaking}
          size={connected ? 168 : 140}
        />
        <p className="text-[12px] text-muted">
          {connected
            ? isSpeaking
              ? "Pilot is speaking"
              : "Your turn — speak naturally"
            : "Orb lights up when the session is live"}
        </p>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4"
      >
        {lines.length === 0 && (
          <p className="rounded-xl bg-surface px-4 py-3 text-[14px] leading-relaxed text-muted">
            {connected
              ? "Speak when Listening — cash, anomalies, spend vs market, or draft a brief."
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
              {line.text}
            </div>
          </div>
        ))}
      </div>

      {(error || localError || message) && (
        <p className="shrink-0 border-t border-hairline bg-surface px-4 py-2 text-[12px] text-muted">
          {localError || error || message}
          {!connected && (
            <>
              {" "}
              Agent must be <span className="font-medium text-ink">public</span>{" "}
              (auth off) for hosted demos.
            </>
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
