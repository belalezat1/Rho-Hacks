import type { ToolTrace } from "@/lib/types";

const globalStore = globalThis as unknown as {
  __rhopilotTraces?: ToolTrace[];
  __rhopilotVoiceNote?: string;
  __rhopilotBriefs?: unknown[];
};

export function pushTrace(tool: string, summary: string, payload: unknown): ToolTrace {
  const trace: ToolTrace = {
    id: `trace_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    tool,
    at: new Date().toISOString(),
    summary,
    payload,
  };
  if (!globalStore.__rhopilotTraces) globalStore.__rhopilotTraces = [];
  globalStore.__rhopilotTraces.unshift(trace);
  globalStore.__rhopilotTraces = globalStore.__rhopilotTraces.slice(0, 40);
  return trace;
}

export function listTraces(): ToolTrace[] {
  return globalStore.__rhopilotTraces ?? [];
}

export function setVoiceNote(text: string) {
  globalStore.__rhopilotVoiceNote = text;
}

export function getVoiceNote(): string | undefined {
  return globalStore.__rhopilotVoiceNote;
}

export function saveBrief(brief: unknown) {
  if (!globalStore.__rhopilotBriefs) globalStore.__rhopilotBriefs = [];
  globalStore.__rhopilotBriefs.unshift(brief);
  globalStore.__rhopilotBriefs = globalStore.__rhopilotBriefs.slice(0, 20);
}

export function listBriefs(): unknown[] {
  return globalStore.__rhopilotBriefs ?? [];
}
