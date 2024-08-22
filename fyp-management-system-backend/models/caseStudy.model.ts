import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICaseStudy extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  caseStudyDir: string; // Consider whether this is suitable for your file storage needs
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const caseStudySchema = new Schema<ICaseStudy>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true }, // Unique reference to Project model
  title: { type: String, required: true },
  description: { type: String, required: true },
  caseStudyDir: { type: String }, // Adjust as per your file storage requirements
  status: { type: String, default: 'incomplete' },
}, { timestamps: true });

caseStudySchema.index({ projectId: 1 }, { unique: true });

const CaseStudyModel: Model<ICaseStudy> = mongoose.model<ICaseStudy>("CaseStudy", caseStudySchema);
export default CaseStudyModel;
