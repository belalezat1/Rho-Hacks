import type { Citation, ExternalRiskItem, SpendContextRow } from "@/lib/types";

const DEMO_CITATIONS: Record<string, Citation[]> = {
  intercom: [
    {
      title: "Intercom pricing",
      url: "https://www.intercom.com/pricing",
      snippet: "Public list pricing for Essential/Advanced seats commonly cited in the mid-hundreds to low-thousands per month depending on seats.",
    },
  ],
  notion: [
    {
      title: "Notion pricing",
      url: "https://www.notion.com/pricing",
      snippet: "Business plan list pricing often cited around $18–$25/user/month.",
    },
  ],
  aws: [
    {
      title: "AWS pricing overview",
      url: "https://aws.amazon.com/pricing/",
      snippet: "Usage-based cloud spend varies widely; early-stage teams often land in low-to-mid four figures monthly.",
    },
  ],
  figma: [
    {
      title: "Figma pricing",
      url: "https://www.figma.com/pricing/",
      snippet: "Organization seats commonly cited from ~$15–$45/editor/month on published plans.",
    },
  ],
  jordan_design: [
    {
      title: "US product designer contractor rates (public ranges)",
      url: "https://www.levels.fyi/",
      snippet: "Public contractor/day-rate discussions for senior product design often imply roughly $6k–$12k/month depending on hours and seniority.",
    },
  ],
  northpeak: [
    {
      title: "Company search placeholder",
      url: "https://www.tavily.com/",
      snippet: "Demo Mode: public footprint research would run via Tavily Search/Extract when TAVILY_API_KEY is set.",
    },
  ],
};

function bandFor(
  paid: number,
  low: number | null,
  high: number | null,
): SpendContextRow["band"] {
  if (low == null || high == null) return "insufficient_data";
  if (paid < low) return "below";
  if (paid > high) return "above";
  return "within";
}

/** Demo / fallback Spend Context - replaced by live Tavily when key present. */
export function demoSpendContext(
  recurrings: {
    merchant: { key: string; displayName: string; category: string; roleHint?: string };
    rhoAmountMonthlyCents: number;
    rhoTransactionIds: string[];
  }[],
): SpendContextRow[] {
  const ranges: Record<string, [number, number]> = {
    intercom: [800_00, 2_500_00],
    notion: [100_00, 600_00],
    aws: [1_500_00, 8_000_00],
    figma: [200_00, 1_200_00],
    jordan_design: [6_000_00, 12_000_00],
  };

  return recurrings
    .filter((r) => r.merchant.category === "saas" || r.merchant.category === "contractor")
    .map((r) => {
      const range = ranges[r.merchant.key] ?? null;
      const low = range?.[0] ?? null;
      const high = range?.[1] ?? null;
      return {
        label:
          r.merchant.category === "contractor"
            ? `${r.merchant.displayName} - ${r.merchant.roleHint ?? "contractor"}`
            : r.merchant.displayName,
        kind: r.merchant.category === "contractor" ? "contractor" : "saas",
        rhoAmountMonthlyCents: r.rhoAmountMonthlyCents,
        rhoTransactionIds: r.rhoTransactionIds,
        citedRangeLowCents: low,
        citedRangeHighCents: high,
        band: bandFor(r.rhoAmountMonthlyCents, low, high),
        notes:
          "Public-web estimate for decision support - not a quote or employment advice. Verify before deciding.",
        citations: DEMO_CITATIONS[r.merchant.key] ?? [],
      };
    });
}

export function demoExternalRisk(): ExternalRiskItem[] {
  return [
    {
      merchantKey: "aws",
      displayName: "Amazon Web Services",
      headline: "Ongoing public pricing and regional capacity headlines - review if spend concentration is high.",
      severity: "low",
      citations: DEMO_CITATIONS.aws,
    },
    {
      merchantKey: "intercom",
      displayName: "Intercom",
      headline: "Public packaging/pricing pages updated periodically - useful when comparing list rates to your Rho amount.",
      severity: "low",
      citations: DEMO_CITATIONS.intercom,
    },
  ];
}

export async function fetchSpendContextLive(
  queries: { label: string; query: string }[],
): Promise<Citation[][]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return queries.map(() => []);

  const results: Citation[][] = [];
  for (const q of queries) {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: key,
          query: q.query,
          topic: "finance",
          max_results: 3,
          search_depth: "basic",
        }),
      });
      if (!res.ok) {
        results.push([]);
        continue;
      }
      const data = (await res.json()) as {
        results?: { title?: string; url?: string; content?: string }[];
      };
      results.push(
        (data.results ?? []).slice(0, 3).map((r) => ({
          title: r.title ?? "Source",
          url: r.url ?? "#",
          snippet: (r.content ?? "").slice(0, 220),
        })),
      );
    } catch {
      results.push([]);
    }
  }
  return results;
}

export async function buildSpendContext(
  recurrings: {
    merchant: { key: string; displayName: string; category: string; roleHint?: string };
    rhoAmountMonthlyCents: number;
    rhoTransactionIds: string[];
  }[],
): Promise<{ rows: SpendContextRow[]; source: "tavily" | "demo" }> {
  const base = demoSpendContext(recurrings);
  if (!process.env.TAVILY_API_KEY) {
    return { rows: base, source: "demo" };
  }

  const citations = await fetchSpendContextLive(
    base.map((row) => ({
      label: row.label,
      query:
        row.kind === "contractor"
          ? `senior product designer contractor monthly rate US public ranges`
          : `${row.label} SaaS pricing list price alternatives`,
    })),
  );

  const rows = base.map((row, i) => ({
    ...row,
    citations: citations[i]?.length ? citations[i] : row.citations,
    notes:
      citations[i]?.length
        ? "Live Tavily citations attached. Public-web estimates for decision support - not advice."
        : row.notes,
  }));

  return { rows, source: "tavily" };
}

export async function buildExternalRisk(): Promise<{
  items: ExternalRiskItem[];
  source: "tavily" | "demo";
}> {
  if (!process.env.TAVILY_API_KEY) {
    return { items: demoExternalRisk(), source: "demo" };
  }
  const cites = await fetchSpendContextLive([
    { label: "aws", query: "AWS outage OR pricing change news this week" },
    { label: "intercom", query: "Intercom pricing OR outage news" },
  ]);
  const demo = demoExternalRisk();
  return {
    source: "tavily",
    items: demo.map((item, i) => ({
      ...item,
      citations: cites[i]?.length ? cites[i] : item.citations,
    })),
  };
}
