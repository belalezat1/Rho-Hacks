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
        ? `${formatUsd(r.citedRangeLowCents)}–${formatUsd(r.citedRangeHighCents)}`
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

/** TTS: returns null if no key; client can use browser speech or show script. */
export async function synthesizeBriefAudio(
  text: string,
): Promise<{ audioBase64?: string; mime?: string; script: string }> {
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const script = text.slice(0, 2500);
  if (!key) return { script };

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
          model_id: "eleven_turbo_v2_5",
        }),
      },
    );
    if (!res.ok) return { script };
    const buf = Buffer.from(await res.arrayBuffer());
    return { audioBase64: buf.toString("base64"), mime: "audio/mpeg", script };
  } catch {
    return { script };
  }
}
