import express from "express";
import { uploadFeedback, editFeedbackStatus, getFeedback } from "../controllers/feedback.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const feedbackRouter = express.Router();

feedbackRouter.post(
  "/create-feedback/:id",
  // isAutheticated,
  uploadFeedback
);

feedbackRouter.put(
  "/edit-feedback-status/:feedbackId",
  // isAutheticated,
  editFeedbackStatus
);

feedbackRouter.get(
  "/get-feedback/:id",
  // isAutheticated,
  getFeedback
);

export default feedbackRouter;
