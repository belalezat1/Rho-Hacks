import { NextResponse } from "next/server";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";
import { buildSpendContext, buildExternalRisk } from "@/lib/tavily/spend-context";
import {
  briefToAudioScript,
  buildClosePackMarkdown,
  buildWeeklyBriefMarkdown,
  getStanUrl,
  makeBriefRecord,
  synthesizeBriefAudio,
} from "@/lib/briefs/generate";
import { buildStudioPayload } from "@/lib/briefs/studio";
import { markdownToPdfBase64 } from "@/lib/briefs/pdf";
import { getVoiceNote, pushTrace, saveBrief } from "@/lib/session-store";
import { assertToolAccess } from "@/lib/api/tool-auth";

export async function POST(req: Request) {
  const denied = assertToolAccess(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as {
    type?: "weekly_money_brief" | "client_close_pack";
    persona?: "founder" | "accountant";
  };
  const type = body.type ?? "weekly_money_brief";
  const persona =
    body.persona ?? (type === "client_close_pack" ? "accountant" : "founder");

  const snap = await loadLedgerSnapshot();
  const [{ rows, source: spendSource }, { items, source: riskSource }] =
    await Promise.all([
      buildSpendContext(snap.recurrings),
      buildExternalRisk(),
    ]);

  const markdown =
    type === "client_close_pack"
      ? buildClosePackMarkdown({
          anomalies: snap.anomalies,
          periodLabel: "since the 1st",
        })
      : buildWeeklyBriefMarkdown({
          cash: snap.cash,
          burn: snap.burn,
          concentration: snap.concentration,
          anomalies: snap.anomalies,
          spendContext: rows,
          risk: items,
          voiceNote: getVoiceNote(),
        });

  const title =
    type === "client_close_pack" ? "Client Close Pack" : "Weekly Money Brief";
  const audioText = briefToAudioScript(markdown);
  const audio = await synthesizeBriefAudio(audioText);
  const pdfBase64 = markdownToPdfBase64(title, markdown);
  const stanUrl = getStanUrl();
  const studio = buildStudioPayload({
    type,
    cash: snap.cash,
    burn: snap.burn,
    concentration: snap.concentration,
    anomalies: snap.anomalies,
    spendContext: type === "client_close_pack" ? [] : rows,
    risk: type === "client_close_pack" ? [] : items,
    voiceNote: getVoiceNote(),
    periodLabel: "since the 1st",
    hasAudio: Boolean(audio.audioBase64),
    hasPdf: true,
    stanUrl,
  });

  const brief = makeBriefRecord({
    type,
    title,
    markdown,
    audioText: audio.script,
    stanUrl,
    persona,
  });
  const saved = {
    ...brief,
    audioBase64: audio.audioBase64,
    mime: audio.mime,
    pdfBase64,
    studio,
  };
  saveBrief(saved);
  const payload = {
    brief: { ...brief, hasPdf: true, studio },
    studio,
    audioAvailable: Boolean(audio.audioBase64),
    audioError: audio.error ?? null,
    pdfAvailable: true,
    spendSource,
    riskSource,
    confirmRequired: true,
    summary: `Drafted ${title}. Audio=${Boolean(audio.audioBase64)}; spend=${spendSource}; risk=${riskSource}.`,
    message:
      "Brief drafted in Brief Studio (PDF + audio). Complete checklist, then confirm publish_to_stan. Decision support only - not financial advice.",
  };
  pushTrace("generate_brief", brief.title, payload);
  return NextResponse.json(payload);
}
