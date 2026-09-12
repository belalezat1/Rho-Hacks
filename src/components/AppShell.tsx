"use client";

import { Suspense } from "react";
import Link from "next/link";
import { PilotWordmark } from "@/components/PilotWordmark";
import { PageEnter } from "@/components/PageEnter";
import { PilotAssistant } from "@/components/PilotAssistant";

const nav = [
  { href: "/cash-pulse", label: "Cash", match: ["/cash-pulse"] },
  { href: "/spend-context", label: "Spend", match: ["/spend-context"] },
  { href: "/anomalies", label: "Exceptions", match: ["/anomalies"] },
  { href: "/briefs", label: "Brief Studio", match: ["/briefs"] },
];

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
        <div className={`${SIDE_INSET} border-b border-hairline pb-5 pt-6`}>
          <PilotWordmark size="nav" />
        </div>

        <div className={`${SIDE_INSET} mt-5`}>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-[var(--radius-control)] border border-hairline bg-white px-3 py-2.5 text-left transition hover:bg-canvas"
            aria-label="Workspace Northstar Co."
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">
              NS
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold tracking-tight text-ink">
                Northstar Co.
              </span>
              <span className="block text-[11px] text-muted">
                Demo · Read-only
              </span>
            </span>
            <span className="text-muted" aria-hidden>
              ▾
            </span>
          </button>
        </div>

        <nav
          className={`${SIDE_INSET} mt-6 flex flex-col gap-0.5`}
          aria-label="App"
        >
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
                className={`flex h-10 items-center rounded-[var(--radius-control)] px-3 text-[14px] transition duration-150 ${
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

        <p
          className={`${SIDE_INSET} mt-auto pb-6 text-[11px] leading-snug text-muted-soft`}
        >
          Read-only · Not financial advice
        </p>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-8 py-8 pb-28 text-base lg:px-12 lg:py-10">
          <PageEnter>{children}</PageEnter>
        </main>
        <Suspense fallback={null}>
          <PilotAssistant />
        </Suspense>
      </div>
    </div>
  );
}
