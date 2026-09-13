/**
 * Client tools for ElevenLabs ConvAI — same names must exist as Client Tools
 * (blocking) on the hosted Agent for the model to invoke them mid-call.
 */

function apiUrl(path: string): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  return path;
}

async function toolJson(path: string, init?: RequestInit): Promise<string> {
  try {
    const res = await fetch(apiUrl(path), init);
    const data = await res.json();
    if (!res.ok) {
      return JSON.stringify({
        ok: false,
        error: data?.error ?? `HTTP ${res.status}`,
      });
    }
    return JSON.stringify(data);
  } catch (e) {
    return JSON.stringify({
      ok: false,
      error: e instanceof Error ? e.message : "request failed",
    });
  }
}

export const pilotClientTools = {
  get_balances: async () => toolJson("/api/tools/get_balances"),
  get_transactions: async (params: Record<string, unknown> = {}) => {
    const limit =
      typeof params.limit === "number"
        ? params.limit
        : typeof params.limit === "string"
          ? Number(params.limit)
          : 25;
    return toolJson(`/api/tools/get_transactions?limit=${limit || 25}`);
  },
  get_anomalies: async () => toolJson("/api/tools/get_anomalies"),
  get_concentration: async () => toolJson("/api/tools/get_concentration"),
  tavily_spend_context: async () => toolJson("/api/tools/tavily_spend_context"),
  tavily_risk_brief: async () => toolJson("/api/tools/tavily_risk_brief"),
  generate_brief: async (params: Record<string, unknown> = {}) => {
    const type =
      params.type === "client_close_pack"
        ? "client_close_pack"
        : "weekly_money_brief";
    return toolJson("/api/tools/generate_brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
  },
  publish_to_stan: async (params: Record<string, unknown> = {}) => {
    if (params.confirmed !== true && params.confirmed !== "true") {
      return JSON.stringify({
        ok: false,
        error: "Set confirmed: true after the founder explicitly confirms publish.",
      });
    }
    return toolJson("/api/tools/publish_to_stan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmed: true,
        briefId: typeof params.briefId === "string" ? params.briefId : undefined,
      }),
    });
  },
};

const FALLBACK_CONTEXT = [
  "WORKSPACE CONTEXT (Northstar Co. demo ledger on Rho — read-only).",
  "Cash total: about $2.4M across Operating / Reserve / Treasury (demo fixtures).",
  "Use client tools get_balances, get_anomalies, tavily_spend_context when you need exact IDs.",
  "Decision support only — not advice. Cannot move money.",
].join("\n");

async function safeJson(
  path: string,
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: string }> {
  try {
    const res = await fetch(apiUrl(path), { cache: "no-store" });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = (await res.json()) as Record<string, unknown>;
    return { ok: true, data };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to fetch",
    };
  }
}

/** Snapshot injected at session start. Never throws — voice must stay up. */
export async function loadPilotWorkspaceContext(): Promise<string> {
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
      location: "client-tools.ts:loadPilotWorkspaceContext",
      message: "loading workspace context (resilient)",
      data: {},
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  try {
    // Ledger first (fast, local). Tavily optional — can fail/timeout.
    const [balancesR, anomaliesR, concentrationR, spendR, riskR] =
      await Promise.all([
        safeJson("/api/tools/get_balances"),
        safeJson("/api/tools/get_anomalies"),
        safeJson("/api/tools/get_concentration"),
        safeJson("/api/tools/tavily_spend_context"),
        safeJson("/api/tools/tavily_risk_brief"),
      ]);

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
        location: "client-tools.ts:loadResults",
        message: "workspace fetch results",
        data: {
          balances: balancesR.ok,
          anomalies: anomaliesR.ok,
          concentration: concentrationR.ok,
          spend: spendR.ok,
          risk: riskR.ok,
          spendErr: spendR.ok ? null : spendR.error,
          riskErr: riskR.ok ? null : riskR.error,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!balancesR.ok && !anomaliesR.ok) {
      return FALLBACK_CONTEXT;
    }

    const balances = (balancesR.ok ? balancesR.data : {}) as {
      formatted?: { total?: string; burn30?: string; runwayDays?: number };
      demoMode?: boolean;
    };
    const anomalies = (anomaliesR.ok ? anomaliesR.data : {}) as {
      anomalies?: {
        severity: string;
        title: string;
        amountCents?: number;
      }[];
    };
    const spend = (spendR.ok ? spendR.data : {}) as {
      source?: string;
      rows?: {
        label: string;
        band: string;
        rhoAmountMonthlyCents?: number;
        citations?: { title: string; url: string }[];
      }[];
    };
    const risk = (riskR.ok ? riskR.data : {}) as {
      source?: string;
      items?: { displayName: string; headline: string }[];
    };
    const concentration = (concentrationR.ok ? concentrationR.data : {}) as {
      concentration?: { displayName: string; pctOfBurn: number }[];
    };

    const spendLines = (spend.rows ?? [])
      .slice(0, 6)
      .map((r) => {
        const cite = r.citations?.[0];
        const amt =
          typeof r.rhoAmountMonthlyCents === "number"
            ? `$${(r.rhoAmountMonthlyCents / 100).toLocaleString()}/mo`
            : "";
        return `- ${r.label}: ${amt} band=${r.band}${cite ? ` cite=${cite.title}` : ""}`;
      })
      .join("\n");

    const anomLines = (anomalies.anomalies ?? [])
      .slice(0, 5)
      .map(
        (a) =>
          `- ${a.severity}: ${a.title}${
            typeof a.amountCents === "number"
              ? ` ($${(Math.abs(a.amountCents) / 100).toLocaleString()})`
              : ""
          }`,
      )
      .join("\n");

    const riskLines = (risk.items ?? [])
      .slice(0, 3)
      .map((i) => `- ${i.displayName}: ${i.headline}`)
      .join("\n");

    const concLines = (concentration.concentration ?? [])
      .slice(0, 5)
      .map(
        (c) =>
          `- ${c.displayName}: ${c.pctOfBurn?.toFixed?.(1) ?? c.pctOfBurn}% of burn`,
      )
      .join("\n");

    return [
      "WORKSPACE CONTEXT (Northstar Co. demo ledger on Rho — read-only). Use these numbers; call tools to refresh.",
      `Cash total: ${balances.formatted?.total ?? "n/a"}`,
      `30d burn: ${balances.formatted?.burn30 ?? "n/a"}`,
      `Runway days: ${balances.formatted?.runwayDays ?? "n/a"}`,
      `Demo mode: ${balances.demoMode === false ? "live Rho attempt" : "demo fixtures"}`,
      "",
      "Top concentration:",
      concLines || "- n/a",
      "",
      "Anomaly radar:",
      anomLines || "- none",
      "",
      `Spend Context (${spend.source ?? "unavailable"}):`,
      spendLines || "- n/a (call tavily_spend_context if needed)",
      "",
      `External risk (${risk.source ?? "unavailable"}):`,
      riskLines || "- n/a",
      "",
      "Rules: decision support only, not advice; never claim you can move money; cite Rho IDs when tools return them.",
    ].join("\n");
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
        runId: "post-fix-2",
        hypothesisId: "E",
        location: "client-tools.ts:loadCatch",
        message: "workspace context fell back",
        data: { err: e instanceof Error ? e.message : String(e) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return FALLBACK_CONTEXT;
  }
}
