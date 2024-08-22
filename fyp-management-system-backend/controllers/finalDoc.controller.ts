import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createFinalDoc, updateFinalDocByProjectId } from "../services/finalDoc.service";
import mongoose from "mongoose";
import FinalDocumentationModel from "../models/finalDocumentation.model";

// upload final documentation
export const uploadFinalDoc = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body.finalDocDetails;
      const projectId = req.params.id;
      const userId = req.user?._id; 

      console.log("Request body:", data, "Project ID:", projectId);

      // if (!data.title) {
      //   throw new ErrorHandler("Title is required", 400);
      // }

      data.projectId = projectId;
      data.userId = userId;

      console.log("Data received for final documentation creation:", data);

      console.log("Creating final documentation in the database...");
      const finalDoc = await createFinalDoc(data, res, next);
      console.log("FinalDoc created successfully");

      res.status(201).json({ success: true, finalDoc });
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        return res
          .status(400)
          .json({
            success: false,
            error: `final documentation for project ID ${req.params.id} already exists`,
          });
      }
      console.error("Error in uploadFinalDoc:", error);
      next(error);
    }
  }
);


// edit final documentation
export const editFinalDoc = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {title, description, dueDate, finalDocGuidelineFile, status, reviewStatus, review} = req.body;
    const data = {title, description, dueDate, finalDocGuidelineFile, status, reviewStatus, review};
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

    // Update finalDoc based on project ID
    const updatedFinalDoc = await updateFinalDocByProjectId(objectId, data);

    // Check if finalDoc was found and updated
    if (!updatedFinalDoc) {
      return next(new ErrorHandler(`Final Doc for project ID ${projectId} not found`, 404));
    }

    // Respond with success message and updated final doc details
    res.status(200).json({
      success: true,
      finalDoc: updatedFinalDoc,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

// submit final documentation
export const submitFinalDoc = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { finalDocSubmission } = req.body;
    const reviewStatus = 'pending review';
    const data = {finalDocSubmission, userId, reviewStatus};
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

    // Update finalDoc based on project ID
    const updatedFinalDoc = await updateFinalDocByProjectId(objectId, data);

    
    // Check if finalDoc was found and updated
    if (!updatedFinalDoc) {
      return next(new ErrorHandler(`Final Doc for project ID ${projectId} not found`, 404));
    }

    // Respond with success message and updated final doc details
    res.status(200).json({
      success: true,
      finalDoc: updatedFinalDoc,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

// edit Status
export const editFinalStatus = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
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

    // Update  final doc based on project ID
    const updatedFinalDoc = await updateFinalDocByProjectId(objectId, data);

    // Check if  final doc was found and updated
    if (!updatedFinalDoc) {
      return next(new ErrorHandler(`final doc for project ID ${projectId} not found`, 404));
    }

    // Respond with success message and updated final doc details
    res.status(200).json({
      success: true,
      finalDoc: updatedFinalDoc,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

//get final documentation -- any user
export const getFinalDoc = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {

    const projectId = req.params.id;
    const finalDoc = await FinalDocumentationModel.findOne({ projectId: projectId }).sort({ createdAt: -1 });

    const finalDocDetails = {
      projectId: finalDoc?.projectId,
      title: finalDoc?.title,
      description: finalDoc?.description,
      dueDate: finalDoc?.dueDate,
      FinalDocGuidelineFile: finalDoc?.finalDocGuidelineFile,
      status: finalDoc?.status,
      FinalDocSubmission: finalDoc?.finalDocSubmission,
      review: finalDoc?.review,
      reviewStatus: finalDoc?.reviewStatus,
      createdAt: finalDoc?.createdAt,
      updatedAt: finalDoc?.updatedAt,
    };

    res.status(200).json({
      success: true,
      finalDocDetails,
    });
    
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});