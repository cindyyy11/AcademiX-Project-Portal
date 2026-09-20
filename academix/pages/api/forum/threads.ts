import { LIMITS, canDelete, isCategory } from "@/components/Forum/api";
import { ForumReply, ForumThread, isObjectId } from "@/lib/forum/db";
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

  // Authors can delete their own thread; admins and supervisors can delete any.
  // The thread's replies go with it.
  DELETE: async (req, _res, me) => {
    const id = req.query.id;
    if (!isObjectId(id)) throw new HttpError(400, "Invalid thread");

    const thread = (await ForumThread.findById(id).lean()) as { authorEmail: string } | null;
    if (!thread) throw new HttpError(404, "Thread not found");
    if (!canDelete(me, thread.authorEmail)) throw new HttpError(403, "You can only delete your own threads");

    await ForumReply.deleteMany({ thread: id });
    await ForumThread.deleteOne({ _id: id });
    return { ok: true };
  },
});
