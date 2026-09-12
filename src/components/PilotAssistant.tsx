"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VoiceCapture } from "@/components/VoiceCapture";
import {
  PILOT_PROMPTS,
  usePilotBriefing,
} from "@/hooks/usePilotBriefing";

type Tab = "chat" | "sources" | "note";

export function PilotAssistant() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const {
    input,
    setInput,
    log,
    traces,
    busy,
    lastBriefId,
    agentId,
    runToolChain,
  } = usePilotBriefing();

  useEffect(() => {
    if (searchParams.get("pilot") === "1") {
      setOpen(true);
      setTab("chat");
    }
  }, [searchParams]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`pilot-fab fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-semibold shadow-[0_8px_28px_rgba(15,23,22,0.18)] transition ${
          open
            ? "bg-ink text-white"
            : "bg-mint text-ink hover:brightness-[0.97]"
        }`}
        aria-expanded={open}
        aria-controls="pilot-assistant-panel"
      >
        {open ? "Close" : "Pilot"}
      </button>

      {open ? (
        <div
          id="pilot-assistant-panel"
          className="pilot-panel fixed bottom-24 right-6 z-50 flex w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_24px_64px_rgba(15,23,22,0.18)]"
          role="dialog"
          aria-label="Pilot assistant"
        >
          <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-ink">
                Pilot
              </p>
              <p className="text-[12px] text-muted">
                CFO-style briefing · Read-only
              </p>
            </div>
            <div className="flex rounded-lg bg-canvas p-0.5">
              {(
                [
                  ["chat", "Chat"],
                  ["sources", "Sources"],
                  ["note", "Note"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`rounded-md px-2.5 py-1.5 text-[12px] font-medium transition ${
                    tab === id
                      ? "bg-surface text-ink shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          {tab === "chat" && (
            <div className="flex min-h-0 flex-1 flex-col">
              {agentId ? (
                <iframe
                  title="ElevenLabs Agent"
                  src={`https://elevenlabs.io/app/talk-to?agent_id=${agentId}`}
                  className="h-40 w-full border-b border-hairline bg-canvas"
                  allow="microphone"
                />
              ) : null}

              <div className="max-h-[240px] flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3">
                {log.map((m, i) => {
                  const isSystem = i === 0 && m.role === "assistant";
                  if (isSystem) {
                    return (
                      <p
                        key={`${m.role}-${i}`}
                        className="rounded-lg bg-canvas px-3 py-2.5 text-[12px] leading-relaxed text-muted"
                      >
                        {m.text}
                      </p>
                    );
                  }
                  return (
                    <div
                      key={`${m.role}-${i}`}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                          m.role === "user"
                            ? "bg-mint-soft text-ink"
                            : "border border-hairline bg-surface text-ink/90"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                {busy && (
                  <p className="text-[12px] text-muted">
                    Pulling Rho and Tavily…
                  </p>
                )}
              </div>

              {lastBriefId && (
                <div className="border-t border-hairline bg-mint-soft/40 px-3.5 py-2.5">
                  <p className="text-[12px] text-ink/80">Pack ready.</p>
                  <Link
                    href="/briefs"
                    className="mt-1 inline-block text-[13px] font-semibold text-ink underline-offset-2 hover:underline"
                  >
                    Open Brief Studio →
                  </Link>
                </div>
              )}

              <div className="border-t border-hairline px-3 py-3">
                <div className="mb-2.5 flex flex-wrap gap-1.5">
                  {PILOT_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      disabled={busy}
                      onClick={() => void runToolChain(p.prompt)}
                      className="prompt-chip !min-h-8 !px-2.5 !text-[11px]"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void runToolChain(input || PILOT_PROMPTS[0].prompt);
                  }}
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="control-input !min-h-10 flex-1 !px-3 !text-[13px]"
                    placeholder="Ask Pilot…"
                    aria-label="Ask Pilot"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-icon-mint !h-10 !w-10"
                    aria-label="Send"
                  >
                    {busy ? "…" : "→"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {tab === "sources" && (
            <div className="max-h-[420px] overflow-y-auto p-3.5">
              <p className="mb-3 text-[12px] text-muted">
                Tool evidence from this session (Rho + Tavily).
              </p>
              {traces.length === 0 ? (
                <p className="rounded-lg bg-canvas px-3 py-4 text-[13px] text-muted">
                  No tools called yet. Ask something in Chat.
                </p>
              ) : (
                <ul className="space-y-2">
                  {traces.map((t) => (
                    <li
                      key={t.id}
                      className="rounded-xl border border-hairline bg-canvas/80 p-3"
                    >
                      <div className="flex justify-between gap-2 text-[13px] font-medium">
                        <span>{t.tool}</span>
                        <span className="text-[11px] font-normal text-muted">
                          {new Date(t.at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted">
                        {t.summary}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "note" && (
            <div className="max-h-[420px] overflow-y-auto p-3.5">
              <p className="mb-3 text-[12px] text-muted">
                Voice Capture adds context to the next brief.
              </p>
              <VoiceCapture />
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
