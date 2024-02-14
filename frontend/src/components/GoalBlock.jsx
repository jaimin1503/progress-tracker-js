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
      <div className="goal">
        {goals.map((goal, index) => (
          <div key={goal._id}>
            <input className=" outline-none" value={goal.title} />
            <h1>{goal?.subjects[0]?.title}</h1>
            <h1>{goal?.subjects[1]?.title}</h1>
            <h1>{goal?.subjects[0]?.topics[0]?.title}</h1>
            <h1>{goal?.subjects[0]?.topics[1]?.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GoalBlock;
