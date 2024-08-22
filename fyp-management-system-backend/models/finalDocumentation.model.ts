import mongoose, { Document, Schema, Model } from "mongoose";

export interface IFinalDocumentation extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  finalDocGuidelineFile?: string; // Optional: File path for guideline file upload
  status: 'complete' | 'incomplete';
  reviewStatus?: 'no submission' | 'pending review' | 'approved' | 'rejected'; // Optional: Review status
  review?: string;
  
  userId?: mongoose.Types.ObjectId;
  finalDocSubmission?: string;

  createdAt: Date;
  updatedAt: Date;
}

const finalDocumentationSchema = new Schema<IFinalDocumentation>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to Project model
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  finalDocGuidelineFile: { type: String },
  status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete'},
  review: { type: String }, // Optional field for review comments
  reviewStatus: { type: String, enum: ['no submission', 'pending', 'approved', 'rejected'], default: 'no submission'  }, // Optional field for review status
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  finalDocSubmission: { type: String }, // Optional field for proposal submission
  
}, { timestamps: true });

const FinalDocumentationModel: Model<IFinalDocumentation> = mongoose.model("FinalDocumentation", finalDocumentationSchema);
export default FinalDocumentationModel;
