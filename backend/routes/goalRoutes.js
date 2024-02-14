import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";

import {
  getGoals,
  newGoal,
  updateStatus,
} from "../controllers/goalController.js";

router.post("/newgoal", auth, newGoal);
router.put(
  "/update-status/:goalId/:type/:subjectIndex/:topicIndex",
  auth,
  updateStatus
);
router.get("/getgoals", auth, getGoals);

export default router;
