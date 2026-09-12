import { jsPDF } from "jspdf";

/** Build a simple multi-page PDF from markdown-ish brief text. */
export function markdownToPdfBase64(title: string, markdown: string): string {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 48;
  const maxWidth = 612 - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 20 + 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const lines = markdown.split("\n");
  for (const line of lines) {
    const cleaned = line
      .replace(/^#+\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "");
    const wrapped = doc.splitTextToSize(cleaned || " ", maxWidth);
    for (const w of wrapped) {
      if (y > 720) {
        doc.addPage();
        y = margin;
      }
      doc.text(w, margin, y);
      y += 13;
    }
  }

  const dataUri = doc.output("datauristring");
  const base64 = dataUri.split(",")[1] ?? "";
  return base64;
}
