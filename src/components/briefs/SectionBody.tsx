"use client";

import type { BriefSectionId } from "@/lib/briefs/studio";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(s: string) {
  return escapeHtml(s)
    .replace(
      /\*\*(.+?)\*\*/g,
      "<strong class='font-semibold text-ink'>$1</strong>",
    )
    .replace(
      /`([^`]+)`/g,
      "<code class='rounded bg-canvas px-1 text-[12px] text-muted'>$1</code>",
    )
    .replace(/\*(.+?)\*/g, "<em class='text-muted'>$1</em>");
}

function stripMd(s: string) {
  return s.replace(/\*\*/g, "").replace(/`/g, "").trim();
}

function bandClass(band: string) {
  const b = band.toLowerCase();
  if (b.includes("above") || b.includes("high")) return "danger";
  if (b.includes("below") || b.includes("low")) return "warn";
  return "";
}

function severityClass(_sev: string) {
  return "bg-[#f3f4f4] text-ink/80";
}

function parsePipeTable(md: string) {
  const lines = md.split("\n").filter((l) => l.trim().startsWith("|"));
  if (lines.length < 2) return null;
  const rows = lines
    .filter((l) => !/^\|\s*-+/.test(l.trim()))
    .map((l) =>
      l
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim()),
    )
    .filter((r) => r.length > 0);
  if (rows.length < 2) return null;
  return { headers: rows[0], body: rows.slice(1) };
}

