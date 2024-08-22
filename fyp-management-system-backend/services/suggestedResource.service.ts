import { Response } from "express";
import SuggestedResourcesModel from "../models/suggestedResources.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import mongoose from "mongoose";

// create suggestedResource
export const createSuggestedResource = CatchAsyncError(
  async (data: any, res: Response) => {
    const suggestedResource = await SuggestedResourcesModel.create(data);
    return suggestedResource;
  }
);

export const updateResourceByProjectId = async (
  projectId: mongoose.Types.ObjectId,
  data: any
) => {
  // Find the latest resource for the given project ID
  const lastestResource = await SuggestedResourcesModel.findOne({
    projectId: projectId,
  }).sort({ createdAt: -1 });

  if (!lastestResource) {
    throw new Error("No resource found for the given project ID");
  }

  // Update the latest resource
  const updatedResource = await SuggestedResourcesModel.findByIdAndUpdate(
    lastestResource._id,
    { $set: data },
    { new: true } // Return the updated document
  );

  return updatedResource;
};
