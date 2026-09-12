import { AppShell } from "@/components/AppShell";
import { ExceptionsBoard } from "@/components/exceptions/ExceptionsBoard";
import { loadLedgerSnapshot } from "@/lib/ledger/snapshot";

export default async function AnomaliesPage() {
  const snap = await loadLedgerSnapshot();

  return (
    <AppShell active="/anomalies">
      <h1 className="page-title mb-7">Exceptions</h1>
      <ExceptionsBoard anomalies={snap.anomalies} />
      <p className="mt-8 text-[12px] text-muted">
        Radar only. Escalate approvals in Rho. Pilot cannot move money.
      </p>
    </AppShell>
  );
}
