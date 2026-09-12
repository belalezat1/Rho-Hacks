import { redirect } from "next/navigation";

/** Settings removed from product nav for the MVP demo surface. */
export default function SettingsPage() {
  redirect("/talk");
}
