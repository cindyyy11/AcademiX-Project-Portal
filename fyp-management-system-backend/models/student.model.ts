import mongoose, { Document, Schema, Model } from "mongoose";

export interface IStudent extends Document {
  name: string;
  program: string;
  programTitle: string;
  graduationSession: string;
  supervisorId: mongoose.Types.ObjectId;
}

const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  program: { type: String, required: true },
  programTitle: { type: String, required: true },
  graduationSession: { type: String, required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const StudentModel: Model<IStudent> = mongoose.model("Student", studentSchema);
export default StudentModel;
