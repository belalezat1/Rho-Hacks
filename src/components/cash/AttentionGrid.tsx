import type { AttentionBucket } from "@/lib/cash/demo-metrics";
import { formatUsd } from "@/lib/ledger/analytics";

const toneClass: Record<AttentionBucket["tone"], string> = {
  info: "text-[#2E6D92]",
  warn: "text-[#C45C1A]",
  ok: "text-ok",
  neutral: "text-muted",
};

export function AttentionGrid({ buckets }: { buckets: AttentionBucket[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {buckets.map((b) => (
        <div key={b.id} className="card p-4">
          <p className={`text-[12px] font-medium ${toneClass[b.tone]}`}>
            {b.label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-ink">
            {formatUsd(b.amountCents)}
          </p>
          <p className="mt-1 text-[12px] text-muted">
            {b.count} {b.countLabel}
          </p>
        </div>
      ))}
    </div>
  );
}
