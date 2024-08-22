import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProposal extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  proposalGuidelineFile?: string; // Optional: File path for guideline file upload
  status: 'complete' | 'incomplete';
  reviewStatus?: 'no submission' | 'pending review' | 'approved' | 'rejected'; // Optional: Review status
  review?: string;
  
  userId?: mongoose.Types.ObjectId;
  proposalSubmission?: string;

  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<IProposal>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to Project model
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  proposalGuidelineFile: { type: String },
  status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete'},
  
  proposalSubmission: { type: String }, // Optional field for proposal submission
  review: { type: String }, // Optional field for review comments
  reviewStatus: { type: String, enum: ['no submission', 'pending', 'approved', 'rejected'], default: 'no submission'  }, // Optional field for review status
}, { timestamps: true });

const ProposalModel: Model<IProposal> = mongoose.model("Proposal", proposalSchema);
export default ProposalModel;
