import { AppShell } from "@/components/AppShell";
import { isDemoMode } from "@/lib/rho/client";

function present(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

/** Boolean-only env presence. Never echo secret values. */
export default function SettingsPage() {
  const keys = [
    { label: "RHO_API_TOKEN", ok: present(process.env.RHO_API_TOKEN) },
    { label: "TAVILY_API_KEY", ok: present(process.env.TAVILY_API_KEY) },
    {
      label: "ELEVENLABS_API_KEY",
      ok: present(process.env.ELEVENLABS_API_KEY),
    },
    {
      label: "ELEVENLABS_VOICE_ID",
      ok: present(process.env.ELEVENLABS_VOICE_ID),
    },
    {
      label: "NEXT_PUBLIC_ELEVENLABS_AGENT_ID",
      ok: present(process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID),
    },
    {
      label: "STAN_PRODUCT_URL",
      ok: present(process.env.STAN_PRODUCT_URL),
    },
    {
      label: "TOOL_WEBHOOK_SECRET",
      ok: present(process.env.TOOL_WEBHOOK_SECRET),
    },
  ];

  const demo = isDemoMode();

  return (
    <AppShell active="/settings">
      <div className="mb-8">
        <h1 className="page-title">Settings</h1>
      </div>

      <p className="mb-6 text-[15px]">
        Ledger mode:{" "}
        <span className="font-semibold">{demo ? "Demo Mode" : "Live Rho"}</span>
      </p>

      <ul className="max-w-md divide-y divide-hairline border-y border-hairline">
        {keys.map((k) => (
          <li
            key={k.label}
            className="flex items-center justify-between gap-4 py-3.5 font-mono text-[13px]"
          >
            <span className="text-ink">{k.label}</span>
            <span
              className={
                k.ok ? "font-sans text-[13px] text-ok" : "font-sans text-[13px] text-muted"
              }
            >
              {k.ok ? "Present" : "Missing"}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-md text-[13px] leading-relaxed text-muted">
        Empty Rho token (or{" "}
        <code className="rounded bg-canvas px-1">NEXT_PUBLIC_DEMO_MODE=true</code>
        ) keeps fixtures. Restart{" "}
        <code className="rounded bg-canvas px-1">npm run dev</code> after editing{" "}
        <code className="rounded bg-canvas px-1">.env.local</code>.
      </p>
      <p className="mt-4 max-w-md text-[13px] leading-relaxed text-muted">
        ElevenLabs Agent: paste the system prompt from{" "}
        <code className="rounded bg-canvas px-1">src/lib/elevenlabs/prompt.ts</code>{" "}
        into the hosted Agent. Point server tools at{" "}
        <code className="rounded bg-canvas px-1">/api/tools/*</code> (public URL or
        tunnel). Brief TTS uses the API key; the Talk iframe uses the public Agent
        ID.
      </p>
    </AppShell>
  );
}
