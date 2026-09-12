import type { Citation, ExternalRiskItem, SpendContextRow } from "@/lib/types";

const DEMO_CITATIONS: Record<string, Citation[]> = {
  intercom: [
    {
      title: "Intercom pricing",
      url: "https://www.intercom.com/pricing",
      snippet:
        "Public list pricing for Essential/Advanced seats commonly cited in the mid-hundreds to low-thousands per month depending on seats.",
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
      snippet:
        "Usage-based cloud spend varies widely; early-stage teams often land in low-to-mid four figures monthly.",
    },
  ],
  figma: [
    {
      title: "Figma pricing",
      url: "https://www.figma.com/pricing/",
      snippet:
        "Organization seats commonly cited from ~$15–$45/editor/month on published plans.",
    },
  ],
  jordan_design: [
    {
      title: "US product designer contractor rates (public ranges)",
      url: "https://www.levels.fyi/",
      snippet:
        "Public contractor/day-rate discussions for senior product design often imply roughly $6k–$12k/month depending on hours and seniority.",
    },
  ],
  northpeak: [
    {
      title: "Company search placeholder",
      url: "https://www.tavily.com/",
      snippet:
        "Demo Mode: public footprint research would run via Tavily Search/Extract when TAVILY_API_KEY is set.",
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
    merchant: {
      key: string;
      displayName: string;
      category: string;
      roleHint?: string;
    };
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
    .filter(
      (r) =>
        r.merchant.category === "saas" || r.merchant.category === "contractor",
    )
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
      headline:
        "Ongoing public pricing and regional capacity headlines - review if spend concentration is high.",
      severity: "low",
      citations: DEMO_CITATIONS.aws,
    },
    {
      merchantKey: "intercom",
      displayName: "Intercom",
      headline:
        "Public packaging/pricing pages updated periodically - useful when comparing list rates to your Rho amount.",
      severity: "low",
      citations: DEMO_CITATIONS.intercom,
    },
  ];
}

type LiveSearchResult = {
  citations: Citation[];
  error?: string;
};

async function tavilySearchOne(
  key: string,
  query: string,
): Promise<LiveSearchResult> {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query,
        topic: "finance",
        max_results: 3,
        search_depth: "basic",
      }),
    });
    if (!res.ok) {
      return {
        citations: [],
        error: `search ${res.status} for “${query.slice(0, 48)}”`,
      };
    }
    const data = (await res.json()) as {
      results?: { title?: string; url?: string; content?: string }[];
    };
    return {
      citations: (data.results ?? []).slice(0, 3).map((r) => ({
        title: r.title ?? "Source",
        url: r.url ?? "#",
        snippet: (r.content ?? "").slice(0, 220),
      })),
    };
  } catch (e) {
    return {
      citations: [],
      error: e instanceof Error ? e.message : "search failed",
    };
  }
}

/** Parallel Tavily Search for each query. */
export async function fetchSpendContextLive(
  queries: { label: string; query: string }[],
): Promise<{ results: LiveSearchResult[]; errors: string[] }> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) {
    return {
      results: queries.map(() => ({ citations: [] })),
      errors: ["TAVILY_API_KEY missing"],
    };
  }

  const results = await Promise.all(
    queries.map((q) => tavilySearchOne(key, q.query)),
  );
  const errors = results
    .map((r) => r.error)
    .filter((e): e is string => Boolean(e));
  return { results, errors };
}

/** Extract cleaner text from top pricing URLs (stretch / optional). */
export async function tavilyExtractUrls(
  urls: string[],
): Promise<{ textByUrl: Record<string, string>; errors: string[] }> {
  const key = process.env.TAVILY_API_KEY;
  const unique = [...new Set(urls.filter((u) => u && u.startsWith("http")))].slice(
    0,
    5,
  );
  if (!key || unique.length === 0) {
    return { textByUrl: {}, errors: [] };
  }

  try {
    const res = await fetch("https://api.tavily.com/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: key, urls: unique }),
    });
    if (!res.ok) {
      return {
        textByUrl: {},
        errors: [`extract ${res.status}`],
      };
    }
    const data = (await res.json()) as {
      results?: { url?: string; raw_content?: string }[];
    };
    const textByUrl: Record<string, string> = {};
    for (const r of data.results ?? []) {
      if (r.url && r.raw_content) {
        textByUrl[r.url] = r.raw_content.slice(0, 1200);
      }
    }
    return { textByUrl, errors: [] };
  } catch (e) {
    return {
      textByUrl: {},
      errors: [e instanceof Error ? e.message : "extract failed"],
    };
  }
}

/** Best-effort $ range parse from public snippets (cents). */
export function parseDollarHints(
  text: string,
): { lowCents: number; highCents: number } | null {
  const matches = [...text.matchAll(/\$\s?([\d,]+(?:\.\d+)?)\s*(k|K)?/g)];
  if (matches.length < 1) return null;
  const values = matches
    .map((m) => {
      let n = parseFloat(m[1].replace(/,/g, ""));
      if (Number.isNaN(n)) return null;
      if (m[2]) n *= 1000;
      return Math.round(n * 100);
    })
    .filter((n): n is number => n != null && n > 500_00 && n < 50_000_00);
  if (values.length === 0) return null;
  const low = Math.min(...values);
  const high = Math.max(...values);
  if (low === high) return { lowCents: Math.round(low * 0.8), highCents: high };
  return { lowCents: low, highCents: high };
}

