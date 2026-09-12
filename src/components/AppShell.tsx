import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";

const nav = [
  { href: "/talk", label: "Talk", match: ["/talk"] },
  {
    href: "/money",
    label: "Money",
    match: ["/money", "/cash-pulse", "/anomalies", "/spend-context"],
  },
  { href: "/briefs", label: "Briefs", match: ["/briefs"] },
  { href: "/settings", label: "Settings", match: ["/settings"] },
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
      <aside className="sticky top-0 flex h-screen w-[200px] shrink-0 flex-col border-r border-hairline bg-surface px-3 py-5">
        <div className="px-2">
          <PilotWordmark size="sm" />
        </div>
        <div className="mt-5 rounded-lg bg-canvas px-3 py-2 text-sm">
          <span className="font-medium">Acme, Inc</span>
          <span className="ml-2 text-[10px] text-muted">Demo</span>
        </div>

        <nav className="mt-8 flex flex-col gap-0.5">
          {nav.map((item) => {
            const isActive =
              active != null
                ? item.match.some((m) => active === m || active.startsWith(m + "/"))
                : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
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

        <p className="mt-auto px-2 pb-1 text-[11px] leading-snug text-muted-soft">
          Read-only · Not financial advice
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
