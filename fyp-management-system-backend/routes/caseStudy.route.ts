import express from "express";
import { editCaseStudy, getCaseStudy, uploadCaseStudy } from "../controllers/caseStudy.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const caseStudyRouter = express.Router();

caseStudyRouter.post(
  "/create-case-study/:id",
  // isAutheticated,
  // authorizeRoles("admin", "supervisor"),
  uploadCaseStudy,
);

caseStudyRouter.put(
  "/edit-case-study/:id",
  // isAutheticated,
  // authorizeRoles("admin", "supervisor"), // Pass roles as individual arguments
  editCaseStudy,
);

caseStudyRouter.get(
  "/get-case-study/:id",
  // isAutheticated,
  getCaseStudy,
);



export default caseStudyRouter;
