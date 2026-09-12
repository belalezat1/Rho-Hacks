export type AccountType = "checking" | "savings" | "treasury";

export type TxStatus =
  | "posted"
  | "pending"
  | "failed"
  | "awaiting_approval";

export type TxType =
  | "card"
  | "ach"
  | "wire"
  | "transfer"
  | "payroll"
  | "other";

export interface RhoAccount {
  id: string;
  name: string;
  type: AccountType;
  balanceCents: number;
  currency: "USD";
}

export interface RhoTransaction {
  id: string;
  accountId: string;
  postedAt: string;
  amountCents: number;
  currency: "USD";
  rawDescriptor: string;
  merchantKey?: string;
  type: TxType;
  status: TxStatus;
  memo?: string;
}

export interface NormalizedMerchant {
  key: string;
  displayName: string;
  rawDescriptors: string[];
  category: "saas" | "contractor" | "payroll" | "ops" | "other";
  recurringMonthlyCents?: number;
  roleHint?: string;
}

export interface CashPosition {
  totalCents: number;
  accounts: RhoAccount[];
}

export interface BurnRunway {
  burn30Cents: number;
  burn60Cents: number;
  burn90Cents: number;
  dailyBurnCents: number;
  runwayDays: number | null;
}

export interface ConcentrationRow {
  merchantKey: string;
  displayName: string;
  outflowCents: number;
  pctOfBurn: number;
}

export type AnomalyKind =
  | "spike"
  | "first_time"
  | "pending"
  | "failed"
  | "awaiting_approval";

export type AnomalySeverity = "low" | "medium" | "high";

export interface Anomaly {
  id: string;
  kind: AnomalyKind;
  severity: AnomalySeverity;
  title: string;
  detail: string;
  amountCents: number;
  transactionIds: string[];
  merchantKey?: string;
  date: string;
}

export interface Citation {
  title: string;
  url: string;
  snippet: string;
}

export interface SpendContextRow {
  label: string;
  kind: "saas" | "contractor" | "role";
  rhoAmountMonthlyCents: number;
  rhoTransactionIds: string[];
  citedRangeLowCents: number | null;
  citedRangeHighCents: number | null;
  band: "below" | "within" | "above" | "insufficient_data";
  notes: string;
  citations: Citation[];
}

export interface ExternalRiskItem {
  merchantKey: string;
  displayName: string;
  headline: string;
  severity: AnomalySeverity;
  citations: Citation[];
}

export interface ToolTrace {
  id: string;
  tool: string;
  at: string;
  summary: string;
  payload: unknown;
}

export interface BriefRecord {
  id: string;
  type: "weekly_money_brief" | "client_close_pack";
  title: string;
  createdAt: string;
  markdown: string;
  audioText: string;
  stanUrl: string;
  persona: "founder" | "accountant";
}
