import mongoose, { Document, Schema, Model } from "mongoose";

export interface IFeedback extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  PurposeRelevanceRating: number;
  TimeGivenRating: number;
  SatisfactionRating: number;
  feedback: string;
  adminReadStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to Project model
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Reference to User model
  PurposeRelevanceRating: { type: Number, min: 1, max: 5, required: true },
  TimeGivenRating: { type: Number, min: 1, max: 5, required: true },
  SatisfactionRating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, required: true },
  adminReadStatus: { type: Boolean, default: false },
}, { timestamps: true });

const feedbackModel: Model<IFeedback> = mongoose.model<IFeedback>("Feedback", feedbackSchema);
export default feedbackModel;


