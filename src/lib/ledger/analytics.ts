import { getMerchantCatalog } from "@/lib/rho/client";
import type {
  Anomaly,
  BurnRunway,
  CashPosition,
  ConcentrationRow,
  NormalizedMerchant,
  RhoAccount,
  RhoTransaction,
} from "@/lib/types";

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function cashPosition(accounts: RhoAccount[]): CashPosition {
  return {
    accounts,
    totalCents: accounts.reduce((s, a) => s + a.balanceCents, 0),
  };
}

export function normalizeDescriptor(
  raw: string,
  catalog = getMerchantCatalog(),
): NormalizedMerchant | null {
  const upper = raw.toUpperCase();
  for (const m of catalog) {
    if (
      m.rawDescriptors.some(
        (d) =>
          upper.includes(d.toUpperCase().slice(0, 8)) ||
          upper.includes(m.displayName.toUpperCase()),
      )
    ) {
      return m;
    }
  }
  for (const m of catalog) {
    const token = m.displayName.split(" ")[0].toUpperCase();
    if (token.length > 3 && upper.includes(token)) return m;
  }
  return null;
}

export function resolveMerchant(
  tx: RhoTransaction,
  catalog = getMerchantCatalog(),
): NormalizedMerchant | null {
  if (tx.merchantKey) {
    return catalog.find((m) => m.key === tx.merchantKey) ?? null;
  }
  return normalizeDescriptor(tx.rawDescriptor, catalog);
}

export function burnAndRunway(
  transactions: RhoTransaction[],
  cashTotalCents: number,
  now = new Date(),
): BurnRunway {
  const sumOutflows = (days: number) => {
    const cutoff = now.getTime() - days * 86_400_000;
    return transactions
      .filter(
        (t) =>
          t.status === "posted" &&
          t.amountCents < 0 &&
          new Date(t.postedAt).getTime() >= cutoff,
      )
      .reduce((s, t) => s + Math.abs(t.amountCents), 0);
  };

  const burn30 = sumOutflows(30);
  const burn60 = sumOutflows(60);
  const burn90 = sumOutflows(90);
  const daily = burn30 / 30;
  const runwayDays = daily > 0 ? Math.floor(cashTotalCents / daily) : null;

  return {
    burn30Cents: burn30,
    burn60Cents: burn60,
    burn90Cents: burn90,
    dailyBurnCents: Math.round(daily),
    runwayDays,
  };
}

export function vendorConcentration(
  transactions: RhoTransaction[],
  burn30Cents: number,
  now = new Date(),
): ConcentrationRow[] {
  const cutoff = now.getTime() - 30 * 86_400_000;
  const byMerchant = new Map<string, { name: string; cents: number }>();

  for (const tx of transactions) {
    if (tx.status !== "posted" || tx.amountCents >= 0) continue;
    if (new Date(tx.postedAt).getTime() < cutoff) continue;
    const m = resolveMerchant(tx);
    const key = m?.key ?? `raw:${tx.rawDescriptor}`;
    const name = m?.displayName ?? tx.rawDescriptor;
    const prev = byMerchant.get(key) ?? { name, cents: 0 };
    prev.cents += Math.abs(tx.amountCents);
    byMerchant.set(key, prev);
  }

  return [...byMerchant.entries()]
    .map(([merchantKey, v]) => ({
      merchantKey,
      displayName: v.name,
      outflowCents: v.cents,
      pctOfBurn: burn30Cents > 0 ? (v.cents / burn30Cents) * 100 : 0,
    }))
    .sort((a, b) => b.outflowCents - a.outflowCents);
}

export function periodTransactions(
  transactions: RhoTransaction[],
  sinceDayOfMonth = 1,
  now = new Date(),
): RhoTransaction[] {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), sinceDayOfMonth),
  );
  return transactions.filter((t) => new Date(t.postedAt) >= start);
}

