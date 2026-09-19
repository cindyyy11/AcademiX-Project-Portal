import { InboxChat, InboxUser } from "@/lib/inbox/db";
import { HttpError, inboxHandler, normalizeEmail } from "@/lib/inbox/handler";

const MAX_MEMBERS = 20;

const present = async (chats: any[]) => {
  const emails = Array.from(new Set(chats.flatMap((c) => c.members as string[])));
  const users = await InboxUser.find({ email: { $in: emails } }).lean();
  const names = new Map(users.map((u: any) => [u.email, u.name]));

  return chats.map((c) => ({
    _id: String(c._id),
    name: c.name ?? null,
    isGroup: c.isGroup,
    members: (c.members as string[]).map((email) => ({ email, name: names.get(email) ?? email })),
    lastMessageText: c.lastMessageText,
    lastMessageAt: c.lastMessageAt,
  }));
};

export default inboxHandler({
  GET: async (_req, _res, me) => {
    const chats = await InboxChat.find({ members: me.email }).sort({ lastMessageAt: -1 }).limit(100).lean();
    return present(chats);
  },

  POST: async (req, res, me) => {
    const { emails, name } = req.body ?? {};
    if (!Array.isArray(emails)) throw new HttpError(400, "emails must be a list");

    const others = emails.map(normalizeEmail);
    if (others.some((e) => !e)) throw new HttpError(400, "One of the emails is not valid");

    const members = Array.from(new Set([me.email, ...(others as string[])])).sort();
    if (members.length < 2) throw new HttpError(400, "Pick at least one other person");
    if (members.length > MAX_MEMBERS) throw new HttpError(400, `Chats are limited to ${MAX_MEMBERS} people`);

    const isGroup = members.length > 2;
    if (!isGroup) {
      const existing = await InboxChat.findOne({ isGroup: false, members: { $all: members, $size: 2 } }).lean();
      if (existing) return (await present([existing]))[0];
    }

    const groupName = typeof name === "string" ? name.trim().slice(0, 60) : "";
    const chat = await InboxChat.create({ members, isGroup, name: isGroup ? groupName || undefined : undefined });
    res.status(201);
    return (await present([chat.toObject()]))[0];
  },
});
