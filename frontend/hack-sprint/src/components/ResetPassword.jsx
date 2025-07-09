import React from "react";
import { useState, useRef } from "react";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ResetPassword({ length = 6 }) {
  // axios.defaults.withCredentials = true;

  const { backendUrl } = useContext(AppContent);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEmailSent, setIsEmailSent] = useState("");
  const [otpValue, setOtpValue] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // allow only numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Move focus back
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });
  };

  const submitEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/account/send-reset-otp`,
        { email }
      );

      data.success
        ? toast.success(data.message, { className: "text-sm max-w-xs" })
        : toast.error(data.message, { className: "text-sm max-w-xs" });

      data.success && setIsEmailSent(true);
    } catch (err) {
      toast.error(err.message, { className: "text-sm max-w-xs" });
    }
  };

  const submitOTP = async (e) => {
    e.preventDefault();
    const otpArray = otp.join("");
    setOtpValue(otpArray);
    setIsOtpSubmitted(true);
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/account/reset-password`,
        { email: email, resetPasswordToken: otpValue, newPassword: newPassword }
      );

      data.success
        ? toast.success(data.message, { className: "text-sm max-w-xs" })
        : toast.error(data.message, { className: "text-sm max-w-xs" });

      if (data.success) {
        navigate("/account/login");
      }
    } catch (err) {
      toast.error(err.message, { className: "text-sm max-w-xs" });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 min-h-screen">
      {/* Enter email id */}

      {!isEmailSent && (
        <form
          onSubmit={submitEmail}
          className="flex flex-col items-center text-white bg-slate-900 p-10 rounded-xl shadow-lg w-full sm:w-116"
        >
          <h2 className="text-4xl font-medium text-center text-indigo-300 mb-3">
            Reset Password
          </h2>
          <p className="text-lg text-center mb-6">
            Enter your registered email address.
          </p>
          <div className="text-lg flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5C]">
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

          <button className="text-xl cursor-pointer w-full py-2 mt-6 mb-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900">
            Submit
          </button>
        </form>
      )}

      {/* verifify otp form for reset password */}

      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={submitOTP}
          className="flex flex-col items-center text-white bg-slate-900 p-10 rounded-xl shadow-lg w-full sm:w-116"
        >
          <h2 className="text-4xl font-medium text-center text-indigo-300 mb-3">
            Reset Password OTP
          </h2>
          <p className="text-lg text-center mb-6">
            Enter the 6-digit code sent to your email id.
          </p>
          <div className="flex gap-3 mb-4" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-xl border-2 border-gray-400 bg-[#333A5C] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                required
              />
            ))}
          </div>
          <button
            type="submit"
            // className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
            className="text-xl text-white cursor-pointer w-70 py-2 my-6 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900"
          >
            Verify OTP
          </button>
        </form>
      )}

      {/* new Password form */}

      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={submitNewPassword}
          className="flex flex-col items-center text-white bg-slate-900 p-10 rounded-xl shadow-lg w-full sm:w-116"
        >
          <h2 className="text-4xl font-medium text-center text-indigo-300 mb-3">
            New Password
          </h2>
          <p className="text-lg text-center mb-6">
            Enter the new password below.
          </p>
          <div className="text-lg flex items-center gap-3 px-5 py-2.5 w-full rounded-full bg-[#333A5C]">
            <i class="fa-solid fa-lock"></i>
            <input
              className="bg-transparent outline-none"
              type="password"
              placeholder="New password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button className="text-xl cursor-pointer w-full py-2 mt-6 mb-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;