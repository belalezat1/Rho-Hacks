import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";

const nav = [
  { href: "/talk", label: "Talk", match: ["/talk"] },
  {
    href: "/cash-pulse",
    label: "Cash",
    match: ["/cash-pulse", "/anomalies"],
  },
  { href: "/spend-context", label: "Spend", match: ["/spend-context"] },
  { href: "/briefs", label: "Briefs", match: ["/briefs"] },
];

export function AppShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-hairline bg-surface px-5 py-7">
        <div className="px-1">
          <PilotWordmark size="nav" />
        </div>

        <div className="mt-8 rounded-xl border border-hairline bg-canvas/80 px-3.5 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
            Workspace
          </p>
          <p className="mt-1 text-[15px] font-semibold tracking-tight text-ink">
            Northstar Co.
          </p>
          <p className="mt-0.5 text-[12px] text-muted">Demo · Read-only</p>
        </div>

        <nav className="mt-8 flex flex-col gap-1.5">
          {nav.map((item) => {
            const isActive =
              active != null
                ? item.match.some(
                    (m) => active === m || active.startsWith(m + "/"),
                  )
                : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3.5 py-3 text-[16px] transition duration-200 ${
                  isActive
                    ? "bg-nav-active font-medium text-ink"
                    : "text-muted hover:bg-canvas hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="mt-auto px-1 pb-1 text-[12px] leading-snug text-muted-soft">
          Read-only · Not financial advice
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-8 py-8 text-base lg:px-12 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
