"use client";

import Link from "next/link";
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

function statusTone(status: BriefSection["status"]) {
  if (status === "ready") return "text-ok";
  if (status === "attention") return "text-warn";
  return "text-muted-soft";
}

function renderBody(md: string) {
  const blocks = md.split("\n");
  const tableLines = blocks.filter((l) => l.startsWith("|"));
  const other = blocks.filter((l) => !l.startsWith("|"));

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-ink/90">
      {other.map((line, i) => {
        if (line.startsWith("- ")) {
          return (
            <p key={i} className="text-muted">
              <span className="mr-2 text-ink/40">•</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: inlineFormat(line.slice(2)),
                }}
              />
            </p>
          );
        }
        if (!line.trim()) return null;
        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
          />
        );
      })}
      {tableLines.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-canvas/80 p-3">
          <pre className="font-mono text-[11px] leading-5 text-muted">
            {tableLines.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}

function inlineFormat(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /\*\*(.+?)\*\*/g,
      "<strong class='font-semibold text-ink'>$1</strong>",
    )
    .replace(
      /`([^`]+)`/g,
      "<code class='rounded bg-canvas px-1 text-[12px] text-muted'>$1</code>",
    );
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
  const [showEvidence, setShowEvidence] = useState(false);

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
    setShowEvidence(false);
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
    <div className="mx-auto flex max-w-6xl flex-col">
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
          <button
            type="button"
            disabled={busy || !canPublish}
            onClick={() => void publish()}
            className="btn-dark px-4 text-sm disabled:opacity-35"
          >
            Publish to Stan
          </button>
        </div>
      </header>

      {status && (
        <p className="mt-5 rounded-[var(--radius-panel)] bg-mint-soft/50 px-4 py-3 text-sm text-ink/80">
          {status}
        </p>
      )}

      {!active ? (
        <div className="card mt-7 overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[1.2fr_0.9fr]">
            <div className="flex flex-col justify-center px-8 py-12 md:px-10 md:py-14">
              <span className="w-fit rounded-md bg-mint px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink">
                Featured
              </span>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink md:text-[1.75rem]">
                No pack yet
              </p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                Ask Pilot to draft a Monday brief, or draft a pack here. Cash,
                exceptions, and Spend Context land in one review surface.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
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
            </div>
            <div className="relative min-h-[220px] bg-[#0f1110] p-8 md:min-h-full">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1.2px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <p className="wordmark text-3xl text-white">Pilot</p>
                <div className="space-y-2">
                  {["Cash Pulse", "Spend Context", "Ready to publish"].map(
                    (label, i) => (
                      <span
                        key={label}
                        className="flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-ink shadow-sm"
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
                      ? "bg-surface font-medium text-ink ring-1 ring-hairline shadow-sm"
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
                    onClick={() => setShowEvidence((v) => !v)}
                    className="btn-secondary px-3 py-1.5 text-[12px] xl:hidden"
                  >
                    {showEvidence ? "Hide evidence" : "Evidence"}
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
                  renderBody(activeSection.bodyMarkdown)
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

              {/* Mobile evidence */}
              {showEvidence && activeSection && (
                <div className="border-t border-hairline px-5 py-4 xl:hidden">
                  <EvidenceBlock section={activeSection} />
                </div>
              )}
            </section>

            <aside className="hidden space-y-4 xl:block">
              <div className="studio-soft p-4">
                <p className="text-[12px] font-medium text-muted">Evidence</p>
                {activeSection ? (
                  <div className="mt-3">
                    <EvidenceBlock section={activeSection} />
                  </div>
                ) : null}
              </div>

              <div className="studio-soft p-4">
                <p className="text-[12px] font-medium text-muted">
                  Before you publish
                </p>
                {checklist && (
                  <ul className="mt-3 space-y-2.5">
                    <Check
                      label="Cash attached"
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
                          label="Spend context"
                          checked={checklist.spendAttached}
                          locked
                        />
                        <Check
                          label="External risk"
                          checked={checklist.riskAttached}
                          locked
                        />
                      </>
                    )}
                    <Check
                      label="Audio / PDF ready"
                      checked={checklist.audioReady && checklist.pdfReady}
                      locked
                    />
                    <Check
                      label="Confirm - not advice"
                      checked={checklist.confirmPublish}
                      onChange={() => toggleCheck("confirmPublish")}
                    />
                  </ul>
                )}
                <p className="mt-3 text-[11px] leading-snug text-muted-soft">
                  {canPublish
                    ? "Ready to publish."
                    : "Publish unlocks when the checklist is complete."}
                </p>
              </div>
            </aside>
          </div>

          {/* Checklist on smaller screens */}
          {checklist && (
            <div className="studio-soft p-5 xl:hidden">
              <p className="text-[12px] font-medium text-muted">
                Before you publish
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
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
              </ul>
            </div>
          )}
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
    <li className="flex items-start gap-2 text-[13px]">
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
