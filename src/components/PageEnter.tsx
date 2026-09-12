"use client";

import { usePathname } from "next/navigation";

/** Fade + rise on each app route change (Briefs / Spend / Cash / Talk). */
export function PageEnter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
