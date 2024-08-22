import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISuggestedResources extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  resourceDocument?: string; // Optional: Binary data for document upload
  websiteLinks?: string[]; // Array of website URLs
  iframeVideo?: string; // Optional: URL for iframe video
  status: string; // Status like 'complete', 'incomplete', etc.
  createdAt: Date;
  updatedAt: Date;
}

const suggestedResourcesSchema = new Schema<ISuggestedResources>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to Project model
  title: { type: String, required: true },
  description: { type: String, required: true },
  resourceDocument: { type: String }, // Optional field for binary data
  websiteLinks: [{ type: String }], // Array of website URLs
  iframeVideo: { type: String }, // Optional field for iframe video URL
  status: { type: String, default: 'incomplete' }, // Default status
}, { timestamps: true });

const SuggestedResourcesModel: Model<ISuggestedResources> = mongoose.model("SuggestedResources", suggestedResourcesSchema);
export default SuggestedResourcesModel;

