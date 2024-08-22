import { Response } from "express";
import ProposalModel from "../models/proposal.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import mongoose from "mongoose";

//upload proposal
export const createProposal = CatchAsyncError(
  async (data: any, res: Response) => {
    const proposal = await ProposalModel.create(data);
    return proposal;
  }
);

//edit proposal
export const updateProposalByProjectId = async (
  projectId: mongoose.Types.ObjectId,
  data: any
) => {
  // Find the latest proposal for the given project ID
  const latestProposal = await ProposalModel.findOne({
    projectId: projectId,
  }).sort({ createdAt: -1 });

  if (!latestProposal) {
    throw new Error("No proposal found for the given project ID");
  }

  // Update the latest proposal
  const updatedProposal = await ProposalModel.findByIdAndUpdate(
    latestProposal._id,
    { $set: data },
    { new: true } // Return the updated document
  );

  return updatedProposal;
};


