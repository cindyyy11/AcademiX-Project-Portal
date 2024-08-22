import { Response } from "express";
import GradeModel from "../models/grade.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import mongoose from "mongoose";

// create grade
export const createGrade = CatchAsyncError(async(data:any,res:Response)=>{
  const grade = await GradeModel.create(data);
  return grade;
})

//edit grade
export const updateGradeByProjectId = async (
  projectId: mongoose.Types.ObjectId,
  data: any
) => {
  // Find the latest grade for the given project ID
  const latestGrade = await GradeModel.findOne({
    projectId: projectId,
  }).sort({ createdAt: -1 });

  if (!latestGrade) {
    throw new Error("No grade found for the given project ID");
  }

  // Update the latest grade
  const updatedGrade = await GradeModel.findByIdAndUpdate(
    latestGrade._id,
    { $set: data },
    { new: true } // Return the updated document
  );

  return updatedGrade;
};
