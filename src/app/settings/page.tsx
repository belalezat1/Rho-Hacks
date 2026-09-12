import { AppShell } from "@/components/AppShell";
import { isDemoMode } from "@/lib/rho/client";

export default function SettingsPage() {
  const demo = isDemoMode();
  return (
    <AppShell active="/settings">
      <h1 className="page-title">Settings</h1>
      <p className="meta mt-1">
        Keys stay server-side. Never commit secrets. Demo Mode runs without Rho/Tavily/ElevenLabs.
      </p>
      <div className="card mt-5 space-y-4 p-5 text-sm">
        <p>
          <span className="font-medium">Mode:</span>{" "}
          {demo ? "Demo Mode (sample Rho-shaped ledger)" : "Live credentials detected"}
        </p>
        <p>
          <span className="font-medium">Persona:</span> Founder (Talk) · Accountant (Close Pack)
        </p>
        <p className="meta">
          Configure via <code className="font-mono">.env.local</code> using{" "}
          <code className="font-mono">.env.example</code>.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-muted">
          <li>RHO_API_TOKEN — optional; empty keeps Demo Mode</li>
          <li>TAVILY_API_KEY — live Spend Context citations</li>
          <li>ELEVENLABS_API_KEY / VOICE_ID / AGENT_ID — TTS + voice agent</li>
          <li>STAN_PRODUCT_URL — guided publish destination</li>
        </ul>
      </div>
    </AppShell>
  );
}
