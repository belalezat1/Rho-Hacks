import type { BriefRecord, SpendContextRow, ExternalRiskItem, Anomaly, BurnRunway, CashPosition, ConcentrationRow } from "@/lib/types";
import { formatUsd } from "@/lib/ledger/analytics";

export function buildWeeklyBriefMarkdown(input: {
  cash: CashPosition;
  burn: BurnRunway;
  concentration: ConcentrationRow[];
  anomalies: Anomaly[];
  spendContext: SpendContextRow[];
  risk: ExternalRiskItem[];
  voiceNote?: string;
}): string {
  const lines: string[] = [];
  lines.push(`# Weekly Money Brief`);
  lines.push(``);
  lines.push(`*Decision support only - not financial, tax, legal, or investment advice. Read-only on Rho; cannot move money.*`);
  lines.push(``);
  lines.push(`## Cash Pulse`);
  lines.push(`- **Total cash position:** ${formatUsd(input.cash.totalCents)}`);
  for (const a of input.cash.accounts) {
    lines.push(`  - ${a.name} (\`${a.id}\`): ${formatUsd(a.balanceCents)}`);
  }
  lines.push(`- **30-day burn:** ${formatUsd(input.burn.burn30Cents)}`);
  lines.push(
    `- **Approx. runway:** ${input.burn.runwayDays != null ? `${input.burn.runwayDays} days` : "n/a"}`,
  );
  lines.push(``);
  lines.push(`## Vendor concentration (30d)`);
  for (const row of input.concentration.slice(0, 8)) {
    lines.push(
      `- ${row.displayName}: ${formatUsd(row.outflowCents)} (${row.pctOfBurn.toFixed(1)}% of burn)`,
    );
  }
  lines.push(``);
  lines.push(`## Anomaly radar`);
  if (!input.anomalies.length) lines.push(`- None flagged.`);
  for (const a of input.anomalies.slice(0, 8)) {
    lines.push(
      `- **${a.severity.toUpperCase()}** ${a.title} - ${formatUsd(a.amountCents)} (txs: ${a.transactionIds.join(", ")})`,
    );
  }
  lines.push(``);
  lines.push(`## Competitive Spend Context`);
  lines.push(`| Item | You pay (Rho) | Cited public range | Band |`);
  lines.push(`|---|---|---|---|`);
  for (const r of input.spendContext) {
    const range =
      r.citedRangeLowCents != null && r.citedRangeHighCents != null
        ? `${formatUsd(r.citedRangeLowCents)} to ${formatUsd(r.citedRangeHighCents)}`
        : "insufficient public data";
    lines.push(
      `| ${r.label} | ${formatUsd(r.rhoAmountMonthlyCents)} | ${range} | ${r.band.replace("_", " ")} |`,
    );
  }
  lines.push(``);
  lines.push(`### Sources`);
  for (const r of input.spendContext) {
    for (const c of r.citations) {
      lines.push(`- ${r.label}: [${c.title}](${c.url}) - ${c.snippet}`);
    }
  }
  lines.push(``);
  lines.push(`## External Risk`);
  for (const item of input.risk) {
    lines.push(`- **${item.displayName}:** ${item.headline}`);
  }
  if (input.voiceNote) {
    lines.push(``);
    lines.push(`## Voice Capture note`);
    lines.push(input.voiceNote);
  }
  lines.push(``);
  lines.push(`---`);
  lines.push(`Next step: review exceptions and spend context in Rho. Pilot does not prescribe hire/cut/renew decisions.`);
  return lines.join("\n");
}

export function buildClosePackMarkdown(input: {
  anomalies: Anomaly[];
  periodLabel: string;
}): string {
  const lines: string[] = [];
  lines.push(`# Client Close Pack`);
  lines.push(``);
  lines.push(`*Period: ${input.periodLabel}. Decision support - not advice. Read-only.*`);
  lines.push(``);
  lines.push(`## Exceptions since period start`);
  for (const a of input.anomalies) {
    lines.push(
      `- ${a.title} · ${formatUsd(a.amountCents)} · ${a.detail} · IDs: ${a.transactionIds.join(", ")}`,
    );
  }
  lines.push(``);
  lines.push(`## Suggested client narrative`);
  lines.push(
    `We reviewed exceptions on the Rho ledger for ${input.periodLabel}. Items above are radar flags for your review in Rho - not compliance clearance.`,
  );
  return lines.join("\n");
}

