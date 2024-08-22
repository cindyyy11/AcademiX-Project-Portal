import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createProposal, updateProposalByProjectId } from "../services/proposal.service";
import mongoose from "mongoose";
import ProposalModel from "../models/proposal.model";

import multer from 'multer';


// upload proposal
export const uploadProposal = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body.proposalDetails;
      const userId = req.user?._id; 
      const projectId = req.params.id;
      console.log("Request body:", data, "Project ID:", projectId);

      // if (!data.title) {
      //   throw new ErrorHandler("Title is required", 400);
      // }

      data.projectId = projectId;
      data.userId = userId;

      console.log("Data received for proposal creation:", data);

      console.log("Creating proposal in the database...");
      const proposal = await createProposal(data, res, next);
      console.log("Proposal created successfully");

      res.status(201).json({ success: true, proposal });
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        return res
          .status(400)
          .json({
            success: false,
            error: `proposal for project ID ${req.params.id} already exists`,
          });
      }
      console.error("Error in uploadProposal:", error);
      next(error);
    }
  }
);

// edit proposal
export const editProposal = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {title, description, dueDate, proposalGuidelineFile, status, reviewStatus, review} = req.body;
    const data = {title, description, dueDate, proposalGuidelineFile, status, reviewStatus, review};
    console.log("Request body:", data);
    const projectId = req.params.id;

    // Validate if projectId is provided
    if (!projectId) {
      return next(new ErrorHandler('Project ID is required', 400));
    }

    // Ensure projectId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new ErrorHandler('Invalid project ID format', 400));
    }

    // Convert projectId to ObjectId
    const objectId = new mongoose.Types.ObjectId(projectId);

    // Update proposal based on project ID
    const updatedProposal = await updateProposalByProjectId(objectId, data);

    // Check if proposal was found and updated
    if (!updatedProposal) {
      return next(new ErrorHandler(`proposal for project ID ${projectId} not found`, 404));
    }

    // Respond with success message and updated proposal details
    res.status(200).json({
      success: true,
      proposal: updatedProposal,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

// edit Status
export const  editStatus = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {reviewStatus, review} = req.body;
    const data = {reviewStatus, review};
    console.log("Request body:", data);
    const projectId = req.params.id;

    // Validate if projectId is provided
    if (!projectId) {
      return next(new ErrorHandler('Project ID is required', 400));
    }

    // Ensure projectId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new ErrorHandler('Invalid project ID format', 400));
    }

    // Convert projectId to ObjectId
    const objectId = new mongoose.Types.ObjectId(projectId);

    // Update proposal based on project ID
    const updatedProposal = await updateProposalByProjectId(objectId, data);

    // Check if proposal was found and updated
    if (!updatedProposal) {
      return next(new ErrorHandler(`proposal for project ID ${projectId} not found`, 404));
    }

    // Respond with success message and updated proposal details
    res.status(200).json({
      success: true,
      proposal: updatedProposal,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

//submit proposal
export const submitProposal = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { proposalSubmission } = req.body;
    const reviewStatus = 'pending review';
    const data = { proposalSubmission, userId, reviewStatus };
    console.log("Request body:", data);
    const projectId = req.params.id;

    // Validate if projectId is provided
    if (!projectId) {
      return next(new ErrorHandler('Project ID is required', 400));
    }
    // Ensure projectId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new ErrorHandler('Invalid project ID format', 400));
    }
    // Convert projectId to ObjectId
    const objectId = new mongoose.Types.ObjectId(projectId);

    // Update proposal based on project ID
    const updatedProposal = await updateProposalByProjectId(objectId, data);

    // Check if proposal was found and updated
    if (!updatedProposal) {
      return next(new ErrorHandler(`proposal for project ID ${projectId} not found`, 404));
    }

    // Respond with success message and updated proposal details
    res.status(200).json({
      success: true,
      proposal: updatedProposal,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

//get proposal -- any user
export const getProposal = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {

    const projectId = req.params.id;
    const proposal = await ProposalModel.findOne({ projectId: projectId }).sort({ createdAt: -1 });

    const proposalDetails = {
      projectId: proposal?.projectId,
      title: proposal?.title,
      description: proposal?.description,
      dueDate: proposal?.dueDate,
      proposalGuidelineFile: proposal?.proposalGuidelineFile,
      status: proposal?.status,
      proposalSubmission: proposal?.proposalSubmission,
      review: proposal?.review,
      reviewStatus: proposal?.reviewStatus,
      createdAt: proposal?.createdAt,
      updatedAt: proposal?.updatedAt,
    };

    res.status(200).json({
      success: true,
      proposalDetails,
    });
    
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});




