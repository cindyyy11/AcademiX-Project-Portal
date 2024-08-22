// authenticateProjectAccess.ts

import { NextFunction, Request, Response } from "express";
import  ErrorHandler  from "../utils/ErrorHandler";

/**
 * Middleware to authenticate user's access to a project based on assigned projects.
 * Assumes projects are stored in req.user.projects.
 */
export const authenticateProjectAccess = (req: Request, res: Response, next: NextFunction) => {
  const userProjects = req.user?.projects; // Assuming projects are stored in req.user.projects

  if (!userProjects) {
    return next(new ErrorHandler("User has no assigned projects", 403));
  }

  const projectId = req.params.id; // Assuming project ID is part of the request params

  const projectExists = userProjects.some((project: any) => project.projectId === projectId);

  if (!projectExists) {
    return next(new ErrorHandler("Unauthorized access to this project", 403));
  }

  // If user is authorized, proceed to the next middleware or route handler
  next();
};
