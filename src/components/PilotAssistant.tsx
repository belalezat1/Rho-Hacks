"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BriefText } from "@/components/BriefText";
import { ElevenLabsConvaiEmbed } from "@/components/ElevenLabsConvaiEmbed";
import { VoiceCapture } from "@/components/VoiceCapture";
import {
  PILOT_PROMPTS,
  usePilotBriefing,
} from "@/hooks/usePilotBriefing";

type Tab = "chat" | "voice" | "sources" | "note";

export function PilotAssistant() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("voice");
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
      setTab("voice");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pilot-fab fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-full bg-mint px-10 py-5 text-[18px] font-semibold text-ink shadow-[0_12px_40px_rgba(15,23,22,0.22)] transition hover:brightness-[0.97]"
        aria-expanded={open}
        aria-controls="pilot-assistant-panel"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[13px] text-white"
          aria-hidden
        >
          ✦
        </span>
        Ask Pilot
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            aria-label="Close Pilot"
            onClick={() => setOpen(false)}
          />
          <div
            id="pilot-assistant-panel"
            className="pilot-modal relative z-10 flex w-[75vw] max-w-[1200px] flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_32px_80px_rgba(15,23,22,0.28)] max-md:w-[min(96vw,720px)]"
            style={{ height: "75vh", minHeight: "min(92vh, 520px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Pilot assistant"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <p className="text-[17px] font-semibold tracking-tight text-ink">
                  Pilot
                </p>
                <p className="text-[12px] text-muted">Read-only on Rho</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg bg-canvas p-0.5">
                  {(
                    [
                      ["voice", "Voice"],
                      ["chat", "Chat"],
                      ["sources", "Sources"],
                      ["note", "Note"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTab(id)}
                      className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition ${
                        tab === id
                          ? "bg-surface text-ink shadow-sm"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col">
              {tab === "chat" && (
                <>
                  <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
                    {log.map((m, i) => {
                      const isSystem = i === 0 && m.role === "assistant";
                      if (isSystem) {
                        return (
                          <p
                            key={`${m.role}-${i}`}
                            className="rounded-lg bg-[#f3f4f4] px-3.5 py-3 text-[13px] leading-relaxed text-muted"
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
                            className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                              m.role === "user"
                                ? "bg-mint-soft text-ink"
                                : "border border-hairline bg-surface text-ink/90"
                            }`}
                          >
                            {m.role === "assistant" ? (
                              <BriefText text={m.text} />
                            ) : (
                              m.text
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {busy && (
                      <p className="text-[13px] text-muted">
                        Pulling Rho and Tavily…
                      </p>
                    )}
                  </div>

                  {lastBriefId && (
                    <div className="shrink-0 border-t border-hairline bg-mint-soft/40 px-5 py-3">
                      <p className="text-[13px] text-ink/80">Pack ready.</p>
                      <Link
                        href="/briefs"
                        className="mt-1 inline-block text-[14px] font-semibold text-ink underline-offset-2 hover:underline"
                      >
                        Open Brief Studio
                      </Link>
                    </div>
                  )}

                  <div className="shrink-0 border-t border-hairline px-5 py-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {PILOT_PROMPTS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          disabled={busy}
                          onClick={() => void runToolChain(p.prompt)}
                          className="prompt-chip"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <form
                      className="flex items-center gap-2.5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void runToolChain(input || PILOT_PROMPTS[0].prompt);
                      }}
                    >
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="control-input flex-1 text-[15px]"
                        placeholder="Ask about cash, spend, exceptions, or a brief…"
                        aria-label="Ask Pilot"
                      />
                      <button
                        type="submit"
                        disabled={busy}
                        className="btn-icon-mint"
                        aria-label="Send"
                      >
                        {busy ? "…" : "→"}
                      </button>
                    </form>
                  </div>
                </>
              )}

              {tab === "voice" && (
                <div className="flex min-h-0 flex-1 flex-col p-5">
                  {agentId ? (
                    <ElevenLabsConvaiEmbed agentId={agentId} />
                  ) : (
                    <div className="flex flex-1 flex-col items-start justify-center rounded-xl bg-[#f3f4f4] px-8 py-10">
                      <p className="text-[17px] font-semibold tracking-tight text-ink">
                        Voice briefing
                      </p>
                      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted">
                        Add{" "}
                        <code className="rounded bg-canvas px-1 text-[12px]">
                          NEXT_PUBLIC_ELEVENLABS_AGENT_ID
                        </code>{" "}
                        and{" "}
                        <code className="rounded bg-canvas px-1 text-[12px]">
                          ELEVENLABS_API_KEY
                        </code>{" "}
                        to{" "}
                        <code className="rounded bg-canvas px-1 text-[12px]">
                          .env.local
                        </code>
                        , then restart the dev server. Until then, use Chat for
                        tools or Note for a transcript.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() => setTab("chat")}
                          className="btn-primary px-5 text-[14px]"
                        >
                          Open Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => setTab("note")}
                          className="btn-secondary px-5 text-[14px]"
                        >
                          Open Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "sources" && (
                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  <p className="mb-3 text-[13px] text-muted">
                    Tool evidence from this session (Rho and Tavily).
                  </p>
                  {traces.length === 0 ? (
                    <p className="rounded-xl bg-[#f3f4f4] px-4 py-8 text-center text-[14px] text-muted">
                      No tools called yet. Ask something in Chat.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {traces.map((t) => (
                        <li
                          key={t.id}
                          className="rounded-xl border border-hairline bg-[#f3f4f4]/80 p-3.5"
                        >
                          <div className="flex justify-between gap-2 text-[14px] font-medium">
                            <span>{t.tool}</span>
                            <span className="text-[12px] font-normal text-muted">
                              {new Date(t.at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] leading-relaxed text-muted">
                            {t.summary}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {tab === "note" && (
                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  <p className="mb-3 text-[13px] text-muted">
                    Adds context to the next brief.
                  </p>
                  <VoiceCapture />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
