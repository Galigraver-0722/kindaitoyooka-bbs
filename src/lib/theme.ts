import { cookies } from "next/headers";

export type Theme = "light" | "dark";

/** The theme is a cookie so the server can render the right design on first paint. */
export async function getTheme(): Promise<Theme> {
  const store = await cookies();
  return store.get("theme")?.value === "dark" ? "dark" : "light";
}
