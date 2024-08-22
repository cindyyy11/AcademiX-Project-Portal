import express from "express";
import { editFinalDoc, getFinalDoc, uploadFinalDoc, submitFinalDoc, editFinalStatus } from "../controllers/finalDoc.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const finalDocRouter = express.Router();

finalDocRouter.post(
  "/create-final-doc/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  uploadFinalDoc
);

finalDocRouter.put(
  "/edit-final-doc/:id",
  isAutheticated,
  authorizeRoles("supervisor"),
  editFinalDoc
);

finalDocRouter.put(
  "/submit-final-doc/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  submitFinalDoc
);

finalDocRouter.put(
  "/edit-final-status/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  editFinalStatus,
);


finalDocRouter.get(
  "/get-final-doc/:id",
  // isAutheticated,
  getFinalDoc
);

export default finalDocRouter;
