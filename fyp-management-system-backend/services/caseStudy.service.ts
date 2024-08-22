import { Response } from "express";
import CaseStudyModel from "../models/caseStudy.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import mongoose from "mongoose";

// create case study
export const createCaseStudy = async (data: any) => {
  const caseStudy = await CaseStudyModel.create(data);
  return caseStudy;
};

export const updateCaseStudyByProjectId = async (projectId: mongoose.Types.ObjectId, data: any) => {
  // Find the latest case study for the given project ID
  const latestCaseStudy = await CaseStudyModel.findOne({ projectId: projectId }).sort({ createdAt: -1 });

  if (!latestCaseStudy) {
    throw new Error('No case study found for the given project ID');
  }

  // Update the latest case study
  const updatedCaseStudy = await CaseStudyModel.findByIdAndUpdate(
    latestCaseStudy._id,
    { $set: data },
    { new: true } // Return the updated document
  );

  return updatedCaseStudy;
};
