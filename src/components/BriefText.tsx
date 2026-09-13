/** Renders CFO-style brief text: sections + bullets (no full markdown). */
export function BriefText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1 text-[14px] leading-relaxed">
      {lines.map((raw, i) => {
        const line = raw.trimEnd();
        if (!line.trim()) {
          return <div key={i} className="h-1.5" />;
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <p key={i} className="flex gap-2 text-ink/90">
              <span className="shrink-0 text-ink/35">•</span>
              <span>{line.slice(2)}</span>
            </p>
          );
        }
        // Section headers: short lines without $ and not a question
        const isHeader =
          line.length < 28 &&
          !line.includes("$") &&
          !line.endsWith("?") &&
          !line.endsWith(".") &&
          /^[A-Za-z]/.test(line);
        if (isHeader) {
          return (
            <p
              key={i}
              className={`text-[12px] font-semibold uppercase tracking-wide text-muted ${
                i > 0 ? "pt-2" : ""
              }`}
            >
              {line}
            </p>
          );
        }
        return (
          <p key={i} className="text-ink/90">
            {line}
          </p>
        );
      })}
    </div>
  );
}
