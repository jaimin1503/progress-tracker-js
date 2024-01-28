import { useRecoilValue } from "recoil";
import SideBar from "../components/SideBar";
import { isopenState } from "../atoms/todoAtom";

const HomePage = () => {
  const isOpen = useRecoilValue(isopenState);
  console.log(isOpen);
  console.log("home render");
  return (
    <div>
      <SideBar />
    </div>
  );
};
export default HomePage;
