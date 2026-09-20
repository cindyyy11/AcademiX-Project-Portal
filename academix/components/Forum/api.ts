export type Me = { email: string; name: string };

export const CATEGORIES = ["General", "Projects", "Resources", "Q&A"] as const;
export type Category = (typeof CATEGORIES)[number];

export const LIMITS = { title: 120, body: 5000, reply: 2000 };

export type Thread = {
  _id: string;
  title: string;
  body: string;
  category: Category;
  authorEmail: string;
  authorName: string;
  replyCount: number;
  createdAt: string;
  lastActivityAt: string;
};
export type Reply = {
  _id: string;
  thread: string;
  authorEmail: string;
  authorName: string;
  text: string;
  createdAt: string;
};

export const isCategory = (v: unknown): v is Category => CATEGORIES.includes(v as Category);

export const forumFetch = async <T>(
  me: Me,
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {}
): Promise<T> => {
  const res = await fetch(`/api/forum/${path}`, {
    method: options.method ?? "GET",
    headers: {
      "content-type": "application/json",
      "x-user-email": me.email,
      "x-user-name": encodeURIComponent(me.name),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || "Something went wrong"), { code: data.code as string | undefined });
  return data as T;
};
