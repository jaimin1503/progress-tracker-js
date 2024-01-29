import Todo from "../models/todoModel.js";
import User from "../models/userModel.js";

export const newTodo = async (req, res) => {
  try {
    const userId = req.user.userid;
    const { title, tasks } = req.body;

    if (!(userId && title && tasks)) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID, title, and tasks for the new todo.",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a new todo
    const todo = await Todo.create({
      title,
      tasks,
    });

    // Associate the new todo with the user
    const updateUser = await User.findOneAndUpdate(
      { _id: userId }, // Assuming profileid is the ID of the profile document you want to update
      { $push: { todos: todo } }, // Corrected $push syntax
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Todo created successfully and associated with the user.",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while creating todo and associating with user, and the error is ${error}`,
    });
  }
};

export const deleteTodo = async (req, res) => {
  const id = req.params.todoid;
  try {
    await Todo.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "todo is deleted success fully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong while deleting todo and error is ${error}`,
    });
  }
};
export const editTodo = async (req, res) => {
  const id = req.params.todoid;
  try {
    const { title, tasks } = req.body;
    const todo = await Todo.findById(id);
    if (todo) {
      const newTodo = {};
      if (title) {
        newTodo.title = title;
      }
      if (tasks) {
        newTodo.tasks = tasks;
      }

      const updatedTodo = await Todo.findByIdAndUpdate(id, newTodo, {
        new: true,
      });
      return res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        todo: updatedTodo,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while editing todo, and the error is ${error}`,
    });
  }
};

export const getTodos = async (req, res) => {
  try {
    const userId = req.user.userid;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing in the request.",
      });
    }

    const user = await User.findById(userId).populate({
      path: "todos",
      model: "Todo",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All todos fetched successfully.",
      todos: user.todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while getting todos: ${error}`,
    });
  }
};
