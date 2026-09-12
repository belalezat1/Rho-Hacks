import type { NormalizedMerchant, RhoAccount, RhoTransaction } from "@/lib/types";

/** Deterministic demo ledger shaped like Rho accounts/transactions. */
export const DEMO_ACCOUNTS: RhoAccount[] = [
  {
    id: "acc_checking_001",
    name: "Operating Checking",
    type: "checking",
    balanceCents: 428_450_00,
    currency: "USD",
  },
  {
    id: "acc_savings_001",
    name: "Reserve Savings",
    type: "savings",
    balanceCents: 210_000_00,
    currency: "USD",
  },
  {
    id: "acc_treasury_001",
    name: "Treasury",
    type: "treasury",
    balanceCents: 150_000_00,
    currency: "USD",
  },
];

export const DEMO_MERCHANTS: NormalizedMerchant[] = [
  {
    key: "intercom",
    displayName: "Intercom",
    rawDescriptors: ["INTERCOM *IO", "INTERCOM INC"],
    category: "saas",
    recurringMonthlyCents: 1_299_00,
  },
  {
    key: "notion",
    displayName: "Notion",
    rawDescriptors: ["NOTION LABS", "NOTION.SO"],
    category: "saas",
    recurringMonthlyCents: 288_00,
  },
  {
    key: "aws",
    displayName: "Amazon Web Services",
    rawDescriptors: ["AWS AMAZON.COM", "AMAZON WEB SERVICES"],
    category: "saas",
    recurringMonthlyCents: 4_820_00,
  },
  {
    key: "figma",
    displayName: "Figma",
    rawDescriptors: ["FIGMA *ORG", "FIGMA INC"],
    category: "saas",
    recurringMonthlyCents: 540_00,
  },
  {
    key: "jordan_design",
    displayName: "Jordan Lee (Design)",
    rawDescriptors: ["ACH DEEL INC JORDAN", "DEEL *JORDAN LEE"],
    category: "contractor",
    recurringMonthlyCents: 9_000_00,
    roleHint: "senior product designer contractor",
  },
  {
    key: "gusto",
    displayName: "Gusto Payroll",
    rawDescriptors: ["GUSTO PAYROLL", "GUSTO *PAY"],
    category: "payroll",
    recurringMonthlyCents: 42_500_00,
  },
  {
    key: "northpeak",
    displayName: "Northpeak Labs",
    rawDescriptors: ["WIRE NORTHPEAK LABS", "NORTHPEAK LABS LLC"],
    category: "other",
  },
  {
    key: "pqrs_cloud",
    displayName: "PQRS Cloud",
    rawDescriptors: ["PQRS CLOUD *INV", "SQ *PQRS CLOUD"],
    category: "saas",
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(15, 0, 0, 0);
  return d.toISOString();
}

/** Build ~90 days of outflows + a few inflows for burn/runway math. */
export function buildDemoTransactions(): RhoTransaction[] {
  const txs: RhoTransaction[] = [];
  let seq = 1;
  const push = (partial: Omit<RhoTransaction, "id" | "currency">) => {
    txs.push({
      id: `txn_${String(seq++).padStart(4, "0")}`,
      currency: "USD",
      ...partial,
    });
  };

  // Recurring SaaS + contractor over ~12 weeks
  for (let week = 0; week < 12; week++) {
    const day = week * 7 + 2;
    push({
      accountId: "acc_checking_001",
      postedAt: daysAgo(day),
      amountCents: -1_299_00,
      rawDescriptor: week % 2 === 0 ? "INTERCOM *IO" : "INTERCOM INC",
      merchantKey: "intercom",
      type: "card",
      status: "posted",
    });
    push({
      accountId: "acc_checking_001",
      postedAt: daysAgo(day + 1),
      amountCents: -288_00,
      rawDescriptor: "NOTION LABS",
      merchantKey: "notion",
      type: "card",
      status: "posted",
    });
    push({
      accountId: "acc_checking_001",
      postedAt: daysAgo(day + 1),
      amountCents: -540_00,
      rawDescriptor: "FIGMA *ORG",
      merchantKey: "figma",
      type: "card",
      status: "posted",
    });
    push({
      accountId: "acc_checking_001",
      postedAt: daysAgo(day + 3),
      amountCents: -(4_200_00 + (week % 3) * 200_00),
      rawDescriptor: "AWS AMAZON.COM",
      merchantKey: "aws",
      type: "card",
      status: "posted",
    });
    push({
      accountId: "acc_checking_001",
      postedAt: daysAgo(day + 4),
      amountCents: -9_000_00,
      rawDescriptor: "ACH DEEL INC JORDAN",
      merchantKey: "jordan_design",
      type: "ach",
      status: "posted",
      memo: "Contract design — Jordan Lee",
    });
    push({
      accountId: "acc_checking_001",
      postedAt: daysAgo(day + 5),
      amountCents: -42_500_00,
      rawDescriptor: "GUSTO *PAY",
      merchantKey: "gusto",
      type: "payroll",
      status: "posted",
    });
    // Light ops spend
    push({
      accountId: "acc_checking_001",
      postedAt: daysAgo(day + 2),
      amountCents: -1_850_00,
      rawDescriptor: "AMEX TRAVEL *HOTEL",
      type: "card",
      status: "posted",
    });
  }

  // Inflows
  for (let i = 0; i < 3; i++) {
    push({
      accountId: "acc_checking_001",
      postedAt: daysAgo(20 + i * 25),
      amountCents: 95_000_00,
      rawDescriptor: "WIRE CUSTOMER ACME",
      type: "wire",
      status: "posted",
    });
  }

  // First-time / spike / pending / awaiting_approval for anomaly radar
  push({
    accountId: "acc_checking_001",
    postedAt: daysAgo(1),
    amountCents: -8_400_00,
    rawDescriptor: "WIRE NORTHPEAK LABS",
    merchantKey: "northpeak",
    type: "wire",
    status: "posted",
    memo: "First wire to Northpeak Labs",
  });
  push({
    accountId: "acc_checking_001",
    postedAt: daysAgo(0),
    amountCents: -2_400_00,
    rawDescriptor: "PQRS CLOUD *INV",
    merchantKey: "pqrs_cloud",
    type: "card",
    status: "posted",
  });
  push({
    accountId: "acc_checking_001",
    postedAt: daysAgo(0),
    amountCents: -3_600_00,
    rawDescriptor: "INTERCOM *IO",
    merchantKey: "intercom",
    type: "card",
    status: "pending",
    memo: "Pending Intercom annual true-up",
  });
  push({
    accountId: "acc_checking_001",
    postedAt: daysAgo(0),
    amountCents: -12_000_00,
    rawDescriptor: "ACH VENDOR PAY",
    type: "ach",
    status: "awaiting_approval",
  });
  push({
    accountId: "acc_checking_001",
    postedAt: daysAgo(2),
    amountCents: -499_00,
    rawDescriptor: "FAILED CARD RETRY",
    type: "card",
    status: "failed",
  });

  // Intercom baseline was ~1299; recent pending 3600 is a spike signal too
  return txs.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
}

export const DEMO_TRANSACTIONS = buildDemoTransactions();
