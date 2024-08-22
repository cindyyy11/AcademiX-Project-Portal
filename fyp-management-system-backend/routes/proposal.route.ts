import express from "express";
import { uploadProposal, submitProposal, getProposal, editProposal, editStatus } from "../controllers/proposal.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const proposalRouter = express.Router();

proposalRouter.post(
  "/create-proposal/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  uploadProposal
);
proposalRouter.put(
  "/edit-proposal/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  editProposal,
);
proposalRouter.put(
  "/edit-status/:id",
  // isAutheticated,
  // authorizeRoles("supervisor"),
  editStatus,
);


proposalRouter.put(
  "/submit-proposal/:id",
  // isAutheticated,
  // authorizeRoles("student"),
  submitProposal,
);

proposalRouter.get(
  "/get-proposal/:id",
  // isAutheticated,
  getProposal,
);

export default proposalRouter;
