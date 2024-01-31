import { useState, useEffect } from "react";
import "./CompStyles.css";
import axios from "axios";

const TodoBlock = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const handleInputChange = (event) => {
    setTask(event.target.value);
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

  return (
    <div className=" flex mt-20">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className="todo-card border rounded-2xl h-[400px] w-[350px] flex flex-col mx-5 bg-blue-100"
        >
          <div className="title border-b border-gray-600 w-full flex justify-center bg-yellow-300 rounded-t-2xl">
            <h1 className=" text-3xl my-1 ">{todo?.title}</h1>
          </div>
          <div className="tasks flex flex-col p-5">
            {todo?.tasks.map((task) => (
              <div key={task?._id}>
                <input type="checkbox" id="cbtest" />
                <input
                  className="px-2 text-xl bg-transparent outline-none"
                  value={task.content}
                  onChange={handleInputChange}
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
