import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";

const nav = [
  { href: "/briefs", label: "Briefs", match: ["/briefs"] },
  { href: "/spend-context", label: "Spend", match: ["/spend-context"] },
  {
    href: "/cash-pulse",
    label: "Cash",
    match: ["/cash-pulse", "/anomalies"],
  },
  { href: "/talk", label: "Talk", match: ["/talk"] },
];

/** Shared left inset for logo → workspace → nav */
const SIDE_INSET = "px-5";

export function AppShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <aside className="sticky top-0 flex h-screen w-[248px] shrink-0 flex-col border-r border-hairline bg-surface">
        <div className={`${SIDE_INSET} pt-7`}>
          <PilotWordmark size="nav" />
        </div>

        <div className={`${SIDE_INSET} mt-8`}>
          <div className="rounded-[var(--radius-control)] border border-hairline bg-canvas/80 px-3.5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Workspace
            </p>
            <p className="mt-1 text-[15px] font-semibold tracking-tight text-ink">
              Northstar Co.
            </p>
            <p className="mt-0.5 text-[12px] text-muted">Demo · Read-only</p>
          </div>
        </div>

        <nav className={`${SIDE_INSET} mt-8 flex flex-col gap-1`} aria-label="App">
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
                className={`flex h-11 items-center rounded-[var(--radius-control)] px-3.5 text-[15px] transition duration-150 ${
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

        <p className={`${SIDE_INSET} mt-auto pb-6 text-[12px] leading-snug text-muted-soft`}>
          Read-only · Not financial advice
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-8 py-8 text-base lg:px-12 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
