import React, { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { googleAuth } from "../backendApis/api";

export default function GoogleLogin() {

  const [userData, setUserData] = useState([]);

  const navigate = useNavigate();

  const { setIsLoggedIn } = useContext(AppContent);

  const responseGoogle = async (authResult) => {
    try {

      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        const { name, email } = result.data;
        const token = result.data.token;
        // console.log(result);
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        setIsLoggedIn(true)
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";

      toast.error(errorMessage, { className: "text-sm max-w-xs" });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div>
      <button
        onClick={googleLogin}
        className="text-lg text-center text-[#00FFC3] cursor-pointer w-full py-1.5 mt-3 mb-3 rounded-full bg-[#00FFC311] border-2 border-[#00FFC3] hover:border-[#00cfff] hover:bg-[#00cfff21] hover:text-[#00cfff] transition-transform duration-300 hover:scale-105"
      >
        <i className="fa-brands fa-google"></i> &nbsp; Login with Google
      </button>
    </div>
  );
}

// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { googleAuth } from '../backendApis/api'
// import { useGoogleLogin } from '@react-oauth/google'

// const Login = () => {

//   const navigate = useNavigate();

//   const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

//     // const [userData, setUserData] = useState([]);

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