import Goal from "../models/goalModel.js";

export const newGoal = async (req, res) => {
  try {
    const { title, description, subjects, dueDate } = req.body;
    if (!(title && subjects && dueDate)) {
      res.status(400).json({
        success: false,
        message: `please fill all the details`,
      });
      return;
    }
    const goal = await Goal.create({
      title,
      description,
      subjects,
      dueDate,
    });
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
