export type HomeBoard = { slug: string; name: string; count: number };

export type HomeThread = {
  id: string;
  title: string;
  board: { slug: string; name: string };
  author: { username: string };
  tags: { name: string }[];
  likeCount: number;
  replyCount: number;
  lastPostAt: Date;
  bookmarked: boolean;
  isUnread: boolean;
  excerpt: string;
};

export type HomeData = {
  boards: HomeBoard[];
  threads: HomeThread[];
  totalThreads: number;
  totalPosts: number;
  saved: number;
  username: string | null;
};