function trimSpoken(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/[,:\s]+$/, "")}…`;
}

/**
 * Spoken standup for ElevenLabs TTS — CFO-style briefing, not a table read-aloud.
 */
export function buildWeeklyStandupScript(input: {
  cash: CashPosition;
  burn: BurnRunway;
  concentration: ConcentrationRow[];
  anomalies: Anomaly[];
  spendContext: SpendContextRow[];
  risk: ExternalRiskItem[];
  voiceNote?: string;
}): string {
  const runway =
    input.burn.runwayDays != null
      ? `about ${input.burn.runwayDays} days of runway at the current thirty-day burn`
      : "runway that needs a closer look because burn is thin or uneven";

  const topVendors = input.concentration
    .slice(0, 3)
    .map((r) => `${r.displayName} at ${r.pctOfBurn.toFixed(0)} percent of burn`)
    .join(", ");

  const above = input.spendContext.filter((r) => r.band === "above");
  const within = input.spendContext.filter((r) => r.band === "within");
  const below = input.spendContext.filter((r) => r.band === "below");

  let spendLine =
    "On spend versus public market context, I compared your Rho recurrings to cited public ranges.";
  if (above.length) {
    spendLine += ` Sitting above the cited band: ${above
      .slice(0, 3)
      .map((r) => r.label)
      .join(", ")}. That is a review cue, not a cut recommendation.`;
  }
  if (within.length) {
    spendLine += ` Within band: ${within
      .slice(0, 3)
      .map((r) => r.label)
      .join(", ")}.`;
  }
  if (below.length) {
    spendLine += ` Below cited ranges: ${below
      .slice(0, 2)
      .map((r) => r.label)
      .join(", ")}.`;
  }
  if (!above.length && !within.length && !below.length) {
    spendLine +=
      " Public data was thin on a few items, so treat those as insufficient context.";
  }

  const highAnoms = input.anomalies.filter(
    (a) => a.severity === "high" || a.severity === "medium",
  );
  let radarLine =
    input.anomalies.length === 0
      ? "Anomaly radar is quiet this period."
      : `Anomaly radar has ${input.anomalies.length} flag${input.anomalies.length === 1 ? "" : "s"}.`;
  if (highAnoms.length) {
    radarLine += ` Worth a look first: ${highAnoms
      .slice(0, 2)
      .map((a) => a.title)
      .join("; ")}. These are radar signals to escalate in Rho, not verdicts.`;
  }

  const riskTops = input.risk.slice(0, 2);
  const riskLine = riskTops.length
    ? `External context from the open web: ${riskTops
        .map((r) => `${r.displayName} — ${trimSpoken(r.headline, 100)}`)
        .join(". ")}. Informational only.`
    : "";

  const noteLine = input.voiceNote
    ? `You also left a voice note: ${trimSpoken(input.voiceNote, 180)}`
    : "";

  return [
    "This is your Pilot weekly money standup. Decision support only — not financial advice. Read-only on Rho; I cannot move money.",
    `Cash pulse: you are sitting on ${formatUsd(input.cash.totalCents)} across accounts, with a thirty-day burn of ${formatUsd(input.burn.burn30Cents)}, which implies ${runway}.`,
    topVendors
      ? `Concentration is led by ${topVendors}.`
      : "Vendor concentration is dispersed this period.",
    radarLine,
    spendLine,
    riskLine,
    noteLine,
    "Full evidence, Rho IDs, and citations are in the written brief. Next step: review what jumped out in Rho, then publish the pack to Stan when you are ready.",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildClosePackStandupScript(input: {
  anomalies: Anomaly[];
  periodLabel: string;
}): string {
  const n = input.anomalies.length;
  const tops = input.anomalies
    .slice(0, 3)
    .map((a) => `${a.title} at ${formatUsd(a.amountCents)}`)
    .join("; ");
  return [
    `This is your Pilot client close pack for ${input.periodLabel}. Decision support only — not advice.`,
    n === 0
      ? "No exceptions on the radar for this close window."
      : `I flagged ${n} exception${n === 1 ? "" : "s"} on the Rho ledger. Highlights: ${tops}.`,
    "Walk these with your client as review items, not compliance clearance. Full IDs and detail are in the written pack. Confirm in Briefs before you publish to Stan.",
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fallback when only markdown is available. Prefer buildWeeklyStandupScript. */
export function briefToAudioScript(markdown: string): string {
  return markdown
    .replace(/^#+\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/\`/g, "")
    .replace(/\*/g, "")
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .slice(0, 40)
    .join(". ");
}

export function makeBriefRecord(
  partial: Omit<BriefRecord, "id" | "createdAt">,
): BriefRecord {
  return {
    ...partial,
    id: `brief_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}

export function getStanUrl(): string {
  return process.env.STAN_PRODUCT_URL || "https://stan.store/";
}

/** TTS: returns script always; audioBase64 when ELEVENLABS_API_KEY succeeds. */
export async function synthesizeBriefAudio(
  text: string,
): Promise<{
  audioBase64?: string;
  mime?: string;
  script: string;
  error?: string;
}> {
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const script = text.slice(0, 2500);
  if (!key) return { script, error: "ELEVENLABS_API_KEY missing" };

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": key,
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        script,
        error: `TTS ${res.status}${detail ? `: ${detail.slice(0, 160)}` : ""}`,
      };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return { audioBase64: buf.toString("base64"), mime: "audio/mpeg", script };
  } catch (e) {
    return {
      script,
      error: e instanceof Error ? e.message : "TTS request failed",
    };
  }
}
