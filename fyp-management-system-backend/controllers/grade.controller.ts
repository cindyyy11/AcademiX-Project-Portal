import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createGrade, updateGradeByProjectId } from "../services/grade.service";
import mongoose from "mongoose";
import GradeModel from "../models/grade.model";

// upload grades
export const uploadGrade = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const projectId = req.params.id;

      console.log("Request body:", data, "Project ID:", projectId);

      if (!data.overallReview) {
        throw new ErrorHandler("Overall Review is required", 400);
      }

      data.projectId = projectId;

      console.log("Data received for grade creation:", data);

      console.log("Creating grade in the database...");
      const grade = await createGrade(data, res, next);
      console.log("grade created successfully");

      res.status(201).json({ success: true, grade });
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        return res
          .status(400)
          .json({
            success: false,
            error: `grade for project ID ${req.params.id} already exists`,
          });
      }
      console.error("Error in uploadGrade:", error);
      next(error);
    }
  }
);


// edit grade
export const editGrade = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
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

    // Update grade based on project ID
    const updatedGrade = await updateGradeByProjectId(objectId, data);

    // Check if grade was found and updated
    if (!updatedGrade) {
      return next(new ErrorHandler(`grade for project ID ${projectId} not found`, 404));
    }

    // Respond with success message and updated grade details
    res.status(200).json({
      success: true,
      grade: updatedGrade,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});

//get grade -- any user
export const getGrade = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {

    const projectId = req.params.id;
    const grade = await GradeModel.findOne({ projectId: projectId }).sort({ createdAt: -1 });

    const gradeDetails = {
      projectId: grade?.projectId,
      resultTranscripts: grade?.resultTranscripts,
      proposalMarks: grade?.proposalMarks,
      finalDocumentationMarks: grade?.finalDocumentationMarks,
      programImplementationMarks: grade?.programImplementationMarks,
      overallReview: grade?.overallReview,
      totalMarks: grade?.totalMarks,
      createdAt: grade?.createdAt,
      updatedAt: grade?.updatedAt,
    };

    res.status(200).json({
      success: true,
      gradeDetails,
    });
    
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});