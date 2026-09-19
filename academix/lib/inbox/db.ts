import mongoose, { Schema, Types } from "mongoose";

const globalCache = globalThis as unknown as {
  inboxMongoose?: { promise: Promise<typeof mongoose> | null };
};
const cache = (globalCache.inboxMongoose ??= { promise: null });

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
      .catch((e) => {
        cache.promise = null;
        throw e;
      });
  }
  await cache.promise;
};

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

const chatSchema = new Schema({
  members: { type: [String], required: true, index: true },
  name: { type: String },
  isGroup: { type: Boolean, default: false },
  lastMessageText: { type: String, default: "" },
  lastMessageAt: { type: Date, default: Date.now },
});

const messageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, required: true },
  senderEmail: { type: String, required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
});
messageSchema.index({ chat: 1, createdAt: 1 });

export const InboxUser =
  mongoose.models.InboxUser || mongoose.model("InboxUser", userSchema);
export const InboxChat =
  mongoose.models.InboxChat || mongoose.model("InboxChat", chatSchema);
export const InboxMessage =
  mongoose.models.InboxMessage || mongoose.model("InboxMessage", messageSchema);

export const isObjectId = (v: unknown): v is string =>
  typeof v === "string" && Types.ObjectId.isValid(v);
