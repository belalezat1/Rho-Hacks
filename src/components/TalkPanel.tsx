"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HalftoneVoice } from "@/components/HalftoneVoice";
import { SpeechBubble } from "@/components/SpeechBubble";
import { VoiceCapture } from "@/components/VoiceCapture";

type Trace = {
  id: string;
  tool: string;
  at: string;
  summary: string;
};

type Msg = { role: "user" | "assistant"; text: string };

export function TalkPanel() {
  const [session, setSession] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<Msg[]>([]);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [busy, setBusy] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [lastBriefId, setLastBriefId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const latestAssistant =
    [...log].reverse().find((m) => m.role === "assistant")?.text ??
    "Listening — ask about cash, spend, or a Monday brief.";

  async function refreshTraces() {
    const res = await fetch("/api/session");
    const data = await res.json();
    setTraces(data.traces ?? []);
  }

  useEffect(() => {
    if (session) void refreshTraces();
  }, [session]);

  function startSession(focusType = false) {
    setSession(true);
    setLog([
      {
        role: "assistant",
        text: "Hi — I’m Pilot. Ask about cash, anomalies, spend vs market, or drafting a brief. Read-only on Rho. Decision support only, not advice.",
      },
    ]);
    if (focusType) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function endSession() {
    setSession(false);
    setShowEvidence(false);
    setShowNote(false);
    setBusy(false);
    setInput("");
  }

  async function runToolChain(prompt: string) {
    const q = prompt.trim();
    if (!q || busy) return;
    if (!session) startSession();
    setBusy(true);
    setInput("");
    setLog((l) => [...l, { role: "user", text: q }]);
    try {
      const [balances, anomalies, spend, risk] = await Promise.all([
        fetch("/api/tools/get_balances").then((r) => r.json()),
        fetch("/api/tools/get_anomalies").then((r) => r.json()),
        fetch("/api/tools/tavily_spend_context").then((r) => r.json()),
        fetch("/api/tools/tavily_risk_brief").then((r) => r.json()),
      ]);
      await refreshTraces();

      const lower = q.toLowerCase();
      let reply = `Cash position ${balances.formatted?.total ?? "—"}. About ${balances.formatted?.runwayDays ?? "n/a"} days runway. ${anomalies.anomalies?.length ?? 0} radar items. Spend Context: ${spend.rows?.length ?? 0} cited rows (${spend.source}). Risk headlines: ${risk.items?.length ?? 0}.`;

      if (
        lower.includes("brief") ||
        lower.includes("stan") ||
        lower.includes("publish") ||
        lower.includes("monday")
      ) {
        const brief = await fetch("/api/tools/generate_brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "weekly_money_brief" }),
        }).then((r) => r.json());
        setLastBriefId(brief.brief?.id ?? null);
        await refreshTraces();
        reply = `Drafted ${brief.brief?.title ?? "Weekly Money Brief"}. Cash, anomalies, Spend Context, and External Risk are ready in Briefs. Review the checklist, then publish to Stan.`;
      } else if (lower.includes("close") || lower.includes("1st")) {
        const brief = await fetch("/api/tools/generate_brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "client_close_pack",
            persona: "accountant",
          }),
        }).then((r) => r.json());
        setLastBriefId(brief.brief?.id ?? null);
        await refreshTraces();
        reply = `Prepared ${brief.brief?.title ?? "Client Close Pack"} with ${anomalies.anomalies?.length ?? 0} exceptions. Open Briefs to review and publish.`;
      } else if (
        lower.includes("spend") ||
        lower.includes("range") ||
        lower.includes("intercom") ||
        lower.includes("jordan") ||
        lower.includes("market")
      ) {
        const rows = (spend.rows ?? [])
          .slice(0, 4)
          .map(
            (r: { label: string; band: string }) =>
              `${r.label}: ${r.band.replace(/_/g, " ")}`,
          )
          .join("; ");
        reply = `Spend Context (${spend.source}): ${rows || "no rows"}. Public-web estimates for decision support, not quotes.`;
      } else if (
        lower.includes("anomal") ||
        lower.includes("weird") ||
        lower.includes("radar")
      ) {
        const top = (anomalies.anomalies ?? [])
          .slice(0, 3)
          .map(
            (a: { title: string; severity: string }) =>
              `${a.severity}: ${a.title}`,
          )
          .join("; ");
        reply = `${anomalies.anomalies?.length ?? 0} radar items. ${top || "None flagged."} Radar only — escalate in Rho.`;
      }

      setLog((l) => [...l, { role: "assistant", text: reply }]);
    } catch {
      setLog((l) => [
        ...l,
        {
          role: "assistant",
          text: "Tool chain failed. Demo Mode APIs should still respond. Try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col">
      {session && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-muted">
            Live session
          </p>
          <div className="flex flex-wrap gap-2 text-[14px]">
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
              {showNote ? "Hide note" : "Add note"}
            </button>
            {lastBriefId && (
              <Link
                href="/briefs"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Open Briefs
              </Link>
            )}
            <button
              type="button"
              onClick={endSession}
              className="btn-secondary px-3 py-1.5 text-[13px]"
            >
              End session
            </button>
          </div>
        </div>
      )}

      {session && (
        <div className="grid flex-1 items-center gap-8 motion-safe:animate-[fadeUp_0.45s_ease-out] lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col justify-center gap-4">
            <SpeechBubble text={latestAssistant} busy={busy} />
            {log.filter((m) => m.role === "user").slice(-1)[0] && (
              <p className="pl-2 text-[14px] text-muted">
                You: {log.filter((m) => m.role === "user").slice(-1)[0]?.text}
              </p>
            )}
          </div>
          <HalftoneVoice
            active={busy}
            className="mx-auto h-64 w-64 lg:h-72 lg:w-full"
          />
        </div>
      )}

      {session && agentId ? (
        <details className="mt-6 rounded-2xl border border-hairline bg-surface open:pb-0">
          <summary className="cursor-pointer px-4 py-3 text-[13px] text-muted">
            ElevenLabs agent
          </summary>
          <iframe
            title="ElevenLabs Agent"
            src={`https://elevenlabs.io/app/talk-to?agent_id=${agentId}`}
            className="h-40 w-full border-t border-hairline bg-surface"
            allow="microphone"
          />
        </details>
      ) : null}

      {/* Primary CTA: idle centered → session lowered */}
      <div
        className={`flex flex-col items-center gap-4 transition-[margin,transform] duration-500 ease-out motion-reduce:transition-none ${
          session
            ? "mt-auto pt-8"
            : "absolute inset-0 m-auto h-fit w-fit justify-center"
        }`}
      >
        {!session ? (
          <>
            <button
              type="button"
              onClick={() => startSession(false)}
              className="btn-primary btn-lift rounded-full px-12 py-5 text-[18px] font-semibold shadow-sm"
            >
              Talk to Pilot
            </button>
            <button
              type="button"
              onClick={() => startSession(true)}
              className="text-[14px] text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              Type instead
            </button>
          </>
        ) : (
          <>
            <div
              className={`flex min-h-14 min-w-[10rem] items-center justify-center rounded-full px-8 py-4 text-[15px] font-semibold text-white transition ${
                busy
                  ? "bg-mint shadow-[0_0_0_6px_rgba(57,239,205,0.25)]"
                  : "bg-ink"
              }`}
              role="status"
            >
              {busy ? "Working…" : "Listening"}
            </div>

            <form
              className="flex w-full max-w-xl gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void runToolChain(
                  input ||
                    "Give me the week: cash, anomalies, and spend context.",
                );
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-full border border-hairline bg-surface px-5 py-3 text-[15px] outline-none focus:border-ink/30"
                placeholder="Ask about cash, spend, or a brief…"
              />
              <button
                type="submit"
                disabled={busy}
                className="btn-primary rounded-full px-6 py-3 text-[15px] disabled:opacity-50"
              >
                Send
              </button>
            </form>

            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void runToolChain(
                  "Give me the week: cash, anomalies, and spend context.",
                )
              }
              className="text-[13px] text-muted underline-offset-2 hover:text-ink hover:underline disabled:opacity-50"
            >
              Suggested: Give me the week
            </button>
          </>
        )}
      </div>

      {session && showNote && (
        <div className="mt-6 rounded-2xl border border-hairline bg-surface p-5">
          <VoiceCapture />
        </div>
      )}

      {session && showEvidence && (
        <div className="fixed inset-0 z-40 flex justify-end bg-ink/20 backdrop-blur-[2px]">
          <button
            type="button"
            className="flex-1 cursor-default"
            aria-label="Close evidence"
            onClick={() => setShowEvidence(false)}
          />
          <aside className="flex h-full w-full max-w-md flex-col border-l border-hairline bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <h3 className="text-[17px] font-semibold">Tool evidence</h3>
              <button
                type="button"
                onClick={() => setShowEvidence(false)}
                className="btn-secondary px-3 py-2 text-[14px]"
              >
                Close
              </button>
            </div>
            <ul className="flex-1 space-y-2 overflow-y-auto p-4 text-[13px]">
              {traces.length === 0 && (
                <li className="text-muted">No tools called yet. Send a prompt.</li>
              )}
              {traces.map((t) => (
                <li
                  key={t.id}
                  className="rounded-xl border border-hairline bg-canvas/80 p-3"
                >
                  <div className="flex justify-between gap-2 font-medium text-ink">
                    <span>{t.tool}</span>
                    <span className="text-muted">
                      {new Date(t.at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-muted">{t.summary}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
