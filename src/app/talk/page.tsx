import { redirect } from "next/navigation";

/** Talk is the floating Pilot assistant — deep links open Cash with the panel. */
export default function TalkPage() {
  redirect("/cash-pulse?pilot=1");
}
