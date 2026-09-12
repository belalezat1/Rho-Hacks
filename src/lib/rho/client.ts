import { DEMO_ACCOUNTS, DEMO_MERCHANTS, DEMO_TRANSACTIONS } from "@/lib/rho/demo-data";
import type { RhoAccount, RhoTransaction } from "@/lib/types";

export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  return !process.env.RHO_API_TOKEN;
}

export async function getAccounts(): Promise<RhoAccount[]> {
  if (isDemoMode()) return DEMO_ACCOUNTS;
  // Live Rho REST would go here; fall back to demo if unset.
  return DEMO_ACCOUNTS;
}

export async function getTransactions(): Promise<RhoTransaction[]> {
  if (isDemoMode()) return DEMO_TRANSACTIONS;
  return DEMO_TRANSACTIONS;
}

export function getMerchantCatalog() {
  return DEMO_MERCHANTS;
}
