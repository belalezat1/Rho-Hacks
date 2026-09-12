"use client";

import { useCallback, useEffect, useState } from "react";

export const PILOT_PROMPTS = [
  {
    label: "Give me the week",
    prompt: "Give me the week: cash, anomalies, and spend context.",
  },
  {
    label: "Spend vs market",
    prompt:
      "How does our SaaS and contractor spend compare to public market ranges?",
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

export type PilotTrace = {
  id: string;
  tool: string;
  at: string;
  summary: string;
};

export type PilotMsg = { role: "user" | "assistant"; text: string };

const INTRO: PilotMsg = {
  role: "assistant",
  text: "Ask about cash, anomalies, spend context, or drafting a brief. Read-only on Rho. Decision support only, not financial advice.",
};

export function usePilotBriefing() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<PilotMsg[]>([INTRO]);
  const [traces, setTraces] = useState<PilotTrace[]>([]);
  const [busy, setBusy] = useState(false);
  const [lastBriefId, setLastBriefId] = useState<string | null>(null);
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const refreshTraces = useCallback(async () => {
    const res = await fetch("/api/session");
    const data = await res.json();
    setTraces(data.traces ?? []);
  }, []);

  useEffect(() => {
    void refreshTraces();
  }, [refreshTraces]);

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
        reply = `Drafted ${brief.brief?.title}. Cash, anomalies, Spend Context, and External Risk are in Brief Studio. Open Brief Studio to review the checklist, then publish to Stan.`;
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
        reply = `Prepared ${brief.brief?.title} with ${anomalies.anomalies.length} exceptions. Open Brief Studio to review and publish.`;
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
            }) => `${r.label}: ${r.band.replace(/_/g, " ")}`,
          )
          .join("; ");
        reply = `Spend Context (${spend.source}): ${rows || "no rows"}. Public-web estimates for decision support, not quotes. Open Spend for the full table.`;
      } else if (
        lower.includes("anomal") ||
        lower.includes("weird") ||
        lower.includes("radar") ||
        lower.includes("exception")
      ) {
        const top = (anomalies.anomalies ?? [])
          .slice(0, 3)
          .map(
            (a: { title: string; severity: string }) =>
              `${a.severity}: ${a.title}`,
          )
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

  return {
    input,
    setInput,
    log,
    traces,
    busy,
    lastBriefId,
    agentId,
    runToolChain,
    refreshTraces,
  };
}
