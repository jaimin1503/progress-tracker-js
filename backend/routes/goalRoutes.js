import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";

import { newGoal } from "../controllers/goalController.js";

router.post("/newgoal", auth, newGoal);

export default router;
