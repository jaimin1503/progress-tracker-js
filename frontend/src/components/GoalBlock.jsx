import axios from "axios";
import { useEffect, useState } from "react";

const GoalBlock = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5555/goal/getgoals`, { withCredentials: true })
      .then((res) => {
        setGoals(res.data.goals);
      })
      .catch((error) => console.error(error));
  }, []);

  const setGoal = () => {
    axios
      .post(`http://localhost:5555/goal/newgoal`, {}, { withCredentials: true })
      .then((res) => {
        const newGoal = res.data.goals;
        setGoals((prevGoals) => [...prevGoals, newGoal]);
        console.log(res.data.message);
      })
      .catch((error) => console.error(error));
  };
  return (
    <div>
      <div className="add-goal">
        <button
          onClick={setGoal}
          className=" m-5 text-xl cursor-pointer bg-blue-500 py-2 px-3 rounded-2xl"
        >
          Set new goal +
        </button>
      </div>
      <div className="goal w-[80vw] bg-yellow-300">
        {goals.map((goal, index) => (
          <div key={goal._id} className=" py-5">
            <div className=" flex flex-col items-center">
              <h1 className=" text-3xl py-3">{goal?.title}</h1>
              <p className=" py-2 pb-5">{goal?.description}</p>
            </div>
            <div className="">
              {goal?.subjects.map((subject, sub_idx) => (
                <div
                  key={subject._id}
                  className=" bg-purple-200 max-w-xs flex items-start"
                >
                  <div className=" flex my-5 flex-col items-start">
                    <div className=" text-2xl py-3 mx-auto">
                      {sub_idx}-{subject.title}
                    </div>

                    {subject?.topics.map((topic, tp_idx) => (
                      <div key={topic._id} className="topics flex py-3 mx-5">
                        <select
                          name="status"
                          id="status"
                          value={topic?.status}
                          className=" outline-none bg-transparent border border-purple-700 p-1 rounded-2xl text-"
                        >
                          <option value="Done">Done</option>
                          <option value="Pending">Pending</option>
                          <option value="Review">Review</option>
                        </select>
                        <h1 className="mx-3">
                          {tp_idx}-{topic.title}
                        </h1>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GoalBlock;
