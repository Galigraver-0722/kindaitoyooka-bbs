import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Saved threads are one of the home feed filters. */
export default function BookmarksPage() {
  redirect("/?filter=saved");
}
