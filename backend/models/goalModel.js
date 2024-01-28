import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["Done", "Review", "Pending"],
    default: "Pending",
  },
});

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  descriptiion: { type: String },
  tasks: [taskSchema],
  dueDate: {
    type: Date,
  },
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
