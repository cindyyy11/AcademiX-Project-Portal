import { Response } from "express";
import FinalDocumentationModel from "../models/finalDocumentation.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import mongoose from "mongoose";

// create suggestedResource
export const createFinalDoc = CatchAsyncError(async(data:any,res:Response)=>{
    const finalDoc = await FinalDocumentationModel.create(data);
    return finalDoc;
})

//edit finalDoc
export const updateFinalDocByProjectId = async (
  projectId: mongoose.Types.ObjectId,
  data: any
) => {
  // Find the latest finalDoc for the given project ID
  const latestFinalDoc = await FinalDocumentationModel.findOne({
    projectId: projectId,
  }).sort({ createdAt: -1 });

  if (!latestFinalDoc) {
    throw new Error("No finalDoc found for the given project ID");
  }

  // Update the latest finalDoc
  const updatedFinalDoc = await FinalDocumentationModel.findByIdAndUpdate(
    latestFinalDoc._id,
    { $set: data },
    { new: true } // Return the updated document
  );

  return updatedFinalDoc;
};
