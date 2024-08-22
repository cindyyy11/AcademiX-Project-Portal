import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createSuggestedResource,  updateResourceByProjectId } from "../services/suggestedResource.service";
import SuggestedResourcesModel from "../models/suggestedResources.model";
import mongoose from "mongoose";

// upload suggested resource
export const uploadSuggestedResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body.suggestedDetails;
    const projectId = req.params.id;
    console.log("Request body:", data, "Project ID:", projectId);

    // if (!data.title) {
    //   throw new ErrorHandler("Title is required", 400);
    // }

    data.projectId = projectId;

    console.log("Data received for resource creation:", data);

    console.log("Creating resource in the database...");
    const resource = await createSuggestedResource(data, res, next);
    console.log("Resource created successfully");

    res.status(201).json({ success: true, resource });

  } catch (error: any) {
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ success: false, error: `resource for project ID ${req.params.id} already exists` });
    }
    console.error("Error in uploadResource:", error);
    next(error); 
  }
};

// edit resource 
export const editResource = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
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

    // Update resource based on project ID
    const updatedResource = await updateResourceByProjectId(objectId, data);

    // Check if resource was found and updated
    if (!updatedResource) {
      return next(new ErrorHandler(`Resource for project ID ${projectId} not found`, 404));
    }

    // Respond with success message and updated resource details
    res.status(200).json({
      success: true,
      resource: updatedResource,
    });
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});



//get resource -- any user
export const getResource = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {

    const projectId = req.params.id;
    const suggestedResorce = await SuggestedResourcesModel.findOne({ projectId: projectId }).sort({ createdAt: -1 });

    const suggestedDetails = {
      projectId: suggestedResorce?.projectId,
      title: suggestedResorce?.title,
      description: suggestedResorce?.description,
      resourceDocument: suggestedResorce?.resourceDocument,
      websiteLinks: suggestedResorce?.websiteLinks,
      iframeVideo: suggestedResorce?.iframeVideo,
      status: suggestedResorce?.websiteLinks,
      createdAt: suggestedResorce?.createdAt,
      updatedAt: suggestedResorce?.updatedAt,
    };

    res.status(200).json({
      success: true,
      suggestedDetails,
    });
    
  } catch (error: any) {
    // Pass any caught error to the global error handling middleware
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});