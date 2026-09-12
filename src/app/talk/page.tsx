import { AppShell } from "@/components/AppShell";
import { TalkPanel } from "@/components/TalkPanel";

export default function TalkPage() {
  return (
    <AppShell active="/talk">
      <TalkPanel />
    </AppShell>
  );
}
