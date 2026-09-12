import { formatUsd } from "@/lib/ledger/analytics";
import type {
  Anomaly,
  BriefRecord,
  BurnRunway,
  CashPosition,
  Citation,
  ConcentrationRow,
  ExternalRiskItem,
  SpendContextRow,
} from "@/lib/types";

export type BriefSectionId =
  | "cash_pulse"
  | "anomalies"
  | "spend_context"
  | "external_risk"
  | "narrative"
  | "audio"
  | "stan";

export type BriefSectionStatus = "ready" | "attention" | "empty" | "pending";

export interface BriefSectionEvidence {
  rhoIds: string[];
  citations: Citation[];
  notes?: string[];
}

export interface BriefSection {
  id: BriefSectionId;
  label: string;
  status: BriefSectionStatus;
  summary: string;
  bodyMarkdown: string;
  evidence: BriefSectionEvidence;
}

export interface BriefStudioPayload {
  metrics: {
    totalCashCents: number;
    burn30Cents: number;
    runwayDays: number | null;
    anomalyCount: number;
    spendRowCount: number;
    riskCount: number;
  };
  sections: BriefSection[];
}

export interface StudioBriefRecord extends BriefRecord {
  audioBase64?: string;
  mime?: string;
  pdfBase64?: string;
  studio?: BriefStudioPayload;
  publishedAt?: string;
}

const WEEKLY_OUTLINE: { id: BriefSectionId; label: string }[] = [
  { id: "cash_pulse", label: "Cash Pulse" },
  { id: "anomalies", label: "Anomalies" },
  { id: "spend_context", label: "Spend Context" },
  { id: "external_risk", label: "External Risk" },
  { id: "narrative", label: "Narrative" },
  { id: "audio", label: "Audio standup" },
  { id: "stan", label: "Stan delivery" },
];

const CLOSE_OUTLINE: { id: BriefSectionId; label: string }[] = [
  { id: "anomalies", label: "Exceptions" },
  { id: "cash_pulse", label: "Period cash context" },
  { id: "narrative", label: "Client narrative" },
  { id: "audio", label: "Audio standup" },
  { id: "stan", label: "Stan delivery" },
];

