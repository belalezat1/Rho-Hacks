"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUsd } from "@/lib/ledger/analytics";
import {
  checklistComplete,
  checklistDefaults,
  type BriefSection,
  type BriefSectionId,
  type ChecklistState,
  type StudioBriefRecord,
} from "@/lib/briefs/studio";

type PackType = "weekly_money_brief" | "client_close_pack";

function statusDot(status: BriefSection["status"]) {
  if (status === "ready") return "bg-ok";
  if (status === "attention") return "bg-warn";
  if (status === "pending") return "bg-muted-soft";
  return "bg-hairline";
}

function renderBody(md: string) {
  const blocks = md.split("\n");
  return (
    <div className="space-y-2 text-[14px] leading-relaxed text-ink">
      {blocks.map((line, i) => {
        if (line.startsWith("|")) {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-lg bg-canvas px-3 py-2 font-mono text-[11px] text-muted"
            >
              {line}
            </pre>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <p key={i} className="pl-1 text-muted">
              <span className="mr-2 text-ink">•</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: inlineFormat(line.slice(2)),
                }}
              />
            </p>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return (
          <p
            key={i}
            className="text-ink"
            dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
          />
        );
      })}
    </div>
  );
}

function inlineFormat(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong class='text-ink font-semibold'>$1</strong>")
    .replace(/`([^`]+)`/g, "<code class='rounded bg-canvas px-1 text-[12px]'>$1</code>");
}

export function BriefStudio() {
  const [packType, setPackType] = useState<PackType>("weekly_money_brief");
  const [briefs, setBriefs] = useState<StudioBriefRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<BriefSectionId>("cash_pulse");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistState | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  const active = useMemo(
    () =>
      (selectedId
        ? briefs.find((b) => b.id === selectedId)
        : briefs[0]) ?? null,
    [briefs, selectedId],
  );

  const studio = active?.studio;
  const sections = studio?.sections ?? [];
  const activeSection =
    sections.find((s) => s.id === sectionId) ?? sections[0] ?? null;

  async function refresh() {
    const res = await fetch("/api/session");
    const data = await res.json();
    const list = (data.briefs ?? []) as StudioBriefRecord[];
    setBriefs(list);
    if (list[0] && !selectedId) {
      setSelectedId(list[0].id);
      setPackType(list[0].type);
      setChecklist(checklistDefaults(list[0].studio, list[0]));
      const first = list[0].studio?.sections[0]?.id;
      if (first) setSectionId(first);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) return;
    setChecklist(checklistDefaults(active.studio, active));
    const first = active.studio?.sections[0]?.id;
    if (first) setSectionId(first);
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function draft() {
    setBusy(true);
    setStatus("Assembling pack from Rho + Spend Context…");
    try {
      const res = await fetch("/api/tools/generate_brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: packType }),
      });
      const data = await res.json();
      await refresh();
      if (data.brief?.id) setSelectedId(data.brief.id);
      setStatus(
        "Draft ready in Brief Studio — complete the checklist, then publish to Stan.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!active || !checklist) return;
    if (!checklistComplete(checklist, active.type)) {
      setStatus("Complete every checklist item (including confirm) before Stan publish.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/tools/publish_to_stan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: true, briefId: active.id }),
      });
      const data = await res.json();
      setStatus(`Published guided Stan link: ${data.stanUrl}`);
      window.open(data.stanUrl, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  }

  function downloadPdf() {
    if (!active?.pdfBase64) return;
    const a = document.createElement("a");
    a.href = `data:application/pdf;base64,${active.pdfBase64}`;
    a.download = `${active.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    a.click();
  }

  const canPublish =
    active && checklist
      ? checklistComplete(checklist, active.type)
      : false;

  function toggleCheck(key: keyof ChecklistState) {
    setChecklist((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col gap-4">
      {/* Header — Fathom/Visible style */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Brief Studio</h1>
          <p className="meta mt-1">
            Assemble · review evidence · confirm · ship — like a client reporting
            pack. Decision support, not advice.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-hairline bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setPackType("weekly_money_brief")}
              className={`rounded-md px-3 py-1.5 text-[13px] ${
                packType === "weekly_money_brief"
                  ? "bg-nav-active font-medium text-ink"
                  : "text-muted"
              }`}
            >
              Weekly Money Brief
            </button>
            <button
              type="button"
              onClick={() => setPackType("client_close_pack")}
              className={`rounded-md px-3 py-1.5 text-[13px] ${
                packType === "client_close_pack"
                  ? "bg-nav-active font-medium text-ink"
                  : "text-muted"
              }`}
            >
              Client Close Pack
            </button>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void draft()}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
          >
            {busy ? "Working…" : "Draft pack"}
          </button>
          <button
            type="button"
            disabled={busy || !canPublish}
            onClick={() => void publish()}
            className="btn-dark px-4 py-2 text-sm disabled:opacity-40"
            title={
              canPublish
                ? "Publish to Stan"
                : "Complete checklist to enable publish"
            }
          >
            Confirm → Stan
          </button>
        </div>
      </div>

      {status && (
        <p className="rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-muted">
          {status}
        </p>
      )}

      {/* Metrics strip — Visible / Runway */}
      {studio && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          <Metric label="Cash" value={formatUsd(studio.metrics.totalCashCents)} />
          <Metric
            label="30d burn"
            value={formatUsd(studio.metrics.burn30Cents)}
          />
          <Metric
            label="Runway"
            value={
              studio.metrics.runwayDays != null
                ? `${studio.metrics.runwayDays}d`
                : "n/a"
            }
          />
          <Metric label="Anomalies" value={String(studio.metrics.anomalyCount)} />
          <Metric
            label="Spend rows"
            value={String(studio.metrics.spendRowCount)}
          />
          <Metric label="Risk hits" value={String(studio.metrics.riskCount)} />
        </div>
      )}

      {!active ? (
        <div className="card flex flex-1 flex-col items-start justify-center border-dashed p-8">
          <p className="text-lg font-semibold text-ink">No pack drafted yet</p>
          <p className="meta mt-2 max-w-md">
            Draft a Weekly Money Brief or Client Close Pack to pull Cash Pulse,
            anomalies, Spend Context, and External Risk into one reviewable
            studio — then ship via Stan.
          </p>
          <button
            type="button"
            onClick={() => void draft()}
            className="btn-primary mt-5 px-4 py-2 text-sm"
          >
            Draft {packType === "client_close_pack" ? "close pack" : "weekly brief"}
          </button>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[200px_minmax(0,1fr)_280px]">
          {/* Outline — Fathom */}
          <aside className="card flex flex-col p-3">
            <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Pack outline
            </p>
            <div className="flex flex-col gap-0.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSectionId(s.id)}
                  className={`flex items-start gap-2 rounded-lg px-2 py-2 text-left text-[13px] transition ${
                    activeSection?.id === s.id
                      ? "bg-nav-active font-medium text-ink"
                      : "text-muted hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDot(s.status)}`}
                  />
                  <span>
                    <span className="block">{s.label}</span>
                    <span className="mt-0.5 block text-[11px] font-normal text-muted-soft">
                      {s.summary}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {briefs.length > 1 && (
              <div className="mt-auto border-t border-hairline pt-3">
                <p className="px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Recent packs
                </p>
                {briefs.slice(0, 5).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(b.id);
                      setPackType(b.type);
                    }}
                    className={`w-full rounded-lg px-2 py-1.5 text-left text-[12px] ${
                      b.id === active.id
                        ? "bg-canvas font-medium text-ink"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {b.title}
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* Preview — Visible */}
          <section className="card flex min-h-[420px] flex-col overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-4 py-3">
              <div>
                <h2 className="text-base font-semibold text-ink">
                  {active.title}
                </h2>
                <p className="meta text-[11px]">
                  {active.type} · {new Date(active.createdAt).toLocaleString()} ·{" "}
                  {active.id}
                </p>
              </div>
              <div className="flex gap-2">
                {active.pdfBase64 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPdf((v) => !v)}
                      className="btn-secondary px-3 py-1.5 text-[12px]"
                    >
                      {showPdf ? "Section preview" : "PDF preview"}
                    </button>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      className="btn-secondary px-3 py-1.5 text-[12px]"
                    >
                      Download PDF
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {showPdf && active.pdfBase64 ? (
                <iframe
                  title="Brief PDF"
                  className="h-[560px] w-full rounded-lg border border-hairline bg-white"
                  src={`data:application/pdf;base64,${active.pdfBase64}`}
                />
              ) : activeSection ? (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {activeSection.label}
                  </p>
                  <div className="mt-3">{renderBody(activeSection.bodyMarkdown)}</div>
                </div>
              ) : (
                <p className="text-muted">Select a section.</p>
              )}
            </div>

            {(active.audioBase64 || active.audioText) && (
              <div className="border-t border-hairline bg-canvas/60 px-4 py-3">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Brief Production Studio
                </p>
                {active.audioBase64 ? (
                  <audio
                    className="w-full"
                    controls
                    src={`data:${active.mime || "audio/mpeg"};base64,${active.audioBase64}`}
                  />
                ) : (
                  <p className="text-[12px] text-muted line-clamp-3">
                    {active.audioText}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Evidence + checklist — FloQast / Numeric */}
          <aside className="flex flex-col gap-3">
            <div className="card flex-1 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Evidence
              </p>
              <p className="mt-1 text-[12px] text-muted">
                {activeSection?.label ?? "Section"} — Rho IDs & Tavily citations
              </p>

              <div className="mt-3">
                <p className="text-[11px] font-medium text-ink">Rho IDs</p>
                {activeSection?.evidence.rhoIds?.length ? (
                  <ul className="mt-1 max-h-28 space-y-1 overflow-auto">
                    {activeSection.evidence.rhoIds.map((id) => (
                      <li
                        key={id}
                        className="rounded bg-canvas px-2 py-1 font-mono text-[11px] text-muted"
                      >
                        {id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="meta mt-1 text-[11px]">None for this section</p>
                )}
              </div>

              <div className="mt-3">
                <p className="text-[11px] font-medium text-ink">Citations</p>
                {activeSection?.evidence.citations?.length ? (
                  <ul className="mt-1 max-h-36 space-y-2 overflow-auto">
                    {activeSection.evidence.citations.map((c, i) => (
                      <li key={`${c.url}-${i}`} className="text-[11px]">
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-ink underline-offset-2 hover:underline"
                        >
                          {c.title}
                        </a>
                        <p className="text-muted line-clamp-2">{c.snippet}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="meta mt-1 text-[11px]">No web citations</p>
                )}
              </div>

              {activeSection?.evidence.notes?.length ? (
                <div className="mt-3">
                  <p className="text-[11px] font-medium text-ink">Notes</p>
                  <ul className="mt-1 space-y-1">
                    {activeSection.evidence.notes.map((n) => (
                      <li key={n} className="text-[11px] text-muted">
                        • {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="card p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Close checklist
              </p>
              <p className="meta mt-1 text-[11px]">
                FloQast-style gate before Stan publish
              </p>
              {checklist && (
                <ul className="mt-3 space-y-2">
                  <Check
                    label="Cash Pulse attached"
                    checked={checklist.cashAttached}
                    locked
                  />
                  <Check
                    label="Anomalies reviewed"
                    checked={checklist.anomaliesReviewed}
                    onChange={() => toggleCheck("anomaliesReviewed")}
                  />
                  {active.type === "weekly_money_brief" && (
                    <>
                      <Check
                        label="Spend Context attached"
                        checked={checklist.spendAttached}
                        locked
                      />
                      <Check
                        label="External Risk attached"
                        checked={checklist.riskAttached}
                        locked
                      />
                    </>
                  )}
                  <Check
                    label="Audio / script ready"
                    checked={checklist.audioReady}
                    locked
                  />
                  <Check
                    label="PDF ready"
                    checked={checklist.pdfReady}
                    locked
                  />
                  <Check
                    label="I confirm — decision support only, publish to Stan"
                    checked={checklist.confirmPublish}
                    onChange={() => toggleCheck("confirmPublish")}
                  />
                </ul>
              )}
              <p className="mt-3 text-[11px] text-muted-soft">
                {canPublish
                  ? "Checklist complete — Stan publish enabled."
                  : "Publish stays locked until every required item is checked."}
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-3 py-2.5">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
  locked,
}: {
  label: string;
  checked: boolean;
  onChange?: () => void;
  locked?: boolean;
}) {
  return (
    <li className="flex items-start gap-2 text-[12px]">
      <input
        type="checkbox"
        className="mt-0.5 accent-[var(--mint)]"
        checked={checked}
        disabled={locked}
        onChange={onChange}
      />
      <span className={checked ? "text-ink" : "text-muted"}>{label}</span>
    </li>
  );
}
