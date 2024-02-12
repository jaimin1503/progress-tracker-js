import { useState, useEffect, useRef } from "react";
import "./CompStyles.css";
import axios from "axios";

const TodoBlock = () => {
  const [todos, setTodos] = useState([]);
  const taskInputRefs = useRef([]);

  const handleInputChange = (todo_idx, index, updatedValue) => {
    const updatedTodos = [...todos];
    updatedTodos[todo_idx].tasks[index].content = updatedValue;
    setTodos(updatedTodos);
  };

  const handleCheckboxChange = (checked, todo_idx, index, todo_id, task_id) => {
    const updatedTodos = [...todos];
    updatedTodos[todo_idx].tasks[index].done = checked;
    setTodos(updatedTodos);
    axios
      .put(
        `http://localhost:5555/user/todos/${todo_id}/tasks/${task_id}`,
        { done: checked }, // Use 'checked' instead of 'isChecked'
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5555/user/gettodos", { withCredentials: true })
      .then((res) => {
        setTodos(res.data.todos);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleKeyPress = (event, todo_id, task_id, updatedValue) => {
    if (event.key === "Enter") {
      console.log(updatedValue);
      axios
        .put(
          `http://localhost:5555/user/todos/${todo_id}/tasks/${task_id}`,
          { content: updatedValue },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data.message);
          // addTask(todo_id);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (event.key === "Backspace" && updatedValue === "") {
      console.log(event.key);
      axios
        .delete(
          `http://localhost:5555/user/todos/${todo_id}/deletetask/${task_id}`,
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const addTask = (todoId) => {
    if (todoId) {
      axios
        .post(
          `http://localhost:5555/user/todos/${todoId}/newtask`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const newTask = res.data.task;
          const todoIndex = todos.findIndex((todo) => todo._id === todoId);
          if (todoIndex !== -1) {
            setTodos((prevTodos) => {
              const updatedTodos = [...prevTodos];
              updatedTodos[todoIndex].tasks.push(newTask);
              return updatedTodos;
            });
            // Focus on the input field of the newly added task
            const newTaskIndex = todos[todoIndex].tasks.length - 1; // Index of the newly added task
            const inputRef = taskInputRefs.current[todoIndex][newTaskIndex];
            if (inputRef) {
              inputRef.focus();
            }
          }
          console.log(res.data.message);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className="flex mt-20 flex-wrap">
      {todos.map((todo, todo_idx) => (
        <div
          key={todo._id}
          className="todo-card my-3 border rounded-2xl h-[400px] w-[350px] flex flex-col mx-5 bg-blue-100"
        >
          <div className="title border-b border-gray-600 w-full flex justify-center bg-yellow-300 rounded-t-2xl">
            <input
              className="text-3xl my-1 bg-transparent outline-none"
              value={todo?.title}
              onChange={(e) => setTitle(todo_idx, e.target.value)}
            />
            <h1
              onClick={() => addTask(todo._id)}
              className=" text-3xl cursor-pointer text-gray-500 hover:text-black"
            >
              +
            </h1>
          </div>
          <div className="tasks flex flex-col p-5">
            {todo?.tasks.map((task, index) => (
              <div key={task?._id} className="flex items-start">
                <input
                  type="checkbox"
                  id={`cb_${todo_idx}_${index}`}
                  className="cursor-pointer mt-2"
                  checked={task?.done}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e.target.checked,
                      todo_idx,
                      index,
                      todo._id,
                      task._id
                    )
                  }
                />
                <label htmlFor={`cb_${todo_idx}_${index}`}></label>
                <input
                  ref={(el) => {
                    // Store ref for each input field
                    if (!taskInputRefs.current[todo_idx]) {
                      taskInputRefs.current[todo_idx] = [];
                    }
                    taskInputRefs.current[todo_idx][index] = el;
                  }}
                  className={`px-2 text-xl bg-transparent outline-none ${
                    !task.done ? "" : " text-gray-400 line-through"
                  }`}
                  value={task.content}
                  onChange={(e) =>
                    handleInputChange(todo_idx, index, e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, todo._id, task._id, task.content)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default TodoBlock;
