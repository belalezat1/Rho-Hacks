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
import { markdownToPdfBase64 } from "@/lib/briefs/pdf";
import { getVoiceNote, pushTrace, saveBrief } from "@/lib/session-store";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    type?: "weekly_money_brief" | "client_close_pack";
    persona?: "founder" | "accountant";
  };
  const type = body.type ?? "weekly_money_brief";
  const persona = body.persona ?? (type === "client_close_pack" ? "accountant" : "founder");

  const snap = await loadLedgerSnapshot();
  const [{ rows }, { items }] = await Promise.all([
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
  const brief = makeBriefRecord({
    type,
    title,
    markdown,
    audioText: audio.script,
    stanUrl: getStanUrl(),
    persona,
  });
  saveBrief({
    ...brief,
    audioBase64: audio.audioBase64,
    mime: audio.mime,
    pdfBase64,
  });
  const payload = {
    brief: { ...brief, hasPdf: true },
    audioAvailable: Boolean(audio.audioBase64),
    pdfAvailable: true,
    confirmRequired: true,
    message:
      "Brief drafted (PDF + audio script). Confirm before publish_to_stan. Decision support only — not financial advice.",
  };
  pushTrace("generate_brief", brief.title, payload);
  return NextResponse.json(payload);
}
