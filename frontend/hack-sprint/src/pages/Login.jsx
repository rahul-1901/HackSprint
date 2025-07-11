// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { googleAuth } from '../backendApis/api'
// import { useGoogleLogin } from '@react-oauth/google'

// const Login = () => {
//     const [userData, setUserData] = useState([]);

//     const responseGoogle = async (authResult) => {
//         try {
//             if (authResult['code']) {
//                 const result = await googleAuth(authResult['code']);
//                 const { name, email } = result.data.user;
//                 const token = result.data.token;
//                 // console.log(result);
//                 localStorage.setItem("userToken", token);
//                 localStorage.setItem("userEmail", email);
//             }
//         } catch (error) {
//             console.error('Error while req google', error)
//         }
//     }

//     const googleLogin = useGoogleLogin({
//         onSuccess: responseGoogle,
//         onError: responseGoogle,
//         flow: 'auth-code'
//     })

//     const githubAuthLogin = () => {
//         window.location.assign("https://github.com/login/oauth/authorize?client_id=" + import.meta.env.VITE_GOOGLE_CLIENT_ID)
//     }

//     return (
//         <>
//             <div className='min-h-screen flex justify-center items-center bg-gray-900'>
//                 <div className='flex flex-col gap-5 items-center'>
//                     <button onClick={googleLogin} className='text-white border-2 border-green-800 px-4 py-2 rounded-xl cursor-pointer'>Google Login</button>
//                     <p className='text-white'>------Or-------</p>
//                     <button onClick={githubAuthLogin} className='text-white border-2 border-green-800 px-4 py-2 rounded-xl cursor-pointer'>Github Login</button>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Login

import React from "react";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "../components/GoogleLogin.jsx";

function Login() {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn } = useContext(AppContent);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      //   axios.defaults.withCredentials = true;


      const { data } = await axios.post(
        `${backendUrl}/api/account/login`,
        {
          email,
          password,
        },
      );

      if (data.success) {
        toast.success(data.message, {
          className: "text-sm max-w-xs",
        });
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token)
        localStorage.setItem("email", data.email)
        // getUserData();
        navigate("/");
      } else {
        toast.error(data.message, {
          className: "text-sm max-w-xs",
        });
      }
    } catch (err) {
      toast.error(err.message, {
        className: "text-sm max-w-xs",
      });
    }
  };

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin />
      </GoogleOAuthProvider>
    );
  };

  return (
    <div className="flex items-center justify-center bg-gray-900 min-h-screen">
      <div className="text-white shadow-[0_0_25px_#5fff60] p-10 rounded-xl w-full sm:w-136">
        <h2 className="text-4xl font-medium text-center text-green-500 mb-3">
          Login
        </h2>
        <p className="text-lg text-green-300 text-center mb-6">Login to your account!</p>
        <form onSubmit={handleLogin}>
          <div className="text-lg text-green-400 mb-6 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5C]">
            {/* <i class="fa-regular fa-envelope"></i> */}
            <i class="fa-solid fa-envelope"></i>
            <input
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email Id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-lg text-green-400 mb-2 flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5C]">
            <i class="fa-solid fa-lock"></i>
            <input
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a
            className="text-sm px-4 text-green-500 cursor-pointer"
            href="/account/reset-password"
          >
            Forgot password?
          </a>

          <button className="text-xl cursor-pointer w-full py-2 mt-6 mb-3 rounded-full bg-green-500">
            Login
          </button>

          <p className="text-md text-green-300 px-4 mb-3">
            Dont have an account? &nbsp;{" "}
            <Link to="/account/signup" className="text-green-500 cursor-pointer underline">Signup</Link>
          </p>

          {/* <p className="text-center text-lg">--- or ---</p> */}
          <div class="flex items-center justify-center my-4 mx-5">
            <hr class="border-t border-green-300 flex-grow" />
            <span class="px-4 text-green-500 text-lg">or</span>
            <hr class="border-t border-green-300 flex-grow" />
          </div>
        </form>
        <GoogleAuthWrapper />
      </div>
    </div>
  );
}

export default Login;