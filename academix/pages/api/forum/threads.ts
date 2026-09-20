import { LIMITS, isCategory } from "@/components/Forum/api";
import { ForumThread } from "@/lib/forum/db";
import { HttpError, forumHandler } from "@/lib/forum/handler";

const present = (t: any) => ({
  _id: String(t._id),
  title: t.title,
  body: t.body,
  category: t.category,
  authorEmail: t.authorEmail,
  authorName: t.authorName,
  replyCount: t.replyCount,
  createdAt: t.createdAt,
  lastActivityAt: t.lastActivityAt,
});

export default forumHandler({
  // Most recently active threads first.
  GET: async () => {
    const threads = await ForumThread.find().sort({ lastActivityAt: -1 }).limit(100).lean();
    return threads.map(present);
  },

  POST: async (req, res, me) => {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
    const category = req.body?.category ?? "General";

    if (!title) throw new HttpError(400, "Give your thread a title");
    if (title.length > LIMITS.title) throw new HttpError(400, `Title is too long (${LIMITS.title} characters max)`);
    if (!body) throw new HttpError(400, "Write something in the thread body");
    if (body.length > LIMITS.body) throw new HttpError(400, `Post is too long (${LIMITS.body} characters max)`);
    if (!isCategory(category)) throw new HttpError(400, "Unknown category");

    const thread = await ForumThread.create({
      title,
      body,
      category,
      authorEmail: me.email,
      authorName: me.name,
    });

    res.status(201);
    return present(thread.toObject());
  },
});
