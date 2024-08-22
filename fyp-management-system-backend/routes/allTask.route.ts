import express from "express";
import { getTask, newTask } from "../controllers/allTask.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const allTaskRouter = express.Router();

allTaskRouter.post(
  "/create-task/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  newTask
);

allTaskRouter.get(
  "/get-task/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  getTask
);

export default allTaskRouter;