export function buildStudioPayload(input: {
  type: "weekly_money_brief" | "client_close_pack";
  cash: CashPosition;
  burn: BurnRunway;
  concentration: ConcentrationRow[];
  anomalies: Anomaly[];
  spendContext: SpendContextRow[];
  risk: ExternalRiskItem[];
  voiceNote?: string;
  periodLabel?: string;
  hasAudio: boolean;
  hasPdf: boolean;
  stanUrl: string;
}): BriefStudioPayload {
  const isClose = input.type === "client_close_pack";
  const outline = isClose ? CLOSE_OUTLINE : WEEKLY_OUTLINE;

  const cashBody = [
    `**Total cash position:** ${formatUsd(input.cash.totalCents)}`,
    ...input.cash.accounts.map(
      (a) => `- ${a.name} (\`${a.id}\`): ${formatUsd(a.balanceCents)}`,
    ),
    `- **30-day burn:** ${formatUsd(input.burn.burn30Cents)}`,
    `- **Approx. runway:** ${
      input.burn.runwayDays != null ? `${input.burn.runwayDays} days` : "n/a"
    }`,
    ``,
    `**Vendor concentration (30d)**`,
    ...input.concentration
      .slice(0, 6)
      .map(
        (r) =>
          `- ${r.displayName}: ${formatUsd(r.outflowCents)} (${r.pctOfBurn.toFixed(1)}% of burn)`,
      ),
  ].join("\n");

  const anomalyBody =
    input.anomalies.length === 0
      ? "None flagged."
      : input.anomalies
          .slice(0, 10)
          .map(
            (a) =>
              `- **${a.severity.toUpperCase()}** ${a.title} — ${formatUsd(a.amountCents)}\n  ${a.detail}`,
          )
          .join("\n");

  const spendBody =
    input.spendContext.length === 0
      ? "No spend context rows yet."
      : [
          `| Item | You pay (Rho) | Cited public range | Band |`,
          `|---|---|---|---|`,
          ...input.spendContext.map((r) => {
            const range =
              r.citedRangeLowCents != null && r.citedRangeHighCents != null
                ? `${formatUsd(r.citedRangeLowCents)}–${formatUsd(r.citedRangeHighCents)}`
                : "insufficient public data";
            return `| ${r.label} | ${formatUsd(r.rhoAmountMonthlyCents)} | ${range} | ${r.band.replace(/_/g, " ")} |`;
          }),
        ].join("\n");

  const riskBody =
    input.risk.length === 0
      ? "No external risk headlines."
      : input.risk
          .map((item) => `- **${item.displayName}:** ${item.headline}`)
          .join("\n");

  const narrativeBody = isClose
    ? `We reviewed exceptions on the Rho ledger for ${input.periodLabel ?? "this period"}. Items above are radar flags for review in Rho — not compliance clearance.\n\n*Decision support only — not financial advice.*`
    : [
        `Monday money brief assembled from live Rho ledger truth and cited public market context.`,
        input.voiceNote ? `\n**Voice Capture note:** ${input.voiceNote}` : "",
        `\nNext step: review exceptions and spend context in Rho. Pilot does not prescribe hire/cut/renew decisions.`,
        `\n*Decision support only — not financial, tax, legal, or investment advice.*`,
      ].join("");

  const allRhoIds = [
    ...input.cash.accounts.map((a) => a.id),
    ...input.anomalies.flatMap((a) => a.transactionIds),
    ...input.spendContext.flatMap((r) => r.rhoTransactionIds),
  ];
  const allCitations = [
    ...input.spendContext.flatMap((r) => r.citations),
    ...input.risk.flatMap((r) => r.citations),
  ];

  const sectionMap: Record<BriefSectionId, BriefSection> = {
    cash_pulse: {
      id: "cash_pulse",
      label: "Cash Pulse",
      status: input.cash.accounts.length ? "ready" : "empty",
      summary: `${formatUsd(input.cash.totalCents)} · ~${input.burn.runwayDays ?? "n/a"}d runway`,
      bodyMarkdown: cashBody,
      evidence: {
        rhoIds: input.cash.accounts.map((a) => a.id),
        citations: [],
        notes: input.concentration
          .slice(0, 3)
          .map((c) => `${c.displayName} ${c.pctOfBurn.toFixed(0)}% of burn`),
      },
    },
    anomalies: {
      id: "anomalies",
      label: isClose ? "Exceptions" : "Anomalies",
      status: input.anomalies.length ? "attention" : "ready",
      summary: `${input.anomalies.length} radar item${input.anomalies.length === 1 ? "" : "s"}`,
      bodyMarkdown: anomalyBody,
      evidence: {
        rhoIds: input.anomalies.flatMap((a) => a.transactionIds),
        citations: [],
        notes: input.anomalies.slice(0, 5).map((a) => a.title),
      },
    },
    spend_context: {
      id: "spend_context",
      label: "Spend Context",
      status: input.spendContext.length ? "ready" : "empty",
      summary: `${input.spendContext.length} compared row${input.spendContext.length === 1 ? "" : "s"}`,
      bodyMarkdown: spendBody,
      evidence: {
        rhoIds: input.spendContext.flatMap((r) => r.rhoTransactionIds),
        citations: input.spendContext.flatMap((r) => r.citations),
      },
    },
    external_risk: {
      id: "external_risk",
      label: "External Risk",
      status: input.risk.length ? "attention" : "ready",
      summary: `${input.risk.length} headline${input.risk.length === 1 ? "" : "s"}`,
      bodyMarkdown: riskBody,
      evidence: {
        rhoIds: [],
        citations: input.risk.flatMap((r) => r.citations),
      },
    },
    narrative: {
      id: "narrative",
      label: isClose ? "Client narrative" : "Narrative",
      status: "ready",
      summary: "Decision-support framing",
      bodyMarkdown: narrativeBody,
      evidence: {
        rhoIds: allRhoIds.slice(0, 12),
        citations: allCitations.slice(0, 8),
        notes: ["Not financial advice", "Read-only on Rho"],
      },
    },
    audio: {
      id: "audio",
      label: "Audio standup",
      status: input.hasAudio ? "ready" : "pending",
      summary: input.hasAudio
        ? "Brief Production Studio audio ready"
        : "Script ready — TTS pending or use script",
      bodyMarkdown: input.hasAudio
        ? "ElevenLabs audio attached to this pack."
        : "Audio script generated. Play script aloud or attach TTS when keys are present.",
      evidence: { rhoIds: [], citations: [] },
    },
    stan: {
      id: "stan",
      label: "Stan delivery",
      status: "pending",
      summary: "Confirm checklist, then publish share link",
      bodyMarkdown: `Forwardable pack URL target: ${input.stanUrl}\n\nPublish is gated until the close checklist is confirmed.`,
      evidence: { rhoIds: [], citations: [] },
    },
  };

  return {
    metrics: {
      totalCashCents: input.cash.totalCents,
      burn30Cents: input.burn.burn30Cents,
      runwayDays: input.burn.runwayDays,
      anomalyCount: input.anomalies.length,
      spendRowCount: input.spendContext.length,
      riskCount: input.risk.length,
    },
    sections: outline.map((o) => sectionMap[o.id]),
  };
}

export function checklistDefaults(studio: BriefStudioPayload | undefined, brief: StudioBriefRecord | null) {
  const hasCash = Boolean(
    studio?.sections.find((s) => s.id === "cash_pulse" && s.status !== "empty"),
  );
  const hasSpend = Boolean(
    studio?.sections.find((s) => s.id === "spend_context" && s.status === "ready"),
  );
  const hasRisk = Boolean(studio?.sections.some((s) => s.id === "external_risk"));
  const hasAudio = Boolean(brief?.audioBase64 || brief?.audioText);
  const hasPdf = Boolean(brief?.pdfBase64);

  return {
    cashAttached: hasCash,
    anomaliesReviewed: false,
    spendAttached: hasSpend || brief?.type === "client_close_pack",
    riskAttached: hasRisk || brief?.type === "client_close_pack",
    audioReady: hasAudio,
    pdfReady: hasPdf,
    confirmPublish: false,
  };
}

export type ChecklistState = ReturnType<typeof checklistDefaults>;

export function checklistComplete(c: ChecklistState, type: string) {
  const base =
    c.anomaliesReviewed &&
    c.audioReady &&
    c.pdfReady &&
    c.confirmPublish;
  if (type === "client_close_pack") {
    return base && c.cashAttached;
  }
  return base && c.cashAttached && c.spendAttached && c.riskAttached;
}
