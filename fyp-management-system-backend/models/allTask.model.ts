import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAllTask extends Document {
  projectId: mongoose.Types.ObjectId;
  bookmark: 'not important' | 'important';
  status: 'complete' | 'incomplete';
  title: string;
  description: string;
  category: string;
  checklist: string[];
  totalTasks: number;
  completedTasks: number;
  dueDate: Date;
  comments: string[];
  
  userId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const allTaskSchema = new Schema<IAllTask>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to Project model
  bookmark: { type: String, enum: ['not important', 'important'], default: 'not important'},
  status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete'},
  title: { type: String, required: true },
  description: { type: String , default: 'N/A'},
  category: { type: String, default: 'N/A'},
  checklist: { type: [String]},
  dueDate: { type: Date, required: true },
  totalTasks: { type: Number, default: 0},
  completedTasks: { type: Number, default: 0},
  comments: { type: [String] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const AllTaskModel: Model<IAllTask> = mongoose.model("Task", allTaskSchema);
export default AllTaskModel;
