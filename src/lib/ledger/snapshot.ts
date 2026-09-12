import {
  burnAndRunway,
  cashPosition,
  detectAnomalies,
  periodTransactions,
  recurringPaySnapshot,
  vendorConcentration,
} from "@/lib/ledger/analytics";
import { getAccounts, getTransactions, isDemoMode } from "@/lib/rho/client";

export async function loadLedgerSnapshot() {
  const accounts = await getAccounts();
  const transactions = await getTransactions();
  const cash = cashPosition(accounts);
  const burn = burnAndRunway(transactions, cash.totalCents);
  const concentration = vendorConcentration(transactions, burn.burn30Cents);
  const anomalies = detectAnomalies(transactions);
  const sinceFirst = periodTransactions(transactions, 1);
  const recurrings = recurringPaySnapshot(transactions);

  return {
    demoMode: isDemoMode(),
    accounts,
    transactions,
    cash,
    burn,
    concentration,
    anomalies,
    periodTransactions: sinceFirst,
    recurrings,
  };
}
