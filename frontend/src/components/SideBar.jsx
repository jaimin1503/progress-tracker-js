import todologo from "../assets/todoLogo.svg";
import goallogo from "../assets/goalLogo.svg";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isopenState } from "../atoms/todoAtom";

const SideBar = () => {
  const [isOpen, setIsOpen] = useRecoilState(isopenState);
  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="container-box flex flex-col items-center w-[250px] border-r h-screen"
      >
        <ul className=" m-5 flex flex-col">
          <li className="font-medium text-lg cursor-pointer m-3 py-2 px-4 rounded-2xl flex hover:bg-blue-100">
            <p>New todo </p> <img className=" pl-2" src={todologo} alt="" />
          </li>
          <li className="font-medium text-lg cursor-pointer m-3 py-2 px-4 rounded-2xl flex hover:bg-blue-100">
            <p>Set goal</p>
            <img className=" pl-2" src={goallogo} alt="" />
          </li>
        </ul>
      </div>
    </div>
  );
};
export default SideBar;
