import express from "express";
import { editResource, uploadSuggestedResource, getResource } from "../controllers/suggestedResource.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const suggestedResourceRouter = express.Router();

suggestedResourceRouter.post(
  "/create-suggested-resource/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  uploadSuggestedResource
);

suggestedResourceRouter.put(
  "/edit-suggested-resource/:id",
  isAutheticated,
  authorizeRoles("supervisor"),
  editResource,
);

suggestedResourceRouter.get(
  "/get-suggested-resource/:id",
  // isAutheticated,
  getResource,
);



export default suggestedResourceRouter;
