import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import { signup, login } from "../controllers/authController.js";
import {
  newTodo,
  deleteTodo,
  editTodo,
} from "../controllers/TodoController.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/newtodo", auth, newTodo);
router.post("/deletetodo/:todoid", auth, deleteTodo);
router.put("/edittodo/:todoid", auth, editTodo);

export default router;
