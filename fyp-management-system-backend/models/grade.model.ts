import mongoose, { Document, Schema, Model } from "mongoose";

export interface IGrade extends Document {
  projectId: mongoose.Types.ObjectId;
  resultTranscripts?: string;
  proposalMarks: number; 
  finalDocumentationMarks: number;
  programImplementationMarks: number;
  overallReview: string;
  totalMarks: number; // Calculated: Total marks summing up all components
  createdAt: Date;
  updatedAt: Date;
}

const gradeSchema = new Schema<IGrade>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  resultTranscripts: { type: String }, // Optional field for binary data
  proposalMarks: { type: Number },
  finalDocumentationMarks: { type: Number },
  programImplementationMarks: { type: Number },
  overallReview: { type: String },
  totalMarks: {
    type: Number,
    default: function() {
      return (this.proposalMarks/100*20 || 0) + (this.finalDocumentationMarks/100*40 || 0) + (this.programImplementationMarks/100*40 || 0);
    }
  },
}, { timestamps: true });

const GradeModel: Model<IGrade> = mongoose.model("Grade", gradeSchema);
export default GradeModel;
