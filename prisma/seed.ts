/**
 * Development seed data.
 *
 * The demo passwords below are public and must never be used on a real
 * deployment. See docs/07-operations.md for the launch checklist.
 */
import { PrismaClient, Role } from "@prisma/client";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

const DEMO_PASSWORD = "toyooka-demo-123";

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password.normalize("NFKC"), salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

async function main() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash, role: Role.ADMIN },
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const moderator = await prisma.user.upsert({
    where: { username: "moderator" },
    update: { passwordHash, role: Role.MODERATOR },
    create: {
      username: "moderator",
      email: "moderator@example.com",
      passwordHash,
      role: Role.MODERATOR,
    },
  });

  const student = await prisma.user.upsert({
    where: { username: "student" },
    update: { passwordHash, role: Role.STUDENT },
    create: {
      username: "student",
      email: "student@example.com",
      passwordHash,
      role: Role.STUDENT,
    },
  });

  const boards = [
    {
      slug: "general",
      name: "General",
      description: "Anything that does not fit elsewhere. Say hello and introduce yourself.",
      sortOrder: 1,
    },
    {
      slug: "study",
      name: "Study Hall",
      description: "Homework help, exam preparation, and study groups.",
      sortOrder: 2,
    },
    {
      slug: "clubs",
      name: "Clubs & Events",
      description: "Club announcements, sign-ups, and event planning.",
      sortOrder: 3,
    },
    {
      slug: "lost-found",
      name: "Lost & Found",
      description: "Report a lost item or hand in something you found on campus.",
      sortOrder: 4,
    },
    {
      slug: "meta",
      name: "Site Feedback",
      description: "Bugs, suggestions, and questions about this bulletin board.",
      sortOrder: 5,
    },
  ];

  for (const board of boards) {
    await prisma.board.upsert({
      where: { slug: board.slug },
      update: { name: board.name, description: board.description, sortOrder: board.sortOrder },
      create: board,
    });
  }

  const existingThreads = await prisma.thread.count();
  if (existingThreads > 0) {
    console.log("Threads already exist; skipping sample discussions.");
    return;
  }

  const general = await prisma.board.findUniqueOrThrow({ where: { slug: "general" } });
  const study = await prisma.board.findUniqueOrThrow({ where: { slug: "study" } });
  const clubs = await prisma.board.findUniqueOrThrow({ where: { slug: "clubs" } });
  const meta = await prisma.board.findUniqueOrThrow({ where: { slug: "meta" } });

  await prisma.thread.create({
    data: {
      boardId: general.id,
      authorId: admin.id,
      title: "Welcome to the Toyooka BBS",
      isPinned: true,
      posts: {
        create: {
          authorId: admin.id,
          body: [
            "This is the first public discussion space for our school community.",
            "",
            "A few ground rules:",
            "1. Be kind. Disagree with ideas, never with people.",
            "2. Never post someone else's name, address, photo, or contact details.",
            "3. Keep exam answers, private conversations, and staff matters out of public threads.",
            "4. Use the Report button when something feels wrong. Moderators will review it.",
            "",
            "This site is a student project, not an official communication channel of the school.",
          ].join("\n"),
        },
      },
    },
  });

  await prisma.thread.create({
    data: {
      boardId: general.id,
      authorId: student.id,
      title: "What should we add to the school festival this year?",
      posts: {
        create: [
          {
            authorId: student.id,
            body: "Every year the festival feels a little the same. What is one small thing we could add that would make people stay longer?",
          },
          {
            authorId: moderator.id,
            body: "A quiet room with board games would help people who get overwhelmed by the crowds. We could run it in an empty classroom.",
          },
          {
            authorId: student.id,
            body: "I like that. Maybe a stamp rally that sends people to the quieter corners of the building?",
          },
        ],
      },
    },
  });

  await prisma.thread.create({
    data: {
      boardId: study.id,
      authorId: student.id,
      title: "Math study group before the midterms",
      posts: {
        create: [
          {
            authorId: student.id,
            body: "I am stuck on quadratic inequalities. Would anyone like to meet in the library after class on Wednesday? Two hours, no phones.",
          },
          {
            authorId: admin.id,
            body: "Count me in. Bring the problem set from last week and we can work through the hard ones together.",
          },
        ],
      },
    },
  });

  await prisma.thread.create({
    data: {
      boardId: clubs.id,
      authorId: moderator.id,
      title: "Photography club: weekend photo walk",
      posts: {
        create: {
          authorId: moderator.id,
          body: "We are walking along the river this Saturday at 9:00. Bring any camera, including your phone. The theme is shadows. Sign up by replying here.",
        },
      },
    },
  });

  await prisma.thread.create({
    data: {
      boardId: meta.id,
      authorId: admin.id,
      title: "Known limitations of this prototype",
      posts: {
        create: {
          authorId: admin.id,
          body: [
            "This first version is intentionally small. It is missing:",
            "- Email verification and password reset",
            "- Search",
            "- Image uploads",
            "- Notifications",
            "",
            "Moderators can remove posts, lock threads, and review reports. If you find a bug, post it here.",
          ].join("\n"),
        },
      },
    },
  });

  console.log("Seed complete.");
  console.log(`Demo accounts (password: ${DEMO_PASSWORD}): admin, moderator, student`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
