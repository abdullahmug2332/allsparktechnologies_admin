import { useDispatch, useSelector } from "react-redux";
import { toggleValue } from "../redux/toggleSlice";
import type { RootState } from "../redux/store";
import { FiAlignLeft } from "react-icons/fi";
import { IoCall } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAuthPage : Boolean= location.pathname === "/auth"; 

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggle = useSelector((state: RootState) => state.toggle.value);
  const handleLogout = () => {
    const conformation = window.confirm("Are you sure you want to logout?");
    if (!conformation) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <section className={`${isAuthPage ? "hidden":"block"}  bg fixed top-0 left-0 w-full z-20`}>
      <div
        className={`${
          toggle === false
            ? "w-full"
            : "w-[64%] sm:w-[75%] md:w-[83%] xl:w-[86%] 2xl:w-[88%]"
        } top-0 left-0 duration-500 text-white  ml-auto`}
      >
        <div className="flex items-center justify-between py-[10px] px-[35px]">
          <div className="flex gap-[10px] md:gap-[40px] items-center">
            <FiAlignLeft
              className="text-[40px] hover:cursor-pointer"
              onClick={() => dispatch(toggleValue())}
            />
          </div>
          <div className="flex items-center gap-[10px] md:gap-[40px]">
            <div className="flex items-center gap-[5px] ">
              <FaBell className="text-[25px] mr-[20px] hover:scale-[1.06] duration-300 cursor-pointer" />
              <div className="flex items-center gap-[5px] hover:scale-[1.06] duration-300 cursor-pointer">
                <IoCall className="hidden sm:block" />
                <p className="text-[12px] md:text-[15px] text-white font-semibold hidden sm:block">
                  +1(616)308-1863
                </p>
              </div>
              <button
                className="border rounded-[2px] px-[20px] py-[6px] ml-[10px] hover:scale-105 cursor-pointer duration-500 font-semibold"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
