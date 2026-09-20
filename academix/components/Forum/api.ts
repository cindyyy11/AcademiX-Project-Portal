export type Me = { email: string; name: string; role: string };
// What the server has verified about the person making a request.
export type Caller = Me;

// Admins and supervisors moderate: they can delete anyone's posts. Everyone
// else can delete only their own. The server enforces this; the UI uses the
// same rule to decide which Delete buttons to show.
export const MODERATOR_ROLES = ["admin", "supervisor"];
export const isModerator = (me: { role: string }) => MODERATOR_ROLES.includes(me.role);
export const canDelete = (me: Me, authorEmail: string) =>
  isModerator(me) || me.email.toLowerCase() === authorEmail.toLowerCase();

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

export const timeAgo = (iso: string) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
};

export const isCategory = (v: unknown): v is Category => CATEGORIES.includes(v as Category);

export type Method = "GET" | "POST" | "DELETE";

// The forum server needs proof of who is calling. The portal's login is an
// httpOnly cookie on the core backend, so ask the backend's /refresh for a
// short-lived access token and send that along. Cached until just before it
// expires (tokens last 5 minutes).
const TOKEN_TTL_MS = 4 * 60_000;
let token: { value: string; expires: number } | null = null;
let pending: Promise<string> | null = null;

const signInError = () =>
  Object.assign(new Error("Please sign in again to use the forum"), { code: "unauthenticated" as string | undefined });

const getToken = async (): Promise<string> => {
  if (token && token.expires > Date.now()) return token.value;

  pending ??= (async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}refresh`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.accessToken !== "string") throw signInError();
      token = { value: data.accessToken, expires: Date.now() + TOKEN_TTL_MS };
      return token.value;
    } finally {
      pending = null;
    }
  })();
  return pending;
};

export const forumFetch = async <T>(
  _me: Me,
  path: string,
  options: { method?: Method; body?: unknown } = {}
): Promise<T> => {
  const send = async () =>
    fetch(`/api/forum/${path}`, {
      method: options.method ?? "GET",
      headers: { "content-type": "application/json", authorization: `Bearer ${await getToken()}` },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

  let res = await send();
  if (res.status === 401) {
    // The token may have expired since we cached it; get a fresh one and retry once.
    token = null;
    res = await send();
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || "Something went wrong"), { code: data.code as string | undefined });
  return data as T;
};
