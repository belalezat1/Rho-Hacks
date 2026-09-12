"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

type Brief = {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  markdown: string;
  audioText: string;
  stanUrl: string;
  audioBase64?: string;
  mime?: string;
  pdfBase64?: string;
};

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/api/session");
    const data = await res.json();
    setBriefs(data.briefs ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function draft(type: "weekly_money_brief" | "client_close_pack") {
    setStatus("Drafting…");
    await fetch("/api/tools/generate_brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    await refresh();
    setStatus("Draft ready — confirm publish when you want the Stan link.");
  }

  async function publish(briefId: string) {
    const res = await fetch("/api/tools/publish_to_stan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmed: true, briefId }),
    });
    const data = await res.json();
    setStatus(`Guided Stan publish: ${data.stanUrl}`);
    window.open(data.stanUrl, "_blank", "noopener,noreferrer");
  }

  function downloadPdf(b: Brief) {
    if (!b.pdfBase64) return;
    const a = document.createElement("a");
    a.href = `data:application/pdf;base64,${b.pdfBase64}`;
    a.download = `${b.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    a.click();
  }

  return (
    <AppShell active="/briefs">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Briefs</h1>
          <p className="meta mt-1">
            Weekly Money Brief and Client Close Pack — confirm before Stan publish.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void draft("weekly_money_brief")}
            className="btn-primary px-4 py-2 text-sm"
          >
            Draft weekly brief
          </button>
          <button
            type="button"
            onClick={() => void draft("client_close_pack")}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Draft close pack
          </button>
        </div>
      </div>
      {status && <p className="mb-4 text-sm text-muted">{status}</p>}
      <ul className="space-y-4">
        {briefs.length === 0 && (
          <li className="card border-dashed p-6 text-muted">
            No briefs yet. Draft one to include Spend Context + External Risk.
          </li>
        )}
        {briefs.map((b) => (
          <li key={b.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{b.title}</h2>
                <p className="meta text-xs">
                  {b.type} · {new Date(b.createdAt).toLocaleString()} · {b.id}
                </p>
              </div>
              <div className="flex gap-2">
                {b.pdfBase64 && (
                  <button
                    type="button"
                    onClick={() => downloadPdf(b)}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Download PDF
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void publish(b.id)}
                  className="btn-dark px-4 py-2 text-sm"
                >
                  Confirm → Stan
                </button>
              </div>
            </div>
            {b.audioBase64 && (
              <audio
                className="mt-3 w-full"
                controls
                src={`data:${b.mime || "audio/mpeg"};base64,${b.audioBase64}`}
              />
            )}
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-canvas p-4 text-xs leading-relaxed text-muted">
              {b.markdown}
            </pre>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
