import express from "express";
import {
  editProjectDetails,
  uploadProjectDetails,
  getProjectByUser,
  getSingleProject,
  getAllProjects,
  getProjectModificationDate
} from "../controllers/project.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";


const projectRouter = express.Router();

projectRouter.post(
  "/create-project-details",
  // isAutheticated,
  // authorizeRoles("admin", "supervisor"), // Pass roles as individual arguments
  uploadProjectDetails
);

projectRouter.put(
  "/edit-project-details/:id",
  // isAutheticated,
  // authorizeRoles("admin", "supervisor"), // Pass roles as individual arguments
  editProjectDetails
);

projectRouter.get(
  "/get-single-project/:id",
  // isAutheticated,
  getSingleProject,
);

projectRouter.get(
  "/get-all-projects",
  // isAutheticated,
  getAllProjects
)

projectRouter.get(
  "/get-project-details/:id",
  isAutheticated,
  getProjectByUser
);

projectRouter.get(
  "/get-modify-date/:id",
  // isAutheticated,
  getProjectModificationDate
)


export default projectRouter;
