import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import img1 from "../assets/auth.jpg";
import img2 from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { PiSmileySad } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { baseURL } from "../../API/baseURL";
import Loader from "../components/Loader";

const Login: React.FC = () => {
  const [toogle, setToogle] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (password.length >= 8) {
      setToogle(false);
    }
  }, [password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setToogle(true);
    } else {
      try {
        setIsLoading(true);
        const res = await fetch(`${baseURL}/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          
          dispatch(
            setUser({
              name: data.user.name,
              email: data.user.email,
              token: data.token,
            })
          );
          localStorage.setItem("token", data.token);
          setIsLoading(false);
          navigate("/");
        } else {
          alert(data.error || "Login Failed");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong");
      }finally{
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="bg-blue-100 min-h-[100vh] py-[60px]">
      {isLoading && <Loader />}
      <div className="w-[95%] md:w-[80%] min-h-[600px] bg-white mx-auto border p-[30px] flex items-center relative">
        <div className="w-[45%] hidden md:block ">
          <div>
            <img src={img1} className="w-full" alt="Banner" />
            <img
              src={img2}
              className=" w-[200px] absolute top-[10px] left-2 p-[20px] rounded-[20px]"
              alt="Logo"
            />
          </div>
        </div>
        <div className="w-[100%] md:w-[55%] px-[20px] md:pl-[50px] relative">
          <p className="p mt-[20px]">You can get your stats with</p>
          <p className="color text-[35px] font-semibold mb-[30px]">
            Sign In to All Spark Technologies
          </p>
          <form onSubmit={handleSubmit}>
            <label className="mt-[20px]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input focus:ring-2 ring-[#18185E] outline-none"
              type="email"
              placeholder="Enter Your Email"
              required
            />
            <label className="mt-[20px]">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input focus:ring-2 ring-[#18185E] outline-none"
              type="password"
              placeholder="Enter Password"
              required
            />
            <div
              className={`${
                toogle ? "h-[25px]" : "h-[0px]"
              } color text-[15px] flex items-center gap-2 overflow-hidden`}
            >
              <p className="text-[12px] md:text-[15px]">
                Password must be 8 characters long
              </p>
              <PiSmileySad className="text-[18px] md:text-[22px]" />
            </div>
            <button type="submit" className="btn mt-[30px]">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
