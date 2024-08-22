import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import AllTaskModel from "../models/allTask.model";
import ErrorHandler from "../utils/ErrorHandler";

export const createTask = CatchAsyncError(
  async (data: any, res: Response) => {
    const task = await AllTaskModel.create(data);
    // console.log("Task created:", task);
    return task;
  }
);
