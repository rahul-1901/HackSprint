import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post(`${backendUrl}/api/account/signup`, {
        name,
        email,
        password,
      });

      if (data.success) {
        console.log(data.verifyToken)
        localStorage.setItem("verifyToken", data.verifyToken)
        navigate("/account/verify-email");
      } else {
        toast.error(data.message, {
          className: "text-sm max-w-xs",
        });
      }
    } catch (err) {
      toast.error(data.message, {
        className: "text-sm max-w-xs",
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-indigo-300 min-h-screen">
      <div className="text-white bg-slate-900 p-10 rounded-xl shadow-lg w-full sm:w-136">
        <h2 className="text-4xl font-medium text-center text-indigo-300 mb-3">
          Signup
        </h2>
        <p className="text-lg text-center mb-6">Create your account!</p>
        <form onSubmit={handleSignup}>
          <div className="text-lg mb-6 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5C]">
            <i className="fa-solid fa-user"></i>
            <input
              className="bg-transparent outline-none"
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="text-lg mb-6 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5C]">
            {/* <i class="fa-regular fa-envelope"></i> */}
            <i className="fa-solid fa-envelope"></i>
            <input
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email Id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-lg mb-6 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5C]">
            <i className="fa-solid fa-lock"></i>
            <input
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="text-xl cursor-pointer w-full py-2 my-6 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900">
            Signup
          </button>

          <p className="text-md px-4 mb-3">
            Alread have an account? &nbsp;{" "}
            <a
              className="text-indigo-500 cursor-pointer underline"
              href="/account/login"
            >
              Login
            </a>
          </p>

          {/* <p className="text-center text-lg">--- or ---</p> */}
          <div className="flex items-center justify-center my-4 mx-5">
            <hr className="border-t border-gray-300 flex-grow" />
            <span className="px-4 text-gray-500 text-lg">or</span>
            <hr className="border-t border-gray-300 flex-grow" />
          </div>

          <button className="text-lg text-center text-gray-900 cursor-pointer w-full py-1.5 mt-3 mb-3 rounded-full bg-gray-300">
            <i className="fa-brands fa-google"></i> &nbsp; Login with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;