function queryForRow(
  row: SpendContextRow,
  roleHint?: string,
): string {
  if (row.kind === "contractor") {
    const role = roleHint || "senior product designer";
    return `${role} freelance contractor monthly rate United States public salary band`;
  }
  const vendor = row.label.split(" - ")[0];
  return `${vendor} official pricing plans monthly cost SaaS`;
}

export async function buildSpendContext(
  recurrings: {
    merchant: {
      key: string;
      displayName: string;
      category: string;
      roleHint?: string;
    };
    rhoAmountMonthlyCents: number;
    rhoTransactionIds: string[];
  }[],
): Promise<{
  rows: SpendContextRow[];
  source: "tavily" | "demo";
  errors?: string[];
  citationCount?: number;
}> {
  const base = demoSpendContext(recurrings);
  if (!process.env.TAVILY_API_KEY) {
    return { rows: base, source: "demo" };
  }

  const roleByLabel = new Map(
    recurrings.map((r) => [
      r.merchant.category === "contractor"
        ? `${r.merchant.displayName} - ${r.merchant.roleHint ?? "contractor"}`
        : r.merchant.displayName,
      r.merchant.roleHint,
    ]),
  );

  const { results, errors } = await fetchSpendContextLive(
    base.map((row) => ({
      label: row.label,
      query: queryForRow(row, roleByLabel.get(row.label)),
    })),
  );

  const topUrls = results
    .map((r) => r.citations[0]?.url)
    .filter((u): u is string => Boolean(u));
  const { textByUrl, errors: extractErrors } = await tavilyExtractUrls(topUrls);

  let citationCount = 0;
  const rows = base.map((row, i) => {
    const live = results[i]?.citations ?? [];
    const hasLive = live.length > 0;
    if (hasLive) citationCount += live.length;

    const extractText = live[0]?.url ? textByUrl[live[0].url] : undefined;
    const blob = [live.map((c) => c.snippet).join(" "), extractText ?? ""].join(
      " ",
    );
    const hint = parseDollarHints(blob);

    const citations = hasLive
      ? live.map((c) =>
          extractText && c.url === live[0]?.url
            ? {
                ...c,
                snippet: (extractText.slice(0, 220) || c.snippet).slice(0, 220),
              }
            : c,
        )
      : row.citations;

    let notes = hasLive
      ? "Live Tavily citations attached. Public-web estimates for decision support - not advice."
      : row.notes;
    if (hint) {
      notes += ` Snippet dollar hints ~$${(hint.lowCents / 100).toLocaleString()}–$${(hint.highCents / 100).toLocaleString()}/mo (unverified parse; band still uses calibrated fallback).`;
    }

    return {
      ...row,
      citations,
      notes,
      // Keep calibrated demo bands so the table never blanks mid-demo.
      citedRangeLowCents: row.citedRangeLowCents,
      citedRangeHighCents: row.citedRangeHighCents,
      band: row.band,
    };
  });

  const allErrors = [...errors, ...extractErrors];
  return {
    rows,
    source: citationCount > 0 ? "tavily" : "demo",
    errors: allErrors.length ? allErrors : undefined,
    citationCount,
  };
}

export async function buildExternalRisk(): Promise<{
  items: ExternalRiskItem[];
  source: "tavily" | "demo";
  errors?: string[];
}> {
  if (!process.env.TAVILY_API_KEY) {
    return { items: demoExternalRisk(), source: "demo" };
  }

  const queries = [
    {
      merchantKey: "aws",
      displayName: "Amazon Web Services",
      query: "Amazon AWS cloud outage OR pricing change news this week",
    },
    {
      merchantKey: "intercom",
      displayName: "Intercom",
      query: "Intercom software company pricing OR outage OR downtime news",
    },
  ];

  const { results, errors } = await fetchSpendContextLive(
    queries.map((q) => ({ label: q.displayName, query: q.query })),
  );

  let liveHits = 0;
  const items: ExternalRiskItem[] = queries.map((q, i) => {
    const cites = results[i]?.citations ?? [];
    if (cites.length) liveHits += cites.length;
    const top = cites[0];
    const headline = top
      ? `${top.title}${top.snippet ? ` — ${top.snippet.slice(0, 120)}` : ""}`
      : demoExternalRisk().find((d) => d.merchantKey === q.merchantKey)
          ?.headline ?? "No fresh headline; review vendor status pages.";

    const lower = `${top?.title ?? ""} ${top?.snippet ?? ""}`.toLowerCase();
    let severity: ExternalRiskItem["severity"] = "low";
    if (
      lower.includes("outage") ||
      lower.includes("down") ||
      lower.includes("breach")
    ) {
      severity = "medium";
    }

    return {
      merchantKey: q.merchantKey,
      displayName: q.displayName,
      headline: headline.slice(0, 280),
      severity,
      citations: cites.length
        ? cites
        : (DEMO_CITATIONS[q.merchantKey] ?? []),
    };
  });

  return {
    items,
    source: liveHits > 0 ? "tavily" : "demo",
    errors: errors.length ? errors : undefined,
  };
}

/** Compact citation list for Talk / agent replies. */
export function formatCitationDigest(
  rows: SpendContextRow[],
  limit = 4,
): string {
  const parts: string[] = [];
  for (const row of rows) {
    for (const c of row.citations.slice(0, 1)) {
      parts.push(`${row.label}: ${c.title} (${c.url})`);
      if (parts.length >= limit) return parts.join("; ");
    }
  }
  return parts.join("; ") || "no citations";
}
