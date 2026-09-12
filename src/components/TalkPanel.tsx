"use client";

import { useEffect, useMemo, useState } from "react";
import { HalftoneVoice } from "@/components/HalftoneVoice";
import { VoiceCapture } from "@/components/VoiceCapture";

const SUGGESTED = "Give me the week — cash, anomalies, and spend context.";

type Trace = {
  id: string;
  tool: string;
  at: string;
  summary: string;
  payload: unknown;
};

export function TalkPanel() {
  const [voiceSession, setVoiceSession] = useState(false);
  const [showType, setShowType] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [input, setInput] = useState(SUGGESTED);
  const [log, setLog] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [busy, setBusy] = useState(false);
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  async function refreshTraces() {
    const res = await fetch("/api/session");
    const data = await res.json();
    setTraces(data.traces ?? []);
  }

  useEffect(() => {
    if (voiceSession) void refreshTraces();
  }, [voiceSession]);

  const widget = useMemo(() => {
    if (!agentId || !voiceSession) return null;
    return (
      <iframe
        title="ElevenLabs Agent"
        src={`https://elevenlabs.io/app/talk-to?agent_id=${agentId}`}
        className="mt-4 h-48 w-full rounded-xl border border-hairline bg-surface"
        allow="microphone"
      />
    );
  }, [agentId, voiceSession]);

  function startSession() {
    setVoiceSession(true);
    setShowType(false);
    setLog([
      {
        role: "assistant",
        text: "Session open. Ask about cash, spend context, or a brief — decision support only, not advice.",
      },
    ]);
  }

  function endSession() {
    setVoiceSession(false);
    setShowEvidence(false);
    setShowNote(false);
    setShowType(false);
    setBusy(false);
  }

  async function runToolChain(prompt: string) {
    setBusy(true);
    setLog((l) => [...l, { role: "user", text: prompt }]);
    try {
      const [balances, anomalies, spend] = await Promise.all([
        fetch("/api/tools/get_balances").then((r) => r.json()),
        fetch("/api/tools/get_anomalies").then((r) => r.json()),
        fetch("/api/tools/tavily_spend_context").then((r) => r.json()),
      ]);
      await refreshTraces();

      const lower = prompt.toLowerCase();
      let reply = `Cash position ${balances.formatted.total}; ~${balances.formatted.runwayDays ?? "n/a"} days runway. ${anomalies.anomalies.length} radar items. Spend Context: ${spend.rows?.length ?? 0} cited rows (${spend.source}).`;

      if (lower.includes("brief") || lower.includes("stan") || lower.includes("publish")) {
        const brief = await fetch("/api/tools/generate_brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "weekly_money_brief" }),
        }).then((r) => r.json());
        const pub = await fetch("/api/tools/publish_to_stan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmed: true, briefId: brief.brief?.id }),
        }).then((r) => r.json());
        await refreshTraces();
        reply += ` Drafted ${brief.brief?.title}. Stan: ${pub.stanUrl}.`;
      } else if (lower.includes("close") || lower.includes("1st")) {
        const brief = await fetch("/api/tools/generate_brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "client_close_pack", persona: "accountant" }),
        }).then((r) => r.json());
        await refreshTraces();
        reply += ` Prepared ${brief.brief?.title}. Open Briefs to review.`;
      } else if (
        lower.includes("intercom") ||
        lower.includes("jordan") ||
        lower.includes("spend") ||
        lower.includes("range")
      ) {
        const rows = (spend.rows ?? [])
          .slice(0, 3)
          .map(
            (r: { label: string; band: string }) =>
              `${r.label} (${r.band.replace("_", " ")})`,
          )
          .join("; ");
        reply += ` Compare: ${rows}.`;
      }

      setLog((l) => [...l, { role: "assistant", text: reply }]);
    } catch {
      setLog((l) => [
        ...l,
        { role: "assistant", text: "Tool chain failed. Check Demo Mode APIs." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (!voiceSession) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-sm text-muted">Brief your money</p>
        <button
          type="button"
          onClick={startSession}
          className="btn-primary mt-6 px-10 py-4 text-base"
        >
          Talk to Pilot
        </button>
        {!showType ? (
          <button
            type="button"
            onClick={() => setShowType(true)}
            className="mt-4 text-sm text-muted underline-offset-2 hover:underline"
          >
            Type instead
          </button>
        ) : (
          <form
            className="mt-6 flex w-full max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const prompt = input;
              setVoiceSession(true);
              setShowType(false);
              setLog([
                {
                  role: "assistant",
                  text: "Session open. Ask about cash, spend context, or a brief — decision support only, not advice.",
                },
              ]);
              void runToolChain(prompt);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-lg border border-hairline bg-surface px-3 py-2 text-left text-sm outline-none focus:border-ink/30"
              placeholder="Ask Pilot…"
              autoFocus
            />
            <button type="submit" className="btn-dark px-4 py-2 text-sm">
              Send
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">Voice session</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setShowEvidence(true)}
            className="text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Evidence
          </button>
          <button
            type="button"
            onClick={() => setShowNote((v) => !v)}
            className="text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Add note
          </button>
          <button type="button" onClick={endSession} className="btn-secondary px-3 py-1.5 text-sm">
            End session
          </button>
        </div>
      </div>

      <HalftoneVoice active={busy || Boolean(agentId)} className="h-64 w-full md:h-72" />
      {widget}

      <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
        {log.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`rounded-xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-8 bg-mint-soft"
                : "mr-8 border border-hairline bg-surface"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void runToolChain(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-lg border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:border-ink/30"
          placeholder="Ask about the week, spend, or a brief…"
        />
        <button type="submit" disabled={busy} className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
          {busy ? "…" : "Send"}
        </button>
      </form>

      {showNote && (
        <div className="mt-4">
          <VoiceCapture />
        </div>
      )}

      {showEvidence && (
        <div className="fixed inset-0 z-40 flex justify-end bg-ink/20 backdrop-blur-[2px]">
          <button
            type="button"
            className="flex-1 cursor-default"
            aria-label="Close evidence"
            onClick={() => setShowEvidence(false)}
          />
          <aside className="flex h-full w-full max-w-sm flex-col border-l border-hairline bg-ink text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="text-sm font-semibold">Evidence</h3>
              <button
                type="button"
                onClick={() => setShowEvidence(false)}
                className="text-sm text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>
            <ul className="flex-1 space-y-2 overflow-y-auto p-3 font-mono text-[11px]">
              {traces.length === 0 && (
                <li className="text-white/40">No tools called yet.</li>
              )}
              {traces.map((t) => (
                <li key={t.id} className="rounded-lg border border-white/10 bg-white/5 p-2.5">
                  <div className="flex justify-between gap-2 text-mint">
                    <span>{t.tool}</span>
                    <span className="text-white/40">
                      {new Date(t.at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-white/85">{t.summary}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
