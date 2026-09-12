"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { PilotWordmark } from "@/components/PilotWordmark";

type MenuItem = {
  href: string;
  title: string;
  body: string;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const PRODUCT: MenuGroup[] = [
  {
    label: "Core",
    items: [
      {
        href: "/briefs",
        title: "Briefs",
        body: "Assemble evidence and publish the pack",
      },
      {
        href: "/talk",
        title: "Talk",
        body: "Ask Pilot about cash, spend, and risk",
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        href: "/spend-context",
        title: "Spend Context",
        body: "Cited public market ranges on vendors",
      },
      {
        href: "/cash-pulse",
        title: "Cash Pulse",
        body: "Balances, burn, and runway",
      },
      {
        href: "/anomalies",
        title: "Anomalies",
        body: "What looks off since Monday",
      },
    ],
  },
];

const WORKSPACE: MenuGroup[] = [
  {
    label: "By role",
    items: [
      {
        href: "/talk",
        title: "Founders",
        body: "Weekly money brief in conversation",
      },
      {
        href: "/briefs",
        title: "Accountants",
        body: "Client-ready packs with a checklist",
      },
    ],
  },
  {
    label: "Partners",
    items: [
      {
        href: "#integrations",
        title: "Integrations",
        body: "Rho, ElevenLabs, Tavily, Stan",
      },
    ],
  },
];

export function LandingHeader() {
  const [open, setOpen] = useState<"product" | "workspace" | null>(null);
  const menuId = useId();

  return (
    <header className="relative z-30 w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-5 md:px-10">
        <PilotWordmark size="nav" tone="dark" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavTrigger
            label="Product"
            open={open === "product"}
            onOpen={() => setOpen("product")}
            onClose={() => setOpen(null)}
            menuId={`${menuId}-product`}
            groups={PRODUCT}
          />
          <NavTrigger
            label="Workspace"
            open={open === "workspace"}
            onOpen={() => setOpen("workspace")}
            onClose={() => setOpen(null)}
            menuId={`${menuId}-workspace`}
            groups={WORKSPACE}
          />
          <Link
            href="/briefs"
            className="rounded-md px-3 py-2 text-[15px] text-white/80 transition hover:bg-white/[0.06] hover:text-white"
          >
            Briefs
          </Link>
          <Link
            href="/talk"
            className="rounded-md px-3 py-2 text-[15px] text-white/80 transition hover:bg-white/[0.06] hover:text-white"
          >
            Talk
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <a
            href="#integrations"
            className="hidden text-[15px] text-white/80 transition hover:text-white sm:inline"
          >
            Integrations
          </a>
          <Link
            href="/talk"
            className="hidden text-[15px] text-white/80 transition hover:text-white md:inline"
          >
            Open app
          </Link>
          <Link
            href="/talk"
            className="btn-primary rounded-full px-5 py-2.5 text-[15px] font-medium"
          >
            Start briefing
          </Link>
        </div>
      </div>

      {/* Mobile feature strip */}
      <div className="flex gap-2 overflow-x-auto px-6 pb-3 md:hidden">
        {[
          { href: "/briefs", label: "Briefs" },
          { href: "/spend-context", label: "Spend" },
          { href: "/cash-pulse", label: "Cash" },
          { href: "/talk", label: "Talk" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="shrink-0 rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/80"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

function NavTrigger({
  label,
  open,
  onOpen,
  onClose,
  menuId,
  groups,
}: {
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  menuId: string;
  groups: MenuGroup[];
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <button
        type="button"
        className={`rounded-md px-3 py-2 text-[15px] transition ${
          open
            ? "bg-white/[0.08] text-white"
            : "text-white/80 hover:bg-white/[0.06] hover:text-white"
        }`}
        aria-expanded={open}
        aria-controls={menuId}
      >
        {label}
      </button>

      {open ? (
        <div
          id={menuId}
          className="absolute left-0 top-full z-40 pt-3"
          role="menu"
        >
          <MegaPanel groups={groups} />
        </div>
      ) : null}
    </div>
  );
}

function MegaPanel({ groups }: { groups: MenuGroup[] }) {
  return (
    <div className="flex min-w-[520px] gap-10 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
      <div className="flex flex-1 gap-10">
        {groups.map((g) => (
          <div key={g.label} className="min-w-[180px]">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              {g.label}
            </p>
            <ul className="space-y-1">
              {g.items.map((item) => (
                <li key={item.href + item.title}>
                  <Link
                    href={item.href}
                    className="group flex gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-white/[0.06]"
                    role="menuitem"
                  >
                    <span
                      className="mt-0.5 h-8 w-8 shrink-0 rounded-md border border-white/10 bg-white/[0.04]"
                      aria-hidden
                    />
                    <span>
                      <span className="block text-[15px] font-medium text-white">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-white/45">
                        {item.body}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative hidden w-40 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#111] lg:block">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1.2px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative flex h-full min-h-[140px] items-center justify-center">
          <span className="text-3xl text-white" aria-hidden>
            ✦
          </span>
        </div>
      </div>
    </div>
  );
}
