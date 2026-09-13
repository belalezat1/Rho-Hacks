"use client";

import { useCallback, useEffect, useState } from "react";
import { formatUsd } from "@/lib/ledger/analytics";

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

function formatMorningBrief(input: {
  total: string;
  burn: string;
  runway: string | number | null | undefined;
  concentration: { displayName?: string; pctOfBurn?: number }[];
  anomalies: {
    title: string;
    severity: string;
    amountCents?: number;
  }[];
}): string {
  const conc = (input.concentration ?? [])
    .slice(0, 3)
    .map(
      (c) =>
        `- ${c.displayName ?? "Vendor"} — ${(c.pctOfBurn ?? 0).toFixed(1)}%`,
    )
    .join("\n");
  const items = input.anomalies ?? [];
  const top = items.slice(0, 4);
  const extra = Math.max(0, items.length - top.length);
  const anomLines = top
    .map((a) => {
      const amt =
        typeof a.amountCents === "number" ? formatUsd(a.amountCents) : "";
      return `- ${amt} · ${a.severity} · ${a.title}`;
    })
    .join("\n");
  return [
    "Cash",
    `- Total: ${input.total} · Burn 30d: ${input.burn} · Runway: ${input.runway ?? "n/a"}d`,
    "",
    "Top burn",
    conc || "- n/a",
    "",
    "Exceptions",
    anomLines || "- None flagged",
    ...(extra > 0 ? [`- +${extra} more`] : []),
    "",
    "Next",
    "- Review high / awaiting items in Rho.",
    "",
    "Draft a Weekly Money Brief?",
  ].join("\n");
}

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
      const [balances, anomalies, spend, concentration] = await Promise.all([
        fetch("/api/tools/get_balances").then((r) => r.json()),
        fetch("/api/tools/get_anomalies").then((r) => r.json()),
        fetch("/api/tools/tavily_spend_context").then((r) => r.json()),
        fetch("/api/tools/get_concentration").then((r) => r.json()),
      ]);
      await refreshTraces();

      const lower = q.toLowerCase();
      let reply = formatMorningBrief({
        total: balances.formatted?.total ?? "n/a",
        burn: balances.formatted?.burn30 ?? "n/a",
        runway: balances.formatted?.runwayDays,
        concentration: concentration.concentration ?? [],
        anomalies: anomalies.anomalies ?? [],
      });

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
        reply = [
          "Pack",
          `- Drafted ${brief.brief?.title ?? "Weekly Money Brief"}`,
          "",
          "Includes",
          "- Cash Pulse",
          "- Exceptions",
          "- Spend Context",
          "- External Risk",
          "",
          "Next",
          "- Open Brief Studio → checklist → publish to Stan.",
        ].join("\n");
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
        reply = [
          "Client close pack",
          `- ${brief.brief?.title ?? "Client Close Pack"}`,
          `- ${(anomalies.anomalies ?? []).length} exceptions attached`,
          "",
          "Next",
          "- Open Brief Studio to review and publish.",
        ].join("\n");
      } else if (
        lower.includes("spend") ||
        lower.includes("range") ||
        lower.includes("intercom") ||
        lower.includes("jordan") ||
        lower.includes("market")
      ) {
        const rows = (spend.rows ?? [])
          .slice(0, 5)
          .map(
            (r: { label: string; band: string }) =>
              `- ${r.label}: ${r.band.replace(/_/g, " ")}`,
          )
          .join("\n");
        reply = [
          "Spend Context",
          `- Source: ${spend.source ?? "tavily"}`,
          rows || "- no rows",
          "",
          "Next",
          "- Open Spend for full cited ranges.",
        ].join("\n");
      } else if (
        lower.includes("anomal") ||
        lower.includes("weird") ||
        lower.includes("radar") ||
        lower.includes("exception")
      ) {
        const top = (anomalies.anomalies ?? [])
          .slice(0, 5)
          .map(
            (a: {
              title: string;
              severity: string;
              amountCents?: number;
            }) => {
              const amt =
                typeof a.amountCents === "number"
                  ? formatUsd(a.amountCents)
                  : "";
              return `- ${amt} · ${a.severity} · ${a.title}`;
            },
          )
          .join("\n");
        reply = [
          "Exceptions",
          `- ${(anomalies.anomalies ?? []).length} radar items`,
          top || "- None flagged",
          "",
          "Next",
          "- Escalate in Rho. Radar only, not a verdict.",
        ].join("\n");
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
