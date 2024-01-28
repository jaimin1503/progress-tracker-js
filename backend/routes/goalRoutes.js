import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";

import { newGoal, updateStatus } from "../controllers/goalController.js";

router.post("/newgoal", auth, newGoal);
router.put(
  "/update-status/:goalId/:type/:subjectIndex/:topicIndex",
  auth,
  updateStatus
);

export default router;
