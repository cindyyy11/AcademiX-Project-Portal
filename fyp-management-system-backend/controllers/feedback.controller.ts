import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createFeedback, updateFeedbackByProjectId } from '../services/feedback.service';
import mongoose from "mongoose";
import feedbackModel from '../models/feedback.model';

export const uploadFeedback = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const projectId = req.params.id;
      const userId = req.user?._id;

      console.log("Request body:", data, "Project ID:", projectId, "User ID:", userId);

      if (!data.feedback) {
        throw new ErrorHandler("Feedback is required", 400);
      }

      data.projectId = projectId;
      data.userId = userId;

      console.log("Data received for feedback creation:", data);

      console.log("Creating feedback in the database...");
      const feedback = await createFeedback(data, res, next);
      console.log("Feedback created successfully");

      res.status(201).json({ success: true, feedback });
    } catch (error: any) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({
            success: false,
            error: `Feedback for project ID ${req.params.id} already exists`,
          });
      }
      console.error("Error in uploadFeedback:", error);
      next(error);
    }
  }
);


//edit feedback status
export const editFeedbackStatus = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminReadStatus } = req.body;
    const feedbackId = req.params.feedbackId;

    // Validate if projectId and feedbackId are provided
    if (!feedbackId) {
      return next(new ErrorHandler('Feedback ID are required', 400));
    }

    // Ensure projectId and feedbackId are valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      return next(new ErrorHandler('Feedback ID format', 400));
    }

    // Update feedback based on project ID and feedback ID
    const updatedFeedback = await feedbackModel.findByIdAndUpdate(
      feedbackId,
      { adminReadStatus },
      { new: true }
    );

    // Check if feedback was found and updated
    if (!updatedFeedback) {
      return next(new ErrorHandler(`Feedback with ID ${feedbackId} not found`, 404));
    }

    // Respond with success message and updated feedback details
    res.status(200).json({
      success: true,
      feedback: updatedFeedback,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});


//get feedback -- any user
export const getFeedback = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;

    // Fetch feedback sorted by createdAt descending
    const feedback = await feedbackModel.find({ projectId }).sort({ createdAt: -1 });

    // Map the feedback data to only necessary fields
    const feedbackDetails = feedback.map(feedback => ({
      feedbackId: feedback._id,
      projectId: feedback.projectId,
      userId: feedback.userId,
      PurposeRelevanceRating: feedback.PurposeRelevanceRating,
      TimeGivenRating: feedback.TimeGivenRating,
      SatisfactionRating: feedback.SatisfactionRating,
      feedback: feedback.feedback,
      adminReadStatus: feedback.adminReadStatus,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));

    res.status(200).json({
      success: true,
      feedbackDetails,
    });
    
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});
