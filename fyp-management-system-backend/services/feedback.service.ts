import { Response } from "express";
import feedbackModel from "../models/feedback.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import mongoose from "mongoose";

// create feedback
export const createFeedback = CatchAsyncError(async(data:any,res:Response)=>{
  const feedback = await feedbackModel.create(data);
  return feedback;
})

//edit feedback status
export const updateFeedbackByProjectId = async (
  projectId: mongoose.Types.ObjectId,
  data: any
) => {
  // Find the latest feedback for the given project ID
  const lastestFeedback = await feedbackModel.findOne({
    projectId: projectId,
  }).sort({ createdAt: -1 });

  if (!lastestFeedback) {
    throw new Error("No feedback found for the given project ID");
  }

  // Update the latest feedback
  const updatedFeedback = await feedbackModel.findByIdAndUpdate(
    lastestFeedback._id,
    { $set: data },
    { new: true } // Return the updated document
  );

  return updatedFeedback;
};
