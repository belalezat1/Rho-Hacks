import { redirect } from "next/navigation";

/** Settings removed — configure keys in `.env.local` (see README). */
export default function SettingsPage() {
  redirect("/cash-pulse");
}
