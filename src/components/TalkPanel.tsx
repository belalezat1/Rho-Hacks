"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VoiceCapture } from "@/components/VoiceCapture";

const PROMPTS = [
  {
    label: "Give me the week",
    prompt: "Give me the week: cash, anomalies, and spend context.",
  },
  {
    label: "Spend vs market",
    prompt: "How does our SaaS and contractor spend compare to public market ranges?",
  },
  {
    label: "Draft Monday brief",
    prompt: "Draft a weekly money brief I can publish to Stan.",
  },
  {
    label: "Client close pack",
    prompt: "Walk anomalies since the 1st and prepare a client close pack.",
  },
] as const;

type Trace = {
  id: string;
  tool: string;
  at: string;
  summary: string;
};

type Msg = { role: "user" | "assistant"; text: string };

export function TalkPanel() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask about cash, anomalies, spend context, or drafting a brief. Read-only on Rho. Decision support only, not financial advice.",
    },
  ]);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [busy, setBusy] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [lastBriefId, setLastBriefId] = useState<string | null>(null);
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  async function refreshTraces() {
    const res = await fetch("/api/session");
    const data = await res.json();
    setTraces(data.traces ?? []);
  }

  useEffect(() => {
    void refreshTraces();
  }, []);

  async function runToolChain(prompt: string) {
    const q = prompt.trim();
    if (!q || busy) return;
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
      let reply = `Cash position ${balances.formatted.total}. About ${balances.formatted.runwayDays ?? "n/a"} days runway. ${anomalies.anomalies.length} radar items. Spend Context has ${spend.rows?.length ?? 0} cited rows (${spend.source}). External risk: ${risk.items?.length ?? 0} headlines.`;

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
        reply = `Drafted ${brief.brief?.title}. Cash, anomalies, Spend Context, and External Risk are in Brief Studio. Open Briefs to review the checklist, then publish to Stan.`;
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
        reply = `Prepared ${brief.brief?.title} with ${anomalies.anomalies.length} exceptions. Open Briefs to review and publish.`;
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
            (r: {
              label: string;
              band: string;
              citations?: { title: string; url: string }[];
            }) => {
              const band = r.band.replace(/_/g, " ");
              const cite = r.citations?.[0];
              return cite
                ? `${r.label}: ${band} [${cite.title}](${cite.url})`
                : `${r.label}: ${band}`;
            },
          )
          .join("; ");
        const digest =
          typeof spend.summary === "string"
            ? spend.summary
            : `${spend.citationCount ?? 0} live cites`;
        reply = `Spend Context (${spend.source}): ${rows || "no rows"}. ${digest}. Public-web estimates for decision support, not quotes.`;
        if (risk.items?.[0]?.headline) {
          reply += ` Risk: ${risk.items[0].displayName} — ${risk.items[0].headline.slice(0, 100)}`;
        }
      } else if (
        lower.includes("anomal") ||
        lower.includes("weird") ||
        lower.includes("radar")
      ) {
        const top = (anomalies.anomalies ?? [])
          .slice(0, 3)
          .map((a: { title: string; severity: string }) => `${a.severity}: ${a.title}`)
          .join("; ");
        reply = `${anomalies.anomalies.length} radar items. ${top || "None flagged."} Radar only, not a verdict. Escalate in Rho.`;
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
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <header>
        <h1 className="page-title">Talk</h1>
        <p className="meta mt-3 max-w-xl">
          CFO-style briefing. Rho for ledger truth, Tavily for spend context.
          Not financial advice.
        </p>
      </header>

      <div className="mt-7 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setShowEvidence(true)}
          className="btn-secondary px-4 text-[14px]"
        >
          Evidence
        </button>
        <button
          type="button"
          onClick={() => setShowNote((v) => !v)}
          className="btn-secondary px-4 text-[14px]"
        >
          {showNote ? "Hide note" : "Voice note"}
        </button>
        <Link href="/briefs" className="btn-dark px-4 text-[14px]">
          Brief Studio
        </Link>
      </div>

      {agentId ? (
        <iframe
          title="ElevenLabs Agent"
          src={`https://elevenlabs.io/app/talk-to?agent_id=${agentId}`}
          className="mt-6 h-56 w-full rounded-[var(--radius-panel)] border border-hairline bg-surface"
          allow="microphone"
        />
      ) : null}

      {/* Chat stage */}
      <div className="studio-panel mt-6 flex min-h-[380px] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
          {log.map((m, i) => {
            const isSystem = i === 0 && m.role === "assistant";
            if (isSystem) {
              return (
                <div
                  key={`${m.role}-${i}`}
                  className="rounded-[var(--radius-control)] bg-canvas px-4 py-3.5 text-[14px] leading-relaxed text-muted"
                >
                  {m.text}
                </div>
              );
            }
            return (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] px-4 py-3 text-[15px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-[var(--radius-control)] rounded-br-md bg-mint-soft text-ink"
                      : "rounded-[var(--radius-control)] rounded-bl-md border border-hairline bg-surface text-ink/90"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          {busy && (
            <p className="text-[13px] text-muted">Pulling Rho and Tavily…</p>
          )}
        </div>

        {/* Rho-style composer: chips + input + mint send */}
        <div className="border-t border-hairline bg-surface px-4 py-4 md:px-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {PROMPTS.map((p) => (
              <button
                key={p.label}
                type="button"
                disabled={busy}
                onClick={() => void runToolChain(p.prompt)}
                className="prompt-chip"
              >
                {p.label}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              void runToolChain(input || PROMPTS[0].prompt);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="control-input flex-1 text-[15px]"
              placeholder="Ask about cash, spend, anomalies, or a brief…"
              aria-label="Ask Pilot"
            />
            <button
              type="submit"
              disabled={busy}
              className="btn-icon-mint"
              aria-label={busy ? "Sending" : "Send"}
            >
              {busy ? (
                <span className="text-[13px] font-medium">…</span>
              ) : (
                <SendIcon />
              )}
            </button>
          </form>
        </div>
      </div>

      {lastBriefId && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-panel)] bg-mint-soft/60 px-5 py-4">
          <p className="text-[15px] text-ink/85">
            A pack is ready in Brief Studio.
          </p>
          <Link href="/briefs" className="btn-primary px-5 text-[14px]">
            Review and publish
          </Link>
        </div>
      )}

      {showNote && (
        <div className="studio-soft mt-5 p-5">
          <p className="mb-3 text-[13px] font-medium text-muted">
            Voice Capture (adds context to the next brief)
          </p>
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
          <aside className="flex h-full w-full max-w-md flex-col border-l border-hairline bg-surface shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-hairline px-5">
              <h3 className="text-[16px] font-semibold tracking-tight">
                Tool evidence
              </h3>
              <button
                type="button"
                onClick={() => setShowEvidence(false)}
                className="btn-secondary h-9 min-h-0 px-3 text-[13px]"
              >
                Close
              </button>
            </div>
            <ul className="flex-1 space-y-2.5 overflow-y-auto p-4 text-[13px]">
              {traces.length === 0 && (
                <li className="px-1 py-2 text-muted">
                  No tools called yet. Send a prompt.
                </li>
              )}
              {traces.map((t) => (
                <li
                  key={t.id}
                  className="rounded-[var(--radius-control)] border border-hairline bg-canvas/80 p-3.5"
                >
                  <div className="flex justify-between gap-2 font-medium text-ink">
                    <span>{t.tool}</span>
                    <span className="text-[12px] font-normal text-muted">
                      {new Date(t.at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1.5 leading-relaxed text-muted">{t.summary}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4.5 12h15M13 5.5L19.5 12 13 18.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
