import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** The board list lives in the sidebar and the mobile drawer. */
export default function BoardsPage() {
  redirect("/");
}
