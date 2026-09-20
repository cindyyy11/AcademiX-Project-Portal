import { useEffect, useState } from "react";
import { isDemoMode } from "../../redux/features/api/apiSlice";
import { usePolling } from "../Inbox/useInbox";
import { Chat, Message } from "../Inbox/api";
import { demoFetch as inboxDemo } from "../Inbox/demoStore";
import { Me, Reply, Thread, forumFetch } from "../Forum/api";
import { demoFetch as forumDemo } from "../Forum/demoStore";
import {
  AppNotification,
  TEXT_LENGTH,
  WINDOW_DAYS,
  latestFirst,
  messageTitle,
  replyTitle,
} from "./api";

const POLL_MS = 20000;
const MAX_READ_IDS = 200;

const newest = <T extends { createdAt: string }>(items: T[]) =>
  items.reduce<T | undefined>((a, b) => (!a || b.createdAt > a.createdAt ? b : a), undefined);

// Demo mode (or a server with no database) builds the same list from the
// browser-only inbox and forum stores.
const demoNotifications = async (me: Me): Promise<AppNotification[]> => {
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const recent = <T extends { createdAt: string }>(items: T[], fromOthers: (item: T) => boolean) =>
    newest(items.filter((i) => fromOthers(i) && i.createdAt > since));

  const chats = await inboxDemo<Chat[]>(me, "chats");
  const fromChats = await Promise.all(
    chats.map(async (chat): Promise<AppNotification | undefined> => {
      const last = recent(await inboxDemo<Message[]>(me, `messages?chatId=${chat._id}`), (m) => m.senderEmail !== me.email);
      return (
        last && {
          id: `message:${last._id}`,
          kind: "message",
          title: messageTitle(last.senderName, chat),
          text: last.text.slice(0, TEXT_LENGTH),
          createdAt: last.createdAt,
          url: `/inbox?chat=${encodeURIComponent(chat._id)}`,
        }
      );
    })
  );

  const mine = (await forumDemo<Thread[]>(me, "threads")).filter((t) => t.authorEmail === me.email);
  const fromThreads = await Promise.all(
    mine.map(async (thread): Promise<AppNotification | undefined> => {
      const last = recent(await forumDemo<Reply[]>(me, `replies?threadId=${thread._id}`), (r) => r.authorEmail !== me.email);
      return (
        last && {
          id: `reply:${last._id}`,
          kind: "reply",
          title: replyTitle(last.authorName, thread.title),
          text: last.text.slice(0, TEXT_LENGTH),
          createdAt: last.createdAt,
          url: `/forum?thread=${encodeURIComponent(thread._id)}`,
        }
      );
    })
  );

  return latestFirst([...fromChats, ...fromThreads].filter((n): n is AppNotification => !!n));
};

const loadNotifications = async (me: Me): Promise<AppNotification[]> => {
  if (isDemoMode()) return demoNotifications(me);
  try {
    return await forumFetch<AppNotification[]>(me, "notifications");
  } catch (e: any) {
    if (e.code === "not_configured") return demoNotifications(me);
    throw e;
  }
};

// Read state lives in this browser: everything at or before `before` counts as
// read, plus the individual notifications opened since.
type ReadState = { before: string; ids: string[] };
const NOTHING_READ: ReadState = { before: "", ids: [] };
const readKey = (email: string) => `academix-notifications-read:${email}`;

const loadRead = (email?: string): ReadState => {
  try {
    const parsed = email && JSON.parse(window.localStorage.getItem(readKey(email)) ?? "null");
    if (parsed && typeof parsed.before === "string" && Array.isArray(parsed.ids)) return parsed;
  } catch {}
  return NOTHING_READ;
};

const saveRead = (email: string, state: ReadState) => {
  try {
    window.localStorage.setItem(readKey(email), JSON.stringify(state));
  } catch {}
};

export const useNotifications = (me: Me | null) => {
  const email = me?.email;
  const [items, setItems] = useState<AppNotification[]>([]);
  const [failed, setFailed] = useState(false);
  const [read, setRead] = useState<ReadState>(NOTHING_READ);

  useEffect(() => {
    setItems([]);
    setRead(loadRead(email));
  }, [email]);

  usePolling(
    async () => {
      if (!me) return;
      try {
        setItems(await loadNotifications(me));
        setFailed(false);
      } catch {
        setFailed(true);
      }
    },
    POLL_MS,
    !!email,
    email
  );

  const isRead = (n: AppNotification) => n.createdAt <= read.before || read.ids.includes(n.id);

  const update = (next: ReadState) => {
    setRead(next);
    if (email) saveRead(email, next);
  };

  const markRead = (id: string) => {
    if (!read.ids.includes(id)) update({ ...read, ids: [...read.ids, id].slice(-MAX_READ_IDS) });
  };

  // Use the newest of now and the newest item, so a server clock slightly
  // ahead of this one can't leave something unread.
  const markAllRead = () =>
    update({ before: [new Date().toISOString(), ...items.map((i) => i.createdAt)].sort().pop()!, ids: [] });

  return { items, failed, isRead, unread: items.filter((n) => !isRead(n)).length, markRead, markAllRead };
};
