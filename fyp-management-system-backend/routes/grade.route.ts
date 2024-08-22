import express from "express";
import { editGrade, getGrade, uploadGrade } from "../controllers/grade.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const gradeRouter = express.Router();

gradeRouter.post(
  "/create-grade/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  uploadGrade
);
gradeRouter.put(
  "/edit-grade/:id",
  isAutheticated,
  authorizeRoles("supervisor"),
  editGrade
);
gradeRouter.get(
  "/get-grade/:id",
  // isAutheticated,
  getGrade
);

export default gradeRouter;
