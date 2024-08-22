import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITaskAssignment extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const taskAssignmentSchema = new Schema<ITaskAssignment>({
  taskId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const TaskAssignmentModel: Model<ITaskAssignment> = mongoose.model("TaskAssignment", taskAssignmentSchema);
export default TaskAssignmentModel;
