import { InboxChat, InboxMessage } from "@/lib/inbox/db";
import { ForumReply, ForumThread } from "@/lib/forum/db";
import { forumHandler } from "@/lib/forum/handler";
import {
  AppNotification,
  TEXT_LENGTH,
  WINDOW_DAYS,
  latestFirst,
  messageTitle,
  replyTitle,
} from "@/components/Notifications/api";

// Lives under /api/forum so it uses the forum's verified sign-in: the caller's
// email comes from their checked token, not from a header they could set to
// read someone else's messages.

const iso = (d: unknown) => new Date(d as Date).toISOString();

// The newest item per group (chat or thread) that someone else wrote.
const latestFromOthers = (
  Model: any,
  groupField: "chat" | "thread",
  senderField: "senderEmail" | "authorEmail",
  groupIds: unknown[],
  myEmail: string,
  since: Date
): Promise<any[]> =>
  Model.aggregate([
    { $match: { [groupField]: { $in: groupIds }, [senderField]: { $ne: myEmail }, createdAt: { $gt: since } } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: `$${groupField}`, doc: { $first: "$$ROOT" } } },
  ]);

export default forumHandler({
  GET: async (_req, _res, me) => {
    const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const [chats, threads] = await Promise.all([
      InboxChat.find({ members: me.email }).select("name isGroup").limit(100).lean(),
      ForumThread.find({ authorEmail: me.email }).select("title").sort({ lastActivityAt: -1 }).limit(100).lean(),
    ]);

    const [messages, replies] = await Promise.all([
      chats.length
        ? latestFromOthers(InboxMessage, "chat", "senderEmail", chats.map((c: any) => c._id), me.email, since)
        : [],
      threads.length
        ? latestFromOthers(ForumReply, "thread", "authorEmail", threads.map((t: any) => t._id), me.email, since)
        : [],
    ]);

    const chatById = new Map(chats.map((c: any) => [String(c._id), c]));
    const threadById = new Map(threads.map((t: any) => [String(t._id), t]));

    const items: AppNotification[] = [
      ...messages.map(({ doc: m }): AppNotification => ({
        id: `message:${m._id}`,
        kind: "message",
        title: messageTitle(m.senderName, chatById.get(String(m.chat)) ?? { isGroup: false }),
        text: String(m.text).slice(0, TEXT_LENGTH),
        createdAt: iso(m.createdAt),
        url: `/inbox?chat=${encodeURIComponent(String(m.chat))}`,
      })),
      ...replies.map(({ doc: r }): AppNotification => ({
        id: `reply:${r._id}`,
        kind: "reply",
        title: replyTitle(r.authorName, (threadById.get(String(r.thread)) as any)?.title ?? "your thread"),
        text: String(r.text).slice(0, TEXT_LENGTH),
        createdAt: iso(r.createdAt),
        url: `/forum?thread=${encodeURIComponent(String(r.thread))}`,
      })),
    ];

    return latestFirst(items);
  },
});
