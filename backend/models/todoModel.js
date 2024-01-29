import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
