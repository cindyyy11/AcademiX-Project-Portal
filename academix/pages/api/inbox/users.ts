import { InboxUser } from "@/lib/inbox/db";
import { inboxHandler } from "@/lib/inbox/handler";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default inboxHandler({
  // Registers the caller so others can find them when starting a chat.
  POST: async (_req, _res, me) => {
    await InboxUser.updateOne({ email: me.email }, { $set: { name: me.name } }, { upsert: true });
    return me;
  },

  GET: async (req, _res, me) => {
    const q = String(req.query.q ?? "").trim().slice(0, 50);
    if (!q) return [];
    const re = new RegExp(escapeRegex(q), "i");
    const users = await InboxUser.find({
      email: { $ne: me.email },
      $or: [{ email: re }, { name: re }],
    })
      .limit(8)
      .lean();
    return users.map((u: any) => ({ email: u.email, name: u.name }));
  },
});
