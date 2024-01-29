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
      .catch(console.error());
  }, []);
  console.log(todos);
  return (
    <div>
      <div className="todo-card border rounded-2xl bg-blue-100 h-[500px] w-[370px] flex flex-col ">
        <div className="title border-b border-gray-600 w-full flex justify-center">
          <h1 className=" text-3xl my-1 ">{todos?.title}</h1>
        </div>
        <div className="tasks flex p-5">
          {/* {todos?.map((todo) => {
            <div key={todo._id}>
              <input type="checkbox" id="cbtest" />
              <input
                className="px-2 text-xl bg-transparent outline-none"
                value={task}
                onChange={handleInputChange}
              />
            </div>;
          })} */}
        </div>
      </div>
    </div>
  );
};
export default TodoBlock;
