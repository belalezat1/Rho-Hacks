import { redirect } from "next/navigation";

/** Talk opens the floating Pilot assistant. Deep links land on Cash with the panel open. */
export default function TalkPage() {
  redirect("/cash-pulse?pilot=1");
}
