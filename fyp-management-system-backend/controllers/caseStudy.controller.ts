import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import {
  createCaseStudy,
  updateCaseStudyByProjectId,
} from "../services/caseStudy.service";
import CaseStudyModel from "../models/caseStudy.model";
import mongoose from "mongoose";

// upload project details
// export const uploadCaseStudy = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { projectId, title, description, caseStudyDir } = req.body; // Assuming caseStudyDir comes from the file upload process

//     if (!title) {
//       throw new ErrorHandler("Title is required", 400);
//     }

//     const data = {
//       projectId,
//       title,
//       description,
//       caseStudyDir, // Ensure this is correctly populated based on your file upload logic
//     };
//     console.log("Data received for case study creation:", data);

//     console.log("Creating case study in the database...");
//     const caseStudy = await createCaseStudy(data);
//     console.log("Case study created successfully");

//     res.status(201).json({ success: true, caseStudy });

//   } catch (error: any) {
//     if (error.code === 11000) {
//       return res.status(400).json({ success: false, error: `Case study for project ID ${req.params.id} already exists` });
//     }
//     console.error("Error in uploadCaseStudy:", error);
//     next(error);
//   }
// };
export const uploadCaseStudy = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Request Body:", req.body);
      const { title, description, caseStudyDir } = req.body;
      const projectId = req.params.id;

      if (!title) {
        throw new ErrorHandler("Title is required", 400);
      }

      const caseStudyData = {
        projectId,
        title,
        description,
        caseStudyDir,
      };

      const caseStudy = await CaseStudyModel.create(caseStudyData);

      res.status(201).json({
        success: true,
        caseStudy,
      });
    } catch (error: any) {
      console.error("Error creating case study:", error);
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit case study
export const editCaseStudy = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      console.log("Request body:", data);
      const projectId = req.params.id;

      // Validate if projectId is provided
      if (!projectId) {
        return next(new ErrorHandler("Project ID is required", 400));
      }

      // Ensure projectId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new ErrorHandler("Invalid project ID format", 400));
      }

      // Convert projectId to ObjectId
      const objectId = new mongoose.Types.ObjectId(projectId);

      // Update case study based on project ID
      const updatedCaseStudy = await updateCaseStudyByProjectId(objectId, data);

      // Check if case study was found and updated
      if (!updatedCaseStudy) {
        return next(
          new ErrorHandler(
            `Case study for project ID ${projectId} not found`,
            404
          )
        );
      }

      // Respond with success message and updated case study details
      res.status(200).json({
        success: true,
        caseStudy: updatedCaseStudy,
      });
    } catch (error: any) {
      // Pass any caught error to the global error handling middleware
      next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

//get case study -- any user
export const getCaseStudy = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.id;
      const caseStudy = await CaseStudyModel.findOne({
        projectId: projectId,
      }).sort({ createdAt: -1 });

      const caseStudyDetails = {
        title: caseStudy?.title,
        description: caseStudy?.description,
        caseStudyDir: caseStudy?.caseStudyDir,
        status: caseStudy?.status,
        timestamp: caseStudy?.createdAt,
        updatedAt: caseStudy?.updatedAt,
      };

      res.status(200).json({
        success: true,
        caseStudyDetails,
      });
    } catch (error: any) {
      // Pass any caught error to the global error handling middleware
      next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
