import { AppShell } from "@/components/AppShell";
import { isDemoMode } from "@/lib/rho/client";

function present(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

/** Boolean-only env presence — never echo secret values. */
export default function SettingsPage() {
  const keys = [
    { label: "RHO_API_TOKEN", ok: present(process.env.RHO_API_TOKEN) },
    { label: "TAVILY_API_KEY", ok: present(process.env.TAVILY_API_KEY) },
    {
      label: "ELEVENLABS_API_KEY",
      ok: present(process.env.ELEVENLABS_API_KEY),
    },
    {
      label: "NEXT_PUBLIC_ELEVENLABS_AGENT_ID",
      ok: present(process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID),
    },
    {
      label: "STAN_PRODUCT_URL",
      ok: present(process.env.STAN_PRODUCT_URL),
    },
  ];

  const demo = isDemoMode();

  return (
    <AppShell active="/settings">
      <div className="mb-8">
        <h1 className="page-title">Settings</h1>
        <p className="meta mt-1 max-w-lg">
          Integration status for the demo. Values never leave the server as
          text — only present / missing.
        </p>
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
    </AppShell>
  );
}
