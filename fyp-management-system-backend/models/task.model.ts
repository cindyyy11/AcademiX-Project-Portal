import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITask extends Document {
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  studentId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const TaskModel: Model<ITask> = mongoose.model("Task", taskSchema);
export default TaskModel;
