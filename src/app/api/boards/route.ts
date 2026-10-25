import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { checkRateLimit } from "@/lib/rate-limit";
import { parseSuggestedTags } from "@/lib/tags";

const SLUG = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/;
const RESERVED = new Set(["new", "boards", "api", "b", "t", "u", "login", "register", "search", "moderation"]);
const BOARDS_PER_USER = 3;

/** Students open their own boards directly; no approval step for now. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, `/login?next=${encodeURIComponent("/boards/new")}`);
  }

  const limit = await checkRateLimit(`board:${user.id}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return seeOther(request, "/boards/new?error=rate-limited");
  }

  const data = await request.formData();
  const name = formText(data, "name");
  const slug = formText(data, "slug").toLowerCase();
  const description = formText(data, "description");
  const tags = parseSuggestedTags(formText(data, "tags")).slice(0, 8);

  if (name.length < 2 || name.length > 30 || description.length < 2 || description.length > 200) {
    return seeOther(request, "/boards/new?error=invalid-input");
  }
  if (!SLUG.test(slug) || RESERVED.has(slug)) {
    return seeOther(request, "/boards/new?error=invalid-slug");
  }

  const [owned, existing] = await Promise.all([
    prisma.board.count({ where: { ownerId: user.id } }),
    prisma.board.findUnique({ where: { slug }, select: { id: true } }),
  ]);

  if (owned >= BOARDS_PER_USER) {
    return seeOther(request, "/boards/new?error=board-limit");
  }
  if (existing) {
    return seeOther(request, "/boards/new?error=slug-taken");
  }

  const board = await prisma.board.create({
    data: {
      slug,
      name,
      description,
      kind: "COMMUNITY",
      ownerId: user.id,
      sortOrder: 100,
      suggestedTags: tags.join(","),
    },
    select: { slug: true },
  });

  return seeOther(request, `/b/${board.slug}`);
}
