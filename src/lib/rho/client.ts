import { DEMO_ACCOUNTS, DEMO_MERCHANTS, DEMO_TRANSACTIONS } from "@/lib/rho/demo-data";
import type { RhoAccount, RhoTransaction } from "@/lib/types";

export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  return !process.env.RHO_API_TOKEN;
}

function rhoBase(): string {
  return (process.env.RHO_API_BASE_URL || "https://api.rho.co").replace(/\/$/, "");
}

/**
 * Best-effort live Rho REST. Shape varies by Rho API version — on any failure
 * we fall back to demo fixtures so the hackathon demo never blanks.
 */
async function fetchRhoJson<T>(path: string): Promise<T | null> {
  const token = process.env.RHO_API_TOKEN?.trim();
  if (!token) return null;
  try {
    const res = await fetch(`${rhoBase()}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function normalizeAccounts(raw: unknown): RhoAccount[] | null {
  if (!raw || typeof raw !== "object") return null;
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { accounts?: unknown }).accounts)
      ? (raw as { accounts: unknown[] }).accounts
      : Array.isArray((raw as { data?: unknown }).data)
        ? (raw as { data: unknown[] }).data
        : null;
  if (!list?.length) return null;

  const out: RhoAccount[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const id = String(o.id ?? o.account_id ?? "");
    if (!id) continue;
    const balance =
      typeof o.balanceCents === "number"
        ? o.balanceCents
        : typeof o.balance_cents === "number"
          ? o.balance_cents
          : typeof o.available_balance === "number"
            ? Math.round(Number(o.available_balance) * 100)
            : typeof o.balance === "number"
              ? Math.round(Number(o.balance) * 100)
              : null;
    if (balance == null) continue;
    const typeRaw = String(o.type ?? o.account_type ?? "checking");
    const type =
      typeRaw === "savings" || typeRaw === "treasury" ? typeRaw : "checking";
    out.push({
      id,
      name: String(o.name ?? o.nickname ?? id),
      type,
      balanceCents: balance,
      currency: "USD",
    });
  }
  return out.length ? out : null;
}

function normalizeTransactions(raw: unknown): RhoTransaction[] | null {
  if (!raw || typeof raw !== "object") return null;
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { transactions?: unknown }).transactions)
      ? (raw as { transactions: unknown[] }).transactions
      : Array.isArray((raw as { data?: unknown }).data)
        ? (raw as { data: unknown[] }).data
        : null;
  if (!list?.length) return null;

  const out: RhoTransaction[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const id = String(o.id ?? o.transaction_id ?? "");
    if (!id) continue;
    const amount =
      typeof o.amountCents === "number"
        ? o.amountCents
        : typeof o.amount_cents === "number"
          ? o.amount_cents
          : typeof o.amount === "number"
            ? Math.round(Number(o.amount) * 100)
            : null;
    if (amount == null) continue;
    out.push({
      id,
      accountId: String(o.accountId ?? o.account_id ?? "unknown"),
      postedAt: String(o.postedAt ?? o.posted_at ?? o.date ?? new Date().toISOString()),
      amountCents: amount,
      currency: "USD",
      rawDescriptor: String(
        o.rawDescriptor ?? o.descriptor ?? o.memo ?? o.description ?? id,
      ),
      merchantKey:
        typeof o.merchantKey === "string"
          ? o.merchantKey
          : typeof o.merchant_key === "string"
            ? o.merchant_key
            : undefined,
      type: "other",
      status: "posted",
      memo: typeof o.memo === "string" ? o.memo : undefined,
    });
  }
  return out.length ? out : null;
}

export async function getAccounts(): Promise<RhoAccount[]> {
  if (isDemoMode()) return DEMO_ACCOUNTS;
  const live = await fetchRhoJson<unknown>("/v1/accounts");
  return normalizeAccounts(live) ?? DEMO_ACCOUNTS;
}

export async function getTransactions(): Promise<RhoTransaction[]> {
  if (isDemoMode()) return DEMO_TRANSACTIONS;
  const live = await fetchRhoJson<unknown>("/v1/transactions");
  return normalizeTransactions(live) ?? DEMO_TRANSACTIONS;
}

export function getMerchantCatalog() {
  return DEMO_MERCHANTS;
}
