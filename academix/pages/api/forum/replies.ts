import { LIMITS } from "@/components/Forum/api";
import { ForumReply, ForumThread, isObjectId } from "@/lib/forum/db";
import { HttpError, forumHandler } from "@/lib/forum/handler";

const requireThread = async (threadId: unknown) => {
  if (!isObjectId(threadId)) throw new HttpError(400, "Invalid thread");
  const thread = (await ForumThread.findById(threadId).lean()) as { _id: unknown } | null;
  if (!thread) throw new HttpError(404, "Thread not found");
  return thread;
};

const present = (r: any) => ({
  _id: String(r._id),
  thread: String(r.thread),
  authorEmail: r.authorEmail,
  authorName: r.authorName,
  text: r.text,
  createdAt: r.createdAt,
});

export default forumHandler({
  GET: async (req) => {
    const thread = await requireThread(req.query.threadId);
    const replies = await ForumReply.find({ thread: thread._id }).sort({ createdAt: 1 }).limit(200).lean();
    return replies.map(present);
  },

  POST: async (req, res, me) => {
    const thread = await requireThread(req.body?.threadId);

    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text) throw new HttpError(400, "Reply is empty");
    if (text.length > LIMITS.reply) throw new HttpError(400, `Reply is too long (${LIMITS.reply} characters max)`);

    const reply = await ForumReply.create({
      thread: thread._id,
      authorEmail: me.email,
      authorName: me.name,
      text,
    });
    await ForumThread.updateOne(
      { _id: thread._id },
      { $inc: { replyCount: 1 }, $set: { lastActivityAt: reply.createdAt } }
    );

    res.status(201);
    return present(reply.toObject());
  },
});
