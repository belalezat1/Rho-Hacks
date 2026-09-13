import { jsPDF } from "jspdf";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 54;
const MAX_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = PAGE_H - 36;
const DISCLAIMER =
  "Decision support only. Not financial, tax, legal, or investment advice. Read-only on Rho.";

function stripInline(s: string) {
  return s
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

function isTableSep(line: string) {
  return /^\|\s*-+/.test(line.trim());
}

function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .slice(1, -1)
    .map((c) => stripInline(c));
}

/** CFO letterhead PDF from markdown-ish brief text. */
export function markdownToPdfBase64(title: string, markdown: string): string {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let y = MARGIN;
  let page = 1;

  function drawFooter() {
    doc.setDrawColor(210, 214, 212);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, FOOTER_Y - 10, PAGE_W - MARGIN, FOOTER_Y - 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 126, 124);
    doc.text(DISCLAIMER, MARGIN, FOOTER_Y);
    doc.text(`Page ${page}`, PAGE_W - MARGIN, FOOTER_Y, { align: "right" });
    doc.setTextColor(0, 0, 0);
  }

  function ensureSpace(needed: number) {
    if (y + needed > FOOTER_Y - 24) {
      drawFooter();
      doc.addPage();
      page += 1;
      y = MARGIN;
    }
  }

  function hairline() {
    ensureSpace(16);
    doc.setDrawColor(210, 214, 212);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 14;
  }

  // Letterhead
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Pilot", MARGIN, y);
  y += 22;

  doc.setFontSize(13);
  doc.text(title, MARGIN, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 96, 94);
  doc.text("Northstar Co.", MARGIN, y);
  doc.text(dateStr, PAGE_W - MARGIN, y, { align: "right" });
  y += 12;
  doc.text("Read-only · Decision support", MARGIN, y);
  doc.setTextColor(0, 0, 0);
  y += 10;
  hairline();

  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // Skip duplicate H1 matching title
    if (/^#\s+/.test(line)) {
      i += 1;
      continue;
    }

    // Markdown table block
    if (line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i += 1;
      }
      const rows = tableLines
        .filter((l) => !isTableSep(l))
        .map(parseTableRow)
        .filter((r) => r.length > 0);
      if (rows.length) {
        renderTable(doc, rows, () => {
          ensureSpace(18);
          return y;
        }, (ny) => {
          y = ny;
        }, MAX_W, MARGIN);
      }
      continue;
    }

    // H2 / H3 section titles
    if (/^##\s+/.test(line)) {
      const heading = stripInline(line.replace(/^#+\s*/, ""));
      ensureSpace(28);
      y += 6;
      hairline();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(heading.toUpperCase(), MARGIN, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      i += 1;
      continue;
    }

    if (/^###\s+/.test(line)) {
      const heading = stripInline(line.replace(/^#+\s*/, ""));
      ensureSpace(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(heading, MARGIN, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      i += 1;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      hairline();
      i += 1;
      continue;
    }

    // Empty
    if (!line.trim()) {
      y += 6;
      i += 1;
      continue;
    }

    // Bullet / severity anomaly line
    const bullet = line.match(/^\s*-\s+(.*)$/);
    if (bullet) {
      const content = stripInline(bullet[1]);
      const sev = content.match(/^(HIGH|MEDIUM|LOW)\b/i);
      const indent = line.match(/^\s*/)?.[0].length ?? 0;
      const x = MARGIN + (indent > 1 ? 14 : 0);
      const wrapped = doc.splitTextToSize(
        content,
        MAX_W - (indent > 1 ? 14 : 0) - 10,
      );
      ensureSpace(wrapped.length * 13 + 2);
      if (sev) {
        const level = sev[1].toUpperCase();
        if (level === "HIGH") doc.setTextColor(201, 24, 41);
        else if (level === "MEDIUM") doc.setTextColor(154, 91, 18);
        else doc.setTextColor(90, 96, 94);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(level, x, y);
        const sw = doc.getTextWidth(level + " ");
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        const rest = content.slice(sev[0].length).trim();
        const restWrap = doc.splitTextToSize(rest, MAX_W - sw - 10);
        doc.text(restWrap[0] ?? "", x + sw, y);
        y += 13;
        for (let wi = 1; wi < restWrap.length; wi++) {
          ensureSpace(13);
          doc.text(restWrap[wi], x + sw, y);
          y += 13;
        }
      } else {
        doc.setFontSize(10);
        doc.text("•", x, y);
        for (const w of wrapped) {
          ensureSpace(13);
          doc.text(w, x + 12, y);
          y += 13;
        }
      }
      i += 1;
      continue;
    }

    // Body paragraph
    const cleaned = stripInline(line.replace(/^#+\s*/, ""));
    const wrapped = doc.splitTextToSize(cleaned || " ", MAX_W);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const w of wrapped) {
      ensureSpace(13);
      doc.text(w, MARGIN, y);
      y += 13;
    }
    i += 1;
  }

  drawFooter();

  const dataUri = doc.output("datauristring");
  return dataUri.split(",")[1] ?? "";
}

function renderTable(
  doc: jsPDF,
  rows: string[][],
  getY: () => number,
  setY: (y: number) => void,
  maxW: number,
  margin: number,
) {
  const cols = Math.max(...rows.map((r) => r.length));
  const colW = maxW / cols;
  const header = rows[0];
  const body = rows.slice(1);

  let y = getY();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setFillColor(243, 244, 244);
  doc.rect(margin, y - 10, maxW, 16, "F");
  for (let c = 0; c < cols; c++) {
    const cell = header[c] ?? "";
    doc.text(doc.splitTextToSize(cell, colW - 8)[0] ?? "", margin + c * colW + 4, y);
  }
  y += 14;
  setY(y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const row of body) {
    y = getY();
    // Measure row height
    let rowH = 14;
    const cellLines: string[][] = [];
    for (let c = 0; c < cols; c++) {
      const lines = doc.splitTextToSize(row[c] ?? "", colW - 8);
      cellLines.push(lines);
      rowH = Math.max(rowH, lines.length * 11 + 4);
    }
    if (y + rowH > FOOTER_Y - 24) {
      // force page via ensure by bumping - caller getY uses ensureSpace
      setY(FOOTER_Y);
      y = getY();
    }
    for (let c = 0; c < cols; c++) {
      let cy = y;
      for (const ln of cellLines[c]) {
        doc.text(ln, margin + c * colW + 4, cy);
        cy += 11;
      }
    }
    y += rowH;
    doc.setDrawColor(230, 232, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, y - 4, margin + maxW, y - 4);
    setY(y);
  }
  setY(getY() + 6);
}
