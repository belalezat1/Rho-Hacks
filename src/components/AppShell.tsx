"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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
          <WorkspaceMenu />
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
        <main className="flex-1 px-8 py-8 pb-36 text-base lg:px-12 lg:py-10">
          <PageEnter>{children}</PageEnter>
        </main>
        <Suspense fallback={null}>
          <PilotAssistant />
        </Suspense>
      </div>
    </div>
  );
}

function WorkspaceMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-[var(--radius-control)] border border-hairline bg-white px-3 py-2.5 text-left transition hover:bg-canvas"
        aria-label="Workspace Northstar Co."
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
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
        <span
          className={`text-muted transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-[var(--radius-control)] border border-hairline bg-white shadow-[0_8px_24px_rgba(15,23,22,0.08)]"
        >
          <div className="border-b border-hairline px-3 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">
                NS
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">
                  Northstar Co.
                </p>
                <p className="text-[11px] text-muted">Active workspace</p>
              </div>
              <span className="rounded-md bg-mint-soft px-1.5 py-0.5 text-[10px] font-semibold text-ink">
                Demo Mode
              </span>
            </div>
            <p className="mt-2.5 text-[11px] leading-snug text-muted">
              Read-only Rho ledger. Decision support only.
            </p>
          </div>
          <div className="p-1.5">
            <Link
              href="/cash-pulse"
              role="menuitem"
              className="block rounded-lg px-3 py-2 text-[13px] text-ink hover:bg-canvas"
              onClick={() => setOpen(false)}
            >
              Cash
            </Link>
            <Link
              href="/briefs"
              role="menuitem"
              className="block rounded-lg px-3 py-2 text-[13px] text-ink hover:bg-canvas"
              onClick={() => setOpen(false)}
            >
              Brief Studio
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
