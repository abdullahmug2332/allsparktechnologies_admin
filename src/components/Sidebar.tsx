import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Link, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { MdContactPhone } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { RiComputerLine } from "react-icons/ri";
import logo from "../assets/footer-logo.svg"; 
import { CgToday } from "react-icons/cg";
import { TiMessages } from "react-icons/ti";
import { GrBusinessService } from "react-icons/gr";
const Sidebar: React.FC = () => {
  const location = useLocation();
  const isAuthPage: Boolean = location.pathname === "/auth";

  const toggle = useSelector((state: RootState) => state.toggle.value);

  return (
    <section
      className={`${
        toggle ? "translate-x-[0px]" : "-translate-x-[100%]"
      } ${isAuthPage ? "hidden":"block"} w-[40%] sm:w-[30%] md:w-[20%] lg:w-[18%] xl:w-[15%] 2xl:w-[13%] h-[100vh] duration-500 bg fixed top-0 z-[20]`}
    >
      <img
        src={logo}
        alt="Logo"
        className="w-[120px] sm:w-[130px] md:w-[140px] mx-auto mt-[20px] hover:scale-[1.06] duration-300 cursor-pointer"
      />

      <div className="flex flex-col ml-[20px] md:ml-[40px] gap-[20px] mt-[90px]">
        <Link
          to="/"
          className="flex items-center gap-[10px] hover:scale-[1.06] duration-300 cursor-pointer"
        >
          <IoHome className="text-[21px] text-white" />
          <div className="text-white text-[16px] font-semibold">Home</div>
        </Link>
        <Link
          to="/about"
          className="flex items-center gap-[10px] hover:scale-[1.06] duration-300 cursor-pointer"
        >
          <FaInfoCircle className="text-[23px] text-white" />
          <div className="text-white text-[16px] font-semibold">About</div>
        </Link>
        <Link
          to="/services"
          className="flex items-center gap-[10px] hover:scale-[1.06] duration-300 cursor-pointer"
        >
          <RiComputerLine className="text-[21px] text-white" />
          <div className="text-white text-[16px] font-semibold">Services</div>
        </Link>
        <Link
          to="/subservices"
          className="flex items-center gap-[10px] hover:scale-[1.06] duration-300 cursor-pointer"
        >
          <GrBusinessService className="text-[21px] text-white" />
          <div className="text-white text-[16px] font-semibold">Sub Services</div>
        </Link>
        <Link
          to="/contact"
          className="flex items-center gap-[10px] hover:scale-[1.06] duration-300 cursor-pointer"
        >
          <MdContactPhone className="text-[21px] text-white" />
          <div className="text-white text-[16px] font-semibold">Contact</div>
        </Link>
        <Link
          to="/blog"
          className="flex items-center gap-[10px] hover:scale-[1.06] duration-300 cursor-pointer"
        >
          <CgToday className="text-[20px] text-white" />
          <div className="text-white text-[16px] font-semibold">Blogs</div>
        </Link>
        <Link
          to="/messages"
          className="flex items-center gap-[10px] hover:scale-[1.06] duration-300 cursor-pointer"
        >
          <TiMessages className="text-[20px] text-white" />
          <div className="text-white text-[16px] font-semibold">Messages</div>
        </Link>
      </div>
    </section>
  );
};

export default Sidebar;