export function detectAnomalies(transactions: RhoTransaction[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const catalog = getMerchantCatalog();
  const posted = transactions.filter((t) => t.status === "posted" && t.amountCents < 0);

  // Status-based
  for (const tx of transactions) {
    if (tx.status === "pending") {
      anomalies.push({
        id: `anom_pending_${tx.id}`,
        kind: "pending",
        severity: "medium",
        title: `Pending · ${resolveMerchant(tx)?.displayName ?? tx.rawDescriptor}`,
        detail: "Transaction is pending - radar, not a verdict.",
        amountCents: Math.abs(tx.amountCents),
        transactionIds: [tx.id],
        merchantKey: resolveMerchant(tx)?.key,
        date: tx.postedAt,
      });
    }
    if (tx.status === "failed") {
      anomalies.push({
        id: `anom_failed_${tx.id}`,
        kind: "failed",
        severity: "high",
        title: `Failed · ${tx.rawDescriptor}`,
        detail: "Failed payment attempt on the books.",
        amountCents: Math.abs(tx.amountCents),
        transactionIds: [tx.id],
        date: tx.postedAt,
      });
    }
    if (tx.status === "awaiting_approval") {
      anomalies.push({
        id: `anom_aa_${tx.id}`,
        kind: "awaiting_approval",
        severity: "high",
        title: `Awaiting approval · ${tx.rawDescriptor}`,
        detail: "Needs review in Rho - Pilot cannot move money.",
        amountCents: Math.abs(tx.amountCents),
        transactionIds: [tx.id],
        date: tx.postedAt,
      });
    }
  }

  // First-time merchants (only one posted outflow ever)
  const byMerchant = new Map<string, RhoTransaction[]>();
  for (const tx of posted) {
    const m = resolveMerchant(tx);
    const key = m?.key ?? `raw:${tx.rawDescriptor}`;
    const list = byMerchant.get(key) ?? [];
    list.push(tx);
    byMerchant.set(key, list);
  }
  for (const [key, list] of byMerchant) {
    if (list.length === 1) {
      const tx = list[0];
      const m = catalog.find((c) => c.key === key);
      anomalies.push({
        id: `anom_first_${tx.id}`,
        kind: "first_time",
        severity: Math.abs(tx.amountCents) >= 5_000_00 ? "high" : "medium",
        title: `First-time payee · ${m?.displayName ?? tx.rawDescriptor}`,
        detail: `Raw descriptor: ${tx.rawDescriptor}. Public-context enrichment is optional - escalate in Rho.`,
        amountCents: Math.abs(tx.amountCents),
        transactionIds: [tx.id],
        merchantKey: m?.key,
        date: tx.postedAt,
      });
    }
  }

  // Spike vs merchant baseline (median of prior posted)
  for (const [key, list] of byMerchant) {
    if (list.length < 3) continue;
    const sorted = [...list].sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
    );
    const latest = sorted[0];
    const prior = sorted.slice(1).map((t) => Math.abs(t.amountCents));
    const median = prior.sort((a, b) => a - b)[Math.floor(prior.length / 2)];
    const latestAmt = Math.abs(latest.amountCents);
    if (median > 0 && latestAmt > median * 2.2) {
      const m = catalog.find((c) => c.key === key);
      anomalies.push({
        id: `anom_spike_${latest.id}`,
        kind: "spike",
        severity: "high",
        title: `Spend spike · ${m?.displayName ?? key}`,
        detail: `${formatUsd(latestAmt)} vs typical ~${formatUsd(median)} for this merchant.`,
        amountCents: latestAmt,
        transactionIds: [latest.id],
        merchantKey: m?.key,
        date: latest.postedAt,
      });
    }
  }

  const severityRank = { high: 0, medium: 1, low: 2 };
  return anomalies.sort(
    (a, b) =>
      severityRank[a.severity] - severityRank[b.severity] ||
      b.amountCents - a.amountCents,
  );
}

export function recurringPaySnapshot(transactions: RhoTransaction[]) {
  const catalog = getMerchantCatalog().filter(
    (m) => m.recurringMonthlyCents && m.recurringMonthlyCents > 0,
  );
  return catalog.map((m) => {
    const related = transactions.filter(
      (t) => resolveMerchant(t)?.key === m.key && t.amountCents < 0,
    );
    return {
      merchant: m,
      rhoAmountMonthlyCents: m.recurringMonthlyCents!,
      rhoTransactionIds: related.slice(0, 5).map((t) => t.id),
    };
  });
}
