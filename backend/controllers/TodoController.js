import Todo from "../models/todoModel.js";

export const newTodo = async (req, res) => {
  try {
    const { title, content, completed } = req.body;
    if (!(title && content)) {
      res.status(400).json({
        success: false,
        message: `please fill all the details`,
      });
      return;
    }
    const todo = await Todo.create({
      title,
      content,
      completed,
    });
    return res.status(200).json({
      success: true,
      message: "todo created success fully ",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong while creating todo and error is ${error}`,
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
    const { title, content, completed } = req.body;
    const todo = await Todo.findById(id);
    if (todo) {
      const newTodo = {};
      if (title) {
        newTodo.title = title;
      }
      if (content) {
        newTodo.content = content;
      }
      if (completed) {
        newTodo.completed = completed;
      }

      const updatedTodo = await Todo.findByIdAndUpdate(id, newTodo, {
        new: true,
      });
      return res.status(200).json({
        success: true,
        message: "todo updated successfully",
        profile: updatedTodo,
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
      message: `something went wrong while editing todo and error is ${error}`,
    });
  }
};