function CashPulseBody({ md }: { md: string }) {
  const metrics: { label: string; value: string }[] = [];
  const accounts: string[] = [];
  const concentration: string[] = [];
  let mode: "main" | "concentration" = "main";

  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (/vendor concentration/i.test(line)) {
      mode = "concentration";
      continue;
    }
    const boldKv = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
    if (boldKv) {
      metrics.push({ label: boldKv[1], value: stripMd(boldKv[2]) });
      continue;
    }
    const bulletKv = line.match(/^-\s+\*\*(.+?):\*\*\s*(.+)$/);
    if (bulletKv) {
      metrics.push({ label: bulletKv[1], value: stripMd(bulletKv[2]) });
      continue;
    }
    if (line.startsWith("- ")) {
      const text = stripMd(line.slice(2));
      if (mode === "concentration") concentration.push(text);
      else accounts.push(text);
    }
  }

  return (
    <div className="space-y-5">
      {metrics.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="metric-tile">
              <p className="metric-tile-label">{m.label}</p>
              <p className="metric-tile-value">{m.value}</p>
            </div>
          ))}
        </div>
      )}
      {accounts.length > 0 && (
        <div>
          <p className="mb-2 text-[12px] font-medium text-muted">Accounts</p>
          <ul className="space-y-2">
            {accounts.map((a) => (
              <li
                key={a}
                className="rounded-xl bg-canvas/80 px-3.5 py-2.5 text-[14px] text-ink/90"
                dangerouslySetInnerHTML={{ __html: inlineFormat(a) }}
              />
            ))}
          </ul>
        </div>
      )}
      {concentration.length > 0 && (
        <div>
          <p className="mb-2 text-[12px] font-medium text-muted">
            Vendor concentration (30d)
          </p>
          <ul className="space-y-1.5">
            {concentration.map((c) => (
              <li key={c} className="flex gap-2 text-[14px] text-muted">
                <span className="text-ink/40">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AnomaliesBody({ md }: { md: string }) {
  if (/none flagged/i.test(md.trim())) {
    return <p className="text-[15px] text-muted">None flagged.</p>;
  }

  const items: {
    severity: string;
    title: string;
    amount: string;
    detail?: string;
  }[] = [];

  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(
      /^-\s+\*\*([^*]+)\*\*\s+(.+?)\s+-\s+(\$[\d,]+(?:\.\d+)?)\s*$/,
    );
    if (m) {
      const detail = lines[i + 1]?.match(/^\s{2,}(.+)/)?.[1];
      items.push({
        severity: m[1].trim(),
        title: stripMd(m[2]),
        amount: m[3],
        detail: detail ? stripMd(detail) : undefined,
      });
      if (detail) i += 1;
    }
  }

  if (!items.length) {
    return <FallbackBody md={md} />;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={`${item.title}-${i}`}
          className="grid grid-cols-1 items-start gap-3 rounded-xl border border-hairline bg-white px-3.5 py-3 sm:grid-cols-[7rem_6.5rem_minmax(0,1fr)]"
        >
          <span className="text-[15px] font-semibold tabular-nums text-ink">
            {item.amount}
          </span>
          <span
            className={`w-fit rounded-md px-2.5 py-1 text-[11px] font-medium capitalize ${severityClass(item.severity)}`}
          >
            {item.severity.toLowerCase()}
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-ink">{item.title}</p>
            {item.detail && (
              <p className="mt-0.5 text-[12px] text-muted">{item.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function SpendTableBody({ md }: { md: string }) {
  const table = parsePipeTable(md);
  if (!table) {
    if (/no spend context/i.test(md)) {
      return <p className="text-[15px] text-muted">{md.trim()}</p>;
    }
    return <FallbackBody md={md} />;
  }

  const bandIdx = table.headers.findIndex((h) => /band/i.test(h));

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[520px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-hairline bg-canvas/80">
            {table.headers.map((h) => (
              <th
                key={h}
                className="px-3.5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.body.map((row, ri) => (
            <tr key={ri} className="border-b border-hairline last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3.5 py-3 text-ink/90">
                  {ci === bandIdx ? (
                    <span
                      className={`band-pill capitalize ${bandClass(cell)}`}
                    >
                      {cell}
                    </span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RiskBody({ md }: { md: string }) {
  if (/no external risk/i.test(md.trim())) {
    return <p className="text-[15px] text-muted">{md.trim()}</p>;
  }

  const items: { name: string; headline: string }[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^-\s+\*\*(.+?):\*\*\s*(.+)$/);
    if (m) items.push({ name: m[1], headline: stripMd(m[2]) });
  }

  if (!items.length) return <FallbackBody md={md} />;

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li
          key={item.name}
          className="rounded-xl border border-hairline bg-white px-4 py-3"
        >
          <p className="text-[12px] font-medium text-muted">{item.name}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-ink/90">
            {item.headline}
          </p>
        </li>
      ))}
    </ul>
  );
}

function LabeledCardBody({
  label,
  md,
}: {
  label: string;
  md: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-white px-5 py-4">
      <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <FallbackBody md={md} />
    </div>
  );
}

function FallbackBody({ md }: { md: string }) {
  const blocks = md.split("\n");
  const table = parsePipeTable(md);
  const other = blocks.filter((l) => !l.trim().startsWith("|"));

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
      {table && (
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-hairline bg-canvas/80">
                {table.headers.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-[11px] font-medium text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.body.map((row, ri) => (
                <tr key={ri} className="border-b border-hairline last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2.5 text-ink/90">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function SectionBody({
  sectionId,
  bodyMarkdown,
}: {
  sectionId: BriefSectionId;
  bodyMarkdown: string;
}) {
  switch (sectionId) {
    case "cash_pulse":
      return <CashPulseBody md={bodyMarkdown} />;
    case "anomalies":
      return <AnomaliesBody md={bodyMarkdown} />;
    case "spend_context":
      return <SpendTableBody md={bodyMarkdown} />;
    case "external_risk":
      return <RiskBody md={bodyMarkdown} />;
    case "narrative":
      return <LabeledCardBody label="Narrative" md={bodyMarkdown} />;
    case "audio":
      return <LabeledCardBody label="Audio standup" md={bodyMarkdown} />;
    case "stan":
      return <LabeledCardBody label="Stan delivery" md={bodyMarkdown} />;
    default:
      return <FallbackBody md={bodyMarkdown} />;
  }
}
