import mongoose, { Document, Schema, Model } from "mongoose";
import UserModel, { IUser } from "./user.model";

export interface IProjectDetails extends Document {
  title: string;
  about: string;
  categories: string;
  objective: string;
  handOutDate: Date;
  dueDate: Date;
  supervisorId: mongoose.Types.ObjectId | IUser; // Reference to User model
  members: (mongoose.Types.ObjectId | IUser)[]; // Array of references to User model
}

const projectDetailsSchema = new Schema<IProjectDetails>({
  title: { type: String, required: true },
  about: { type: String, required: true },
  categories: { type: String, required: true },
  objective: { type: String, required: true },
  handOutDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  }, // Reference to User model
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  }], // Array of references to User model
}, { timestamps: true });

const ProjectDetailsModel: Model<IProjectDetails> = mongoose.model("ProjectDetails", projectDetailsSchema);
export default ProjectDetailsModel;