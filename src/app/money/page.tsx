import { redirect } from "next/navigation";

/** Money hub removed - Cash / Spend / Briefs live in the main nav. */
export default function MoneyPage() {
  redirect("/cash-pulse");
}
