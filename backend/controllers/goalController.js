import { Goal, Subject, Topic } from "../models/goalModel.js";
import User from "../models/userModel.js";

export const newGoal = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!(title && description && dueDate)) {
      return res.status(404).json({
        success: false,
        message: "Provide all the required fields",
      });
    }
    const userId = req.user.userid;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const goal = await Goal.create({
      title,
      description,
      dueDate,
    });

    const updateUser = await User.findOneAndUpdate(
      { _id: userId }, // Assuming profileid is the ID of the profile document you want to update
      { $push: { goals: goal } }, // Corrected $push syntax
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "The goal is set",
      goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong while creating goal and error is ${error}`,
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.user.userid;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing in the request.",
      });
    }

    const user = await User.findById(userId)
      .populate({
        path: "goals",
        model: "Goal",
        populate: {
          path: "subjects",
          model: "Subject",
          populate: {
            path: "topics",
            model: "Topic",
          },
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All goals fetched successfully.",
      goals: user.goals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while getting goals: ${error}`,
    });
  }
};

export const addTopic = async (req, res) => {
  const { goalId, subjectId } = req.params;

  if (!subjectId && !goalId) {
    return res.status(400).json({
      success: false,
      message: "subject not found",
    });
  } else {
    const topic = await Topic.create({
      title: "Set title",
      status: "Pending",
    });

    await Goal.findOneAndUpdate(
      { _id: goalId, "subjects._id": subjectId },
      { $push: { "subjects.$.topics": topic } }
    );

    await Subject.findOneAndUpdate(
      { _id: subjectId },
      { $push: { topics: topic } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "topic created successfully ",
      topic,
    });
  }
};

export const addSubject = async (req, res) => {
  const { goalId } = req.params;

  if (!goalId) {
    return res.status(400).json({
      success: false,
      message: "goal not found",
    });
  } else {
    const subject = await Subject.create({
      title: "Set title",
      status: "Pending",
      topics: [],
    });
    await Goal.findByIdAndUpdate(
      { _id: goalId },
      { $push: { subjects: subject } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "subject created successfully ",
      subject,
    });
  }
};

export const updateStatus = async (req, res) => {
  const { goalId, type, subjectIndex, topicIndex } = req.params;
  const newStatus = req.body.newStatus;

  try {
    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Update status based on type
    if (type === "subject") {
      goal.subjects[subjectIndex].status = newStatus;
    } else if (type === "topic") {
      goal.subjects[subjectIndex].topics[topicIndex].status = newStatus;
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    // Save the updated goal
    await goal.save();

    return res.json({ message: "Status updated successfully", goal });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};