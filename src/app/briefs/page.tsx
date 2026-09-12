"use client";

import { AppShell } from "@/components/AppShell";
import { BriefStudio } from "@/components/briefs/BriefStudio";

export default function BriefsPage() {
  return (
    <AppShell active="/briefs">
      <BriefStudio />
    </AppShell>
  );
}
