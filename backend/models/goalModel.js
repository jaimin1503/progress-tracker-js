import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
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

const subjectSchema = new mongoose.Schema({
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
  topics: [topicSchema],
});

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: { type: String },
  subjects: [subjectSchema],
  dueDate: {
    type: Date,
  },
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
