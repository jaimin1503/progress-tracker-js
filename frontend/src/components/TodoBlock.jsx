import { useState, useEffect } from "react";
import "./CompStyles.css";
import axios from "axios";

const TodoBlock = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  // const [updatedContent, setUpdatedContent] = useState("");

  const handleInputChange = (todo_idx, index, updatedValue) => {
    const updatedTodos = [...todos];
    updatedTodos[todo_idx].tasks[index].content = updatedValue;
    setTodos(updatedTodos);
  };

  const handleCheckboxChange = (checked, todo_idx, index, todo_id, task_id) => {
    const updatedTodos = [...todos];
    updatedTodos[todo_idx].tasks[index].done = checked;
    setTodos(updatedTodos);
    console.log(isChecked);
    axios
      .put(
        `http://localhost:5555/user/todos/${todo_id}/tasks/${task_id}`,
        { done: isChecked },
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
      axios
        .put(
          `http://localhost:5555/user/todos/${todo_id}/tasks/${task_id}`,
          { content: updatedValue },
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

  return (
    <div className=" flex mt-20 flex-wrap">
      {todos.map((todo, todo_idx) => (
        <div
          key={todo._id}
          className="todo-card border rounded-2xl h-[400px] w-[350px] flex flex-col mx-5 bg-blue-100"
        >
          <div className="title border-b border-gray-600 w-full flex justify-center bg-yellow-300 rounded-t-2xl">
            <input
              className=" text-3xl my-1 bg-transparent outline-none"
              value={todo?.title}
              onChange={(e) => setTitle(todo_idx, e.target.value)}
            />
          </div>
          <div className="tasks flex flex-col p-5">
            {todo?.tasks.map((task, index) => (
              <div key={task?._id} className="flex items-start">
                <input
                  type="checkbox"
                  id="cbtest"
                  className=" cursor-pointer mt-2"
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
                <input
                  className="px-2 text-xl bg-transparent outline-none"
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
