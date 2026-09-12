import { formatUsd } from "@/lib/ledger/analytics";
import type { ReceivableSlice } from "@/lib/cash/demo-metrics";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function RevenueChart({ series }: { series: number[] }) {
  const w = 520;
  const h = 180;
  const pad = { t: 16, r: 12, b: 28, l: 40 };
  const max = Math.max(...series) * 1.15;
  const min = 0;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const points = series.map((v, i) => {
    const x = pad.l + (i / (series.length - 1)) * innerW;
    const y = pad.t + (1 - (v - min) / (max - min)) * innerH;
    return { x, y, v };
  });

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${pad.t + innerH} L${points[0].x},${pad.t + innerH} Z`;
  const total = series[series.length - 1] ?? 0;
  const focus = points[7] ?? points[points.length - 1];

  return (
    <div className="panel-soft">
      <p className="text-[12px] font-medium text-muted">Collected revenue</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        {formatUsd(total)}
      </p>
      <p className="mt-0.5 text-[11px] text-muted">Demo series · illustrative</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-auto w-full" role="img" aria-label="Revenue chart">
        {[0.33, 0.66, 1].map((t) => {
          const y = pad.t + (1 - t) * innerH;
          return (
            <line
              key={t}
              x1={pad.l}
              x2={w - pad.r}
              y1={y}
              y2={y}
              stroke="#E8EAEA"
              strokeWidth="1"
            />
          );
        })}
        <path d={area} fill="rgba(57,239,205,0.18)" />
        <path d={line} fill="none" stroke="#39EFCD" strokeWidth="2.5" />
        {/* prior year dotted */}
        <path
          d={points
            .map((p, i) => {
              const y = p.y + 18 + (i % 2) * 4;
              return `${i === 0 ? "M" : "L"}${p.x},${Math.min(pad.t + innerH - 4, y)}`;
            })
            .join(" ")}
          fill="none"
          stroke="#C5CBC9"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
        <line
          x1={focus.x}
          x2={focus.x}
          y1={pad.t}
          y2={pad.t + innerH}
          stroke="#C5CBC9"
          strokeDasharray="3 3"
        />
        <circle cx={focus.x} cy={focus.y} r="4" fill="#39EFCD" stroke="#fff" strokeWidth="2" />
        {MONTHS.map((m, i) => {
          if (i % 2 !== 0) return null;
          const x = pad.l + (i / (series.length - 1)) * innerW;
          return (
            <text
              key={m}
              x={x}
              y={h - 8}
              textAnchor="middle"
              fill="#868e96"
              style={{ fontSize: "10px" }}
            >
              {m}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function ReceivablesCard({ slices }: { slices: ReceivableSlice[] }) {
  const total = slices.reduce((a, s) => a + s.amountCents, 0);
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="panel-soft">
      <p className="text-[12px] font-medium text-muted">Outstanding receivables</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        {formatUsd(total)}
      </p>
      <p className="mt-0.5 text-[11px] text-muted">Demo aging · illustrative</p>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0" aria-hidden>
          <circle cx="70" cy="70" r={r} fill="none" stroke="#F0F1F1" strokeWidth="18" />
          {slices.map((s) => {
            const len = total ? (s.amountCents / total) * c : 0;
            const el = (
              <circle
                key={s.id}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="18"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 70 70)"
              />
            );
            offset += len;
            return el;
          })}
          <circle cx="70" cy="70" r="36" fill="#fff" />
        </svg>

        <ul className="w-full flex-1 space-y-2.5 text-[13px]">
          {slices.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-ink">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
              <span className="text-muted">{s.count} invoices</span>
              <span className="min-w-[72px] text-right font-semibold tabular-nums">
                {formatUsd(s.amountCents)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
