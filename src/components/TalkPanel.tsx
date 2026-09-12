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
              formatted?: { rho?: string; range?: string };
            }) => {
              const band = r.band.replace(/_/g, " ");
              return `${r.label}: ${band}`;
            },
          )
          .join("; ");
        reply = `Spend Context (${spend.source}): ${rows || "no rows"}. Public-web estimates for decision support, not quotes. Open Spend for the full table.`;
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-5">
        <div>
          <h1 className="page-title">Talk</h1>
          <p className="meta mt-2 max-w-lg text-[16px]">
            CFO-style briefing. Rho for ledger truth, Tavily for spend context.
            Not financial advice.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowEvidence(true)}
            className="btn-secondary px-4 py-3 text-[15px]"
          >
            Evidence
          </button>
          <button
            type="button"
            onClick={() => setShowNote((v) => !v)}
            className="btn-secondary px-4 py-3 text-[15px]"
          >
            {showNote ? "Hide note" : "Voice note"}
          </button>
          <Link href="/briefs" className="btn-dark btn-lift px-4 py-3 text-[15px]">
            Brief Studio
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p.label}
            type="button"
            disabled={busy}
            onClick={() => void runToolChain(p.prompt)}
            className="rounded-full border border-hairline bg-surface px-4 py-2.5 text-[14px] text-ink transition hover:border-ink/25 hover:bg-canvas disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {agentId ? (
        <iframe
          title="ElevenLabs Agent"
          src={`https://elevenlabs.io/app/talk-to?agent_id=${agentId}`}
          className="h-56 w-full rounded-2xl border border-hairline bg-surface"
          allow="microphone"
        />
      ) : null}

      <div className="studio-panel flex min-h-[320px] flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
          {log.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`max-w-[92%] rounded-2xl px-4 py-3 text-[16px] leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-mint-soft text-ink"
                  : "mr-auto border border-hairline bg-canvas/60 text-ink/90"
              }`}
            >
              {m.text}
            </div>
          ))}
          {busy && (
            <p className="text-[14px] text-muted">Pulling Rho and Tavily…</p>
          )}
        </div>

        <form
          className="flex gap-3 border-t border-hairline p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void runToolChain(input || PROMPTS[0].prompt);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-hairline bg-surface px-4 py-3.5 text-[16px] outline-none focus:border-ink/30"
            placeholder="Ask about cash, spend, anomalies, or a brief…"
          />
          <button
            type="submit"
            disabled={busy}
            className="btn-primary btn-lift px-6 py-3.5 text-[16px] disabled:opacity-50"
          >
            {busy ? "…" : "Send"}
          </button>
        </form>
      </div>

      {lastBriefId && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mint-soft/50 px-5 py-4">
          <p className="text-[15px] text-ink/85">
            A pack is ready in Brief Studio.
          </p>
          <Link
            href="/briefs"
            className="btn-primary btn-lift px-5 py-3 text-[15px]"
          >
            Review and publish
          </Link>
        </div>
      )}

      {showNote && (
        <div className="studio-soft p-5">
          <p className="mb-3 text-[14px] font-medium text-muted">
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
