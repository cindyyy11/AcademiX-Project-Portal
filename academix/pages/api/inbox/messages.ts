import { InboxChat, InboxMessage, isObjectId } from "@/lib/inbox/db";
import { HttpError, inboxHandler, type Me } from "@/lib/inbox/handler";

const requireMemberChat = async (chatId: unknown, me: Me) => {
  if (!isObjectId(chatId)) throw new HttpError(400, "Invalid chat");
  const chat = (await InboxChat.findOne({ _id: chatId, members: me.email }).lean()) as { _id: unknown } | null;
  if (!chat) throw new HttpError(404, "Chat not found");
  return chat;
};

const present = (m: any) => ({
  _id: String(m._id),
  chat: String(m.chat),
  senderEmail: m.senderEmail,
  senderName: m.senderName,
  text: m.text,
  createdAt: m.createdAt,
});

export default inboxHandler({
  // Without `after`: the latest 50 messages. With `after`: everything newer.
  GET: async (req, _res, me) => {
    const chat = await requireMemberChat(req.query.chatId, me);

    const after = req.query.after ? new Date(String(req.query.after)) : null;
    if (after && Number.isNaN(after.getTime())) throw new HttpError(400, "Invalid after");

    const messages = after
      ? await InboxMessage.find({ chat: chat._id, createdAt: { $gt: after } }).sort({ createdAt: 1 }).limit(200).lean()
      : (await InboxMessage.find({ chat: chat._id }).sort({ createdAt: -1 }).limit(50).lean()).reverse();

    return messages.map(present);
  },

  POST: async (req, res, me) => {
    const chat = await requireMemberChat(req.body?.chatId, me);

    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text) throw new HttpError(400, "Message is empty");
    if (text.length > 2000) throw new HttpError(400, "Message is too long (2000 characters max)");

    const message = await InboxMessage.create({
      chat: chat._id,
      senderEmail: me.email,
      senderName: me.name,
      text,
    });
    await InboxChat.updateOne(
      { _id: chat._id },
      { $set: { lastMessageText: text.slice(0, 120), lastMessageAt: message.createdAt } }
    );

    res.status(201);
    return present(message.toObject());
  },
});
