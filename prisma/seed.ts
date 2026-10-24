/**
 * Development seed data.
 *
 * The demo passwords below are public and must never be used on a real
 * deployment. See docs/07-operations.md for the launch checklist.
 */
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/lib/passwords";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "toyooka-demo-123";

function tagLinks(...names: string[]) {
  return {
    connectOrCreate: names.map((name) => ({ where: { name }, create: { name } })),
  };
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
      name: "雑談",
      description: "なんでも話す場所です。自己紹介もどうぞ。",
      sortOrder: 1,
      suggestedTags: "質問,雑談,自己紹介",
    },
    {
      slug: "study",
      name: "勉強",
      description: "宿題の質問、試験対策、勉強会の連絡に。",
      sortOrder: 2,
      suggestedTags: "質問,試験,宿題,勉強会",
    },
    {
      slug: "clubs",
      name: "部活・行事",
      description: "部活動の連絡、参加申し込み、行事の相談。",
      sortOrder: 3,
      suggestedTags: "連絡,文化祭,部活",
    },
    {
      slug: "lost-found",
      name: "落とし物",
      description: "落とし物の連絡と、拾った物の報告。",
      sortOrder: 4,
      suggestedTags: "落とし物,拾得物",
    },
    {
      slug: "meta",
      name: "サイトへの意見",
      description: "不具合、要望、この掲示板についての質問。",
      sortOrder: 5,
      suggestedTags: "要望,不具合,質問",
    },
  ];

  for (const board of boards) {
    await prisma.board.upsert({
      where: { slug: board.slug },
      update: {
        name: board.name,
        description: board.description,
        sortOrder: board.sortOrder,
        suggestedTags: board.suggestedTags,
      },
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
      title: "Toyooka BBS へようこそ",
      isPinned: true,
      tags: tagLinks("ルール", "はじめて"),
      posts: {
        create: {
          authorId: admin.id,
          body: [
            "ここは、学校のみんなが質問や連絡を残しておける掲示板です。",
            "",
            "投稿する前に、次のルールを確認してください。",
            "1. 人を攻撃しない。意見が違っても、相手ではなく考え方について話す。",
            "2. 他の人の名前、住所、写真、連絡先は書かない。",
            "3. 試験の解答や、先生との個人的なやり取りは公開しない。",
            "4. おかしいと思ったら、通報ボタンを使ってください。モデレーターが確認します。",
            "",
            "このサイトは生徒が運営する試作版で、学校の公式な連絡手段ではありません。",
          ].join("\n"),
        },
      },
    },
  });

  await prisma.thread.create({
    data: {
      boardId: general.id,
      authorId: student.id,
      title: "今年の文化祭、何を追加したい？",
      tags: tagLinks("文化祭"),
      posts: {
        create: [
          {
            authorId: student.id,
            body: "毎年、文化祭の内容が少し似たり寄ったりに感じます。人がもう少し長くいてくれるような、小さな工夫を一つ挙げるとしたら何でしょう？",
          },
          {
            authorId: moderator.id,
            body: "人が多いのが苦手な人のために、空き教室でボードゲームを置く「静かな部屋」はどうでしょう。",
          },
          {
            authorId: student.id,
            body: "いいですね。建物の落ち着いた場所を回るスタンプラリーにしたら、人の流れも散らばりそうです。",
          },
        ],
      },
    },
  });

  await prisma.thread.create({
    data: {
      boardId: study.id,
      authorId: student.id,
      title: "中間テスト前の数学勉強会",
      tags: tagLinks("数学", "勉強会"),
      posts: {
        create: [
          {
            authorId: student.id,
            body: "二次不等式で止まっています。水曜の放課後に図書館で2時間ほど集まりませんか。スマホは置いていきましょう。",
          },
          {
            authorId: admin.id,
            body: "参加します。先週の問題プリントを持っていくので、難しい問題を一緒に解きましょう。",
          },
        ],
      },
    },
  });

  await prisma.thread.create({
    data: {
      boardId: clubs.id,
      authorId: moderator.id,
      title: "写真部：週末のフォトウォーク",
      tags: tagLinks("写真部"),
      posts: {
        create: {
          authorId: moderator.id,
          body: "土曜の9時に川沿いを歩きます。カメラはスマホでもかまいません。今週のテーマは「影」です。参加する人はこのスレッドに返信してください。",
        },
      },
    },
  });

  await prisma.thread.create({
    data: {
      boardId: meta.id,
      authorId: admin.id,
      title: "この試作版でまだできないこと",
      tags: tagLinks("要望"),
      posts: {
        create: {
          authorId: admin.id,
          body: [
            "この最初の版は、わざと小さく作っています。まだできないことは次のとおりです。",
            "- メールによる確認とパスワードの再設定（忘れたときは管理者に連絡してください）",
            "- 画像のアップロード",
            "- 通知",
            "",
            "モデレーターは投稿の削除、スレッドのロック、通報の確認ができます。不具合を見つけたら、このボードに書いてください。",
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
