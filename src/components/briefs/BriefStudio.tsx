"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionBody } from "@/components/briefs/SectionBody";
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

function statusTone(status: BriefSection["status"]) {
  if (status === "ready") return "text-ok";
  if (status === "attention") return "text-warn";
  return "text-muted-soft";
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
  const [showSources, setShowSources] = useState(false);

  const active = useMemo(
    () =>
      (selectedId ? briefs.find((b) => b.id === selectedId) : briefs[0]) ?? null,
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
    setShowSources(false);
    setShowPdf(false);
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function draft() {
    setBusy(true);
    setStatus("Assembling pack…");
    try {
      const res = await fetch("/api/tools/generate_brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: packType }),
      });
      const data = await res.json();
      await refresh();
      if (data.brief?.id) setSelectedId(data.brief.id);
      setStatus("Draft ready - review sections, then confirm to publish.");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!active || !checklist) return;
    if (!checklistComplete(checklist, active.type)) {
      setStatus("Finish the checklist before publishing to Stan.");
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
      setStatus(`Stan link ready: ${data.stanUrl}`);
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
    active && checklist ? checklistComplete(checklist, active.type) : false;

  function toggleCheck(key: keyof ChecklistState) {
    setChecklist((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col pb-28">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="page-title">Brief Studio</h1>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-[var(--radius-control)] border border-hairline bg-canvas p-1">
            <button
              type="button"
              onClick={() => setPackType("weekly_money_brief")}
              className={`rounded-[8px] px-3.5 py-2 text-[13px] transition ${
                packType === "weekly_money_brief"
                  ? "bg-surface font-medium text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Weekly brief
            </button>
            <button
              type="button"
              onClick={() => setPackType("client_close_pack")}
              className={`rounded-[8px] px-3.5 py-2 text-[13px] transition ${
                packType === "client_close_pack"
                  ? "bg-surface font-medium text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Close pack
            </button>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void draft()}
            className="btn-primary px-4 text-sm disabled:opacity-60"
          >
            {busy ? "Working…" : "Draft"}
          </button>
        </div>
      </header>

      {status && (
        <p className="mt-5 rounded-[var(--radius-panel)] bg-mint-soft/50 px-4 py-3 text-sm text-ink/80">
          {status}
        </p>
      )}

      {!active ? (
        <div className="card mt-7 flex min-h-[calc(100vh-11rem)] overflow-hidden">
          <div className="grid min-h-full w-full flex-1 gap-0 md:grid-cols-[1.15fr_0.95fr]">
            <div className="flex flex-col justify-center px-8 py-14 md:px-12 md:py-16">
              <span className="w-fit rounded-md bg-mint px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink">
                Featured
              </span>
              <p className="mt-5 text-2xl font-semibold tracking-tight text-ink md:text-[1.85rem]">
                No pack yet
              </p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                Ask Pilot to draft a Monday brief, or draft a pack here. Cash,
                exceptions, and Spend Context land in one review surface.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <Link
                  href="/cash-pulse?pilot=1"
                  className="btn-primary px-5 text-sm"
                >
                  Talk to Pilot
                </Link>
                <button
                  type="button"
                  onClick={() => void draft()}
                  className="btn-secondary px-5 text-sm"
                >
                  Draft pack here
                </button>
              </div>
              <ul className="mt-10 space-y-2 text-[13px] text-muted">
                <li>Cash Pulse and burn attached from Rho</li>
                <li>Exceptions + Spend Context in one review</li>
                <li>Publish to Stan when the checklist is done</li>
              </ul>
            </div>
            <div className="relative min-h-[280px] bg-[#0f1110] p-8 md:min-h-full md:p-10">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1.2px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative flex h-full min-h-[280px] flex-col justify-between md:min-h-full">
                <p className="wordmark text-5xl text-white md:text-6xl lg:text-7xl">
                  Pilot
                </p>
                <div className="space-y-3">
                  {["Cash Pulse", "Spend Context", "Ready to publish"].map(
                    (label, i) => (
                      <span
                        key={label}
                        className="flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-ink shadow-sm"
                        style={{
                          transform: `rotate(${i === 1 ? -2 : i === 2 ? 1.5 : 0}deg)`,
                        }}
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ok text-[10px] text-white">
                          ✓
                        </span>
                        {label}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 flex flex-col gap-6">
          {studio && (
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <QuietStat
                label="Cash"
                value={formatUsd(studio.metrics.totalCashCents)}
              />
              <QuietStat
                label="Burn"
                value={formatUsd(studio.metrics.burn30Cents)}
              />
              <QuietStat
                label="Runway"
                value={
                  studio.metrics.runwayDays != null
                    ? `${studio.metrics.runwayDays}d`
                    : "n/a"
                }
              />
              <QuietStat
                label="Flags"
                value={String(studio.metrics.anomalyCount)}
              />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)_240px]">
            <aside className="space-y-1">
              <p className="mb-3 text-[12px] font-medium text-muted">Sections</p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSectionId(s.id)}
                  className={`flex w-full flex-col rounded-[var(--radius-control)] px-3 py-2.5 text-left transition ${
                    activeSection?.id === s.id
                      ? "bg-surface font-medium text-ink shadow-sm ring-1 ring-hairline"
                      : "text-muted hover:bg-surface/70 hover:text-ink"
                  }`}
                >
                  <span className="text-[14px]">{s.label}</span>
                  <span
                    className={`mt-0.5 text-[12px] font-normal ${statusTone(s.status)}`}
                  >
                    {s.summary}
                  </span>
                </button>
              ))}
            </aside>

            <section className="studio-panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4">
                <div>
                  <h2 className="text-[17px] font-semibold tracking-tight">
                    {activeSection?.label ?? active.title}
                  </h2>
                  <p className="meta mt-0.5 text-[12px]">
                    {active.title} ·{" "}
                    {new Date(active.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSources(true)}
                    className="btn-secondary px-3 py-1.5 text-[12px] xl:hidden"
                  >
                    Sources
                  </button>
                  {active.pdfBase64 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowPdf((v) => !v)}
                        className="btn-secondary px-3 py-1.5 text-[12px]"
                      >
                        {showPdf ? "Section" : "PDF"}
                      </button>
                      <button
                        type="button"
                        onClick={downloadPdf}
                        className="btn-secondary px-3 py-1.5 text-[12px]"
                      >
                        Download
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="min-h-[320px] px-5 py-6">
                {showPdf && active.pdfBase64 ? (
                  <iframe
                    title="Brief PDF"
                    className="h-[480px] w-full rounded-xl bg-white"
                    src={`data:application/pdf;base64,${active.pdfBase64}`}
                  />
                ) : activeSection ? (
                  <SectionBody
                    sectionId={activeSection.id}
                    bodyMarkdown={activeSection.bodyMarkdown}
                  />
                ) : (
                  <p className="text-muted">Select a section.</p>
                )}
              </div>

              {(active.audioBase64 || active.audioText) && (
                <div className="border-t border-hairline px-5 py-4">
                  <p className="mb-2 text-[12px] font-medium text-muted">
                    Audio standup
                  </p>
                  {active.audioBase64 ? (
                    <audio
                      className="w-full"
                      controls
                      src={`data:${active.mime || "audio/mpeg"};base64,${active.audioBase64}`}
                    />
                  ) : (
                    <p className="line-clamp-2 text-[13px] text-muted">
                      {active.audioText}
                    </p>
                  )}
                </div>
              )}
            </section>

            <aside className="hidden space-y-4 xl:block">
              <div className="studio-soft p-4">
                <p className="text-[12px] font-medium text-muted">Sources</p>
                {activeSection ? (
                  <div className="mt-3">
                    <EvidenceBlock section={activeSection} />
                  </div>
                ) : null}
              </div>

              {checklist && (
                <div className="studio-soft p-4">
                  <p className="text-[12px] font-medium text-muted">Readiness</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <ReadyChip
                      label="Cash"
                      ok={checklist.cashAttached}
                    />
                    {active.type === "weekly_money_brief" && (
                      <>
                        <ReadyChip
                          label="Spend"
                          ok={checklist.spendAttached}
                        />
                        <ReadyChip
                          label="Risk"
                          ok={checklist.riskAttached}
                        />
                      </>
                    )}
                    <ReadyChip
                      label="Audio / PDF"
                      ok={checklist.audioReady && checklist.pdfReady}
                    />
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}

      {showSources && activeSection && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-ink/20 xl:hidden"
          onClick={() => setShowSources(false)}
          role="presentation"
        >
          <aside
            className="flex h-full w-full max-w-sm flex-col bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Sources"
          >
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <p className="text-[15px] font-semibold text-ink">Sources</p>
              <button
                type="button"
                onClick={() => setShowSources(false)}
                className="btn-secondary px-3 py-1.5 text-[12px]"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <EvidenceBlock section={activeSection} />
            </div>
          </aside>
        </div>
      )}

      {active && checklist && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-8 py-3.5 sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Check
                label="Anomalies reviewed"
                checked={checklist.anomaliesReviewed}
                onChange={() => toggleCheck("anomaliesReviewed")}
              />
              <Check
                label="Confirm - not advice"
                checked={checklist.confirmPublish}
                onChange={() => toggleCheck("confirmPublish")}
              />
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden text-[12px] text-muted sm:block">
                {canPublish
                  ? "Ready to publish."
                  : "Complete checks to unlock."}
              </p>
              <button
                type="button"
                disabled={busy || !canPublish}
                onClick={() => void publish()}
                className="btn-dark px-5 text-sm disabled:opacity-35"
              >
                Publish to Stan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuietStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-muted">{label}</p>
      <p className="mt-0.5 text-[16px] font-semibold tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

function ReadyChip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-[11px] font-medium ${
        ok ? "bg-mint-soft text-ink" : "bg-canvas text-muted-soft"
      }`}
    >
      {ok ? "✓ " : ""}
      {label}
    </span>
  );
}

function EvidenceBlock({ section }: { section: BriefSection }) {
  return (
    <div className="space-y-3 text-[12px]">
      <div>
        <p className="font-medium text-ink">Rho IDs</p>
        {section.evidence.rhoIds.length ? (
          <ul className="mt-1 max-h-24 space-y-1 overflow-auto">
            {section.evidence.rhoIds.slice(0, 6).map((id) => (
              <li key={id} className="font-mono text-muted">
                {id}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-muted-soft">None</p>
        )}
      </div>
      <div>
        <p className="font-medium text-ink">Citations</p>
        {section.evidence.citations.length ? (
          <ul className="mt-1 max-h-28 space-y-2 overflow-auto">
            {section.evidence.citations.slice(0, 4).map((c, i) => (
              <li key={`${c.url}-${i}`}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink underline-offset-2 hover:underline"
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-muted-soft">None</p>
        )}
      </div>
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
    <label className="flex cursor-pointer items-start gap-2 text-[13px]">
      <input
        type="checkbox"
        className="mt-0.5 accent-[var(--mint)]"
        checked={checked}
        disabled={locked}
        onChange={onChange}
      />
      <span className={checked ? "text-ink" : "text-muted"}>{label}</span>
    </label>
  );
}
