import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { formShow, goalsState } from "../atoms/todoAtom";
import GoalForm from "../forms/GoalForm";

const GoalBlock = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useRecoilState(formShow);
  const formRef = useRef(null);

  const handleTitleChange = (
    goal_idx,
    subjectIndex,
    topicIndex,
    updatedValue
  ) => {
    const updatedGoals = [...goals];
    updatedGoals[goal_idx].subjects[subjectIndex].topics[topicIndex].title =
      updatedValue;
    setGoals(updatedGoals);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm, setShowForm]);

  const fetchData = () => {
    axios
      .get(`http://localhost:5555/goal/getgoals`, { withCredentials: true })
      .then((res) => {
        setGoals(res.data.goals);
        console.log(res.data.message);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addSubject = (goal_idx, goalId) => {
    axios
      .get(`http://localhost:5555/goal/${goalId}/addsubject`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.message);
        const newSubject = res.data.subject;
        setGoals((prevGoals) => {
          const updatedGoals = [...prevGoals];
          updatedGoals[goal_idx].subjects.push(newSubject);
          return updatedGoals;
        }).catch((error) => console.error(error));
      });
  };
  const addTopic = (goal_idx, sub_idx, goalId, subjectId) => {
    axios
      .get(`http://localhost:5555/goal/${goalId}/${subjectId}/addtopic`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.message);
        const newTopic = res.data.topic;
        setGoals((prevGoals) => {
          const updatedGoals = [...prevGoals];
          updatedGoals[goal_idx].subjects[sub_idx].topics.push(newTopic);
          return updatedGoals;
        });
      })
      .catch((error) => console.error(error));
  };
  const updateStatus = (
    updatedStatus,
    goalId,
    type,
    subjectIndex,
    topicIndex
  ) => {
    axios
      .put(
        `http://localhost:5555/goal/update-status/${goalId}/${type}/${subjectIndex}/${topicIndex}`,
        { newStatus: updatedStatus },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.message);
        fetchData();
      })
      .catch((error) => console.error(error));
  };

  const handleKeyPress = (
    event,
    goalId,
    subjectIndex,
    topicIndex,
    updatedValue
  ) => {
    if (event.key === "Enter") {
      axios
        .put(
          `http://localhost:5555/goal/update-title/${goalId}/${subjectIndex}/${topicIndex}`,
          { newValue: updatedValue },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data.message);
          fetchData();
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <div className="add-goal" ref={formRef}>
        <button
          onClick={() => setShowForm(!showForm)}
          className="m-5 text-xl cursor-pointer bg-blue-500 py-2 px-3 rounded-2xl"
        >
          Set new goal +
        </button>
        {showForm && (
          <div>
            <GoalForm setShowForm={setShowForm} />
          </div>
        )}
      </div>
      {goals && (
        <div className="goal w-[82vw] mx-auto">
          {goals.map((goal, index) => (
            <div key={goal._id} className="py-10 bg-blue-50 my-5 rounded-2xl">
              <h1
                onClick={() => addSubject(index, goal._id)}
                className=" mx-5 bg-blue-300 cursor-pointer w-fit px-5 py-2 absolute rounded-2xl"
              >
                Add new Subject +
              </h1>
              <div className="flex flex-col items-center ">
                <h1 className="text-3xl py-3 bg-blue-300 px-5 rounded-2xl">
                  {goal?.title}
                </h1>
                <p className="py-2 pb-5">{goal?.description}</p>
              </div>
              <div className="flex justify-around">
                {goal.subjects &&
                  goal?.subjects.map((subject, sub_idx) => (
                    <div
                      key={subject._id}
                      className="max-w-xs bg-blue-100 h-[40vh] overflow-y-scroll rounded-2xl flex items-start"
                    >
                      <div className="flex flex-col items-start w-[25vw]">
                        <div className="flex w-full">
                          <h1
                            onClick={() =>
                              addTopic(index, sub_idx, goal._id, subject._id)
                            }
                            className="absolute text-2xl m-5 px-2 cursor-pointer bg-blue-400 rounded-full"
                          >
                            +
                          </h1>
                          <h1 className="text-2xl py-2 mb-5 px-5 mt-3 rounded-xl mx-auto bg-blue-300">
                            {subject.title}
                          </h1>
                        </div>

                        {subject?.topics.map((topic, tp_idx) => (
                          <div
                            key={topic._id}
                            className="topics flex items-center my-2 ml-10"
                          >
                            <select
                              name="status"
                              id="status"
                              value={topic?.status}
                              onChange={(e) =>
                                updateStatus(
                                  e.target.value,
                                  goal._id,
                                  "topic",
                                  sub_idx,
                                  tp_idx
                                )
                              }
                              className="outline-none bg-transparent border border-blue-700 p-1 rounded-lg"
                            >
                              <option value="Done">Done</option>
                              <option value="Pending">Pending</option>
                              <option value="Review">Review</option>
                            </select>
                            <input
                              className="ml-3 bg-transparent w-42 outline-none"
                              value={topic.title}
                              onChange={(e) =>
                                handleTitleChange(
                                  index,
                                  sub_idx,
                                  tp_idx,
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) =>
                                handleKeyPress(
                                  e,
                                  goal._id,
                                  sub_idx,
                                  tp_idx,
                                  topic.title
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalBlock;
