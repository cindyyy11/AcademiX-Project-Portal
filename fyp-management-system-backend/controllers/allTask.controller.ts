import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createTask } from "../services/allTask.service";
import mongoose from "mongoose";
import AllTaskModel from "../models/allTask.model";



// create new task
export const newTask = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const userId = req.user?._id; 
      const projectId = req.params.id;
      console.log("Request body:", data, "Project ID:", projectId);

      if (!data.title) {
        throw new ErrorHandler("Title is required", 400);
      }

      data.projectId = projectId;
      data.userId = userId;

      console.log("Data received for task creation:", data);

      // Ensure task creation is awaited
      const task = await createTask(data, res, next);
      console.log("Task after creation:", task);


      res.status(201).json({ success: true, task });

    } catch (error: any) {
      console.error("Error in newTask:", error);
      next(error);
    }
  }
);

//get proposal -- any user
export const getTask = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {

    const projectId = req.params.id;
    const task = await AllTaskModel.findOne({ projectId: projectId }).sort({ createdAt: -1 });

    const taskDetails = {
      bookmark: task?.bookmark,
      projectId: task?.projectId,
      status: task?.status,
      title: task?.title,
      description: task?.description,
      category: task?.category,
      checklist: task?.checklist,
      totalTasks: task?.totalTasks,
      completedTasks: task?.completedTasks,
      dueDate: task?.dueDate,
      comments: task?.comments,
      userId: task?.userId,
      createdAt: task?.createdAt,
      updatedAt: task?.updatedAt,
    };

    res.status(200).json({
      success: true,
      taskDetails,
    });
    
  } catch (error: any) {
    next(new ErrorHandler(error.message, error.statusCode || 500));
  }
});




