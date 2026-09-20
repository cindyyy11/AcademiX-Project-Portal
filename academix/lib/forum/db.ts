import mongoose, { Schema } from "mongoose";
import { CATEGORIES, LIMITS } from "@/components/Forum/api";

// Shares the connection (and MONGODB_URI) with the inbox.
export { connectDb, isObjectId } from "@/lib/inbox/db";

const threadSchema = new Schema({
  title: { type: String, required: true, maxlength: LIMITS.title },
  body: { type: String, required: true, maxlength: LIMITS.body },
  category: { type: String, enum: CATEGORIES, default: "General" },
  authorEmail: { type: String, required: true },
  authorName: { type: String, required: true },
  replyCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now, index: true },
});

const replySchema = new Schema({
  thread: { type: Schema.Types.ObjectId, required: true },
  authorEmail: { type: String, required: true },
  authorName: { type: String, required: true },
  text: { type: String, required: true, maxlength: LIMITS.reply },
  createdAt: { type: Date, default: Date.now },
});
replySchema.index({ thread: 1, createdAt: 1 });

export const ForumThread =
  mongoose.models.ForumThread || mongoose.model("ForumThread", threadSchema);
export const ForumReply =
  mongoose.models.ForumReply || mongoose.model("ForumReply", replySchema);
