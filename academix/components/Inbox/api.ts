export type Me = { email: string; name: string };

export type Member = { email: string; name: string };
export type Chat = {
  _id: string;
  name: string | null;
  isGroup: boolean;
  members: Member[];
  lastMessageText: string;
  lastMessageAt: string;
};
export type Message = {
  _id: string;
  chat: string;
  senderEmail: string;
  senderName: string;
  text: string;
  createdAt: string;
};

export const normalizeEmail = (v: string) => {
  const email = v.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

export const chatTitle = (chat: Chat, me: Me) =>
  chat.name || chat.members.filter((m) => m.email !== me.email).map((m) => m.name).join(", ") || "Just you";

export const inboxFetch = async <T>(
  me: Me,
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {}
): Promise<T> => {
  const res = await fetch(`/api/inbox/${path}`, {
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
