import { Response, NextFunction } from "express";
import ProjectDetailsModel from "../models/projectDetails.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

// export const createProjectDetails = CatchAsyncError(
//   async (data: any, res: Response, next: NextFunction) => {
//     try {
//       console.log("Data received for project details creation:", data);
//       const projectDetails = await ProjectDetailsModel.create(data);
//       console.log("Project details created:", projectDetails);

//       res.status(201).json({
//         success: true,
//         projectDetails,
//       });
//     } catch (error: any) {
//       console.error("Error creating project details:", error);
//       throw error;
//     }
//   }
// );

export const createProjectDetails = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    try {
      console.log("Data received for project details creation:", data);
      const projectDetails = await ProjectDetailsModel.create(data);
      console.log("Project details created:", projectDetails);

      res.status(201).json({
        success: true,
        projectDetails,
      });
    } catch (error: any) {
      console.error("Error creating project details:", error);
      throw error;
    }
  }
);

