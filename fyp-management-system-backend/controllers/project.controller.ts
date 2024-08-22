import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createProjectDetails } from "../services/projectDetails.service";
import ProjectDetailsModel from "../models/projectDetails.model";
import mongoose from "mongoose";
import CaseStudyModel from "../models/caseStudy.model";
import SuggestedResourcesModel from "../models/suggestedResources.model";
import ProposalModel from "../models/proposal.model";
import FinalDocumentationModel from "../models/finalDocumentation.model";
import GradeModel from "../models/grade.model";

// upload project details
export const uploadProjectDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      console.log("Request body:", data);

      if (!data.title) {
        throw new ErrorHandler("Title is required", 400);
      }

      const title = data.title;
      console.log("Title received:", title);

      console.log("Creating project details in the database...");
      await createProjectDetails(data, res, next);
      console.log("Project details created successfully");
    } catch (error: any) {
      console.error("Error in uploadProjectDetails:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit project details
export const editProjectDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const projectId = req.params.id;

      // Validate if projectId is provided and valid ObjectId
      if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new ErrorHandler("Invalid project ID", 400));
      }

      // Remove supervisorId from data if it's empty or not provided
      if (data.supervisorId === "") {
        delete data.supervisorId;
      }

      // Build update object, excluding supervisorId if it's not provided
      const updateObject: any = { ...data };
      if (!data.hasOwnProperty("supervisorId")) {
        delete updateObject.supervisorId;
      }

      // Update project details
      const updatedProjectDetails = await ProjectDetailsModel.findByIdAndUpdate(
        projectId,
        { $set: updateObject },
        { new: true } // Return the updated document
      );

      // Check if project details were found and updated
      if (!updatedProjectDetails) {
        return next(
          new ErrorHandler(
            `Project details with ID ${projectId} not found`,
            404
          )
        );
      }

      // Respond with success message and updated project details
      res.status(200).json({
        success: true,
        projectDetails: updatedProjectDetails,
      });
    } catch (error: any) {
      console.error("Error updating project details:", error); // Log the error for debugging

      // Handle specific errors or pass to global error handling middleware
      if (error.name === "CastError") {
        return next(
          new ErrorHandler("Invalid project ID or supervisor ID format", 400)
        );
      }
      next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

//get project -- any user
export const getSingleProject = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await ProjectDetailsModel.findById(req.params.id)
        .populate("supervisorId", "name email") // Populate supervisorId with fields 'name' and 'email' from User model
        .exec();

      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }

      const projectDetails = {
        _id: project._id,
        title: project.title,
        about: project.about,
        objective: project.objective,
        categories: project.categories,
        handOutDate: project.handOutDate,
        dueDate: project.dueDate,
        supervisor: {
          // Include supervisor details from populated field
          _id: project.supervisorId._id,
          name: project.supervisorId.name,
          email: project.supervisorId.email,
          // Add other fields as needed
        },
        members: project.members || [],
      };

      res.status(200).json({
        success: true,
        projectDetails,
      });
    } catch (error: any) {
      // Pass any caught error to the global error handling middleware
      next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

//get all projects
export const getAllProjects = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await ProjectDetailsModel.find()
        .populate("supervisorId", "name email") // Optionally populate supervisorId with fields 'name' and 'email' from User model
        .exec();

      const projectDetails = projects.map((project) => ({
        _id: project._id || "", // Ensure a default value or handle null case appropriately
        title: project.title || "",
        about: project.about || "",
        objective: project.objective || "",
        categories: project.categories || "",
        handOutDate: project.handOutDate || null,
        dueDate: project.dueDate || null,
        supervisor: project.supervisorId
          ? {
              _id: project.supervisorId._id || "",
              name: project.supervisorId.name || "",
              email: project.supervisorId.email || "",
              // Add other fields as needed
            }
          : null,
        members: project.members || [],
      }));

      res.status(200).json({
        success: true,
        projects: projectDetails,
      });
    } catch (error: any) {
      // Pass any caught error to the global error handling middleware
      next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

// get project -- only for valid user
export const getProjectByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userProjectList = req.user?.projects;
      const projectId = req.params.id;
      const projectExists = userProjectList?.find(
        (project: any) => project._id === projectId
      );

      if (!projectExists) {
        return next(
          new ErrorHandler("You are not assigned to the project", 404)
        );
      }

      const project = await ProjectDetailsModel.findById(projectId);

      const projectDetails = {
        title: project?.title,
        about: project?.about,
        categories: project?.categories,
        handOutDate: project?.handOutDate,
        dueDate: project?.dueDate,
        supervisorId: project?.supervisorId,
        members: project?.members || [],
      };

      res.status(200).json({
        success: true,
        projectDetails,
      });
    } catch (error: any) {
      // Pass any caught error to the global error handling middleware
      next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

// get project status
export const getProjectModificationDate = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.id;

      if (!projectId) {
        return next(new ErrorHandler("Project ID is required", 400));
      }

      // Fetch documents by projectId
      const updateCaseStudy = await CaseStudyModel.findOne({ projectId });
      const updateResource = await SuggestedResourcesModel.findOne({ projectId });
      const updateProposal = await ProposalModel.findOne({ projectId });
      const updatePlanning = await ProposalModel.findOne({ projectId });
      const updateFinalDoc = await FinalDocumentationModel.findOne({ projectId });
      const updateGrade = await GradeModel.findOne({ projectId });

      const projectModificationDate = {
        caseStudyDate: updateCaseStudy?.updatedAt,
        resourceDate: updateResource?.updatedAt,
        proposalDate: updateProposal?.updatedAt,
        planningDate: updatePlanning?.updatedAt,
        finalDocDate: updateFinalDoc?.updatedAt,
        gradeDate: updateGrade?.updatedAt,
      };

      res.status(200).json({
        success: true,
        projectModificationDate,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
