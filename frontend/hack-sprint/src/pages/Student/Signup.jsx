import React from "react";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "../../components/GoogleLogin.jsx";

const GoogleAuthWrapper = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <GoogleLogin />
  </GoogleOAuthProvider>
);

function Signup() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        .sg-root { font-family: 'JetBrains Mono', monospace; }
        .sg-syne { font-family: 'Syne', sans-serif; }
        .sg-bg::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(95,255,96,.033) 1px, transparent 1px),
            linear-gradient(90deg, rgba(95,255,96,.033) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .sg-bg::after {
          content: ''; position: fixed; z-index: 0; pointer-events: none;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(95,255,96,.07) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .sg-card::before, .sg-card::after {
          content: ''; position: absolute;
          width: 12px; height: 12px; border-style: solid;
          border-color: rgba(95,255,96,.6);
        }
        .sg-card::before { top:-1px; left:-1px; border-width:2px 0 0 2px; }
        .sg-card::after  { bottom:-1px; right:-1px; border-width:0 2px 2px 0; }
      `}</style>

      <div className="sg-root sg-bg min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="sg-card relative z-10 w-full max-w-[400px] bg-[rgba(10,12,10,0.93)] border border-[rgba(95,255,96,0.18)] rounded-[4px] p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(95,255,96,0.08)]">
          <div className="sg-root inline-block text-[0.58rem] tracking-[0.18em] uppercase text-[#5fff60] border border-[rgba(95,255,96,0.25)] px-[0.65rem] py-[0.18rem] rounded-[2px] mb-4">
            new account
          </div>

          <h1
            className="sg-syne font-extrabold text-white leading-[1.05] tracking-tight mb-1"
            style={{ fontSize: "clamp(1.8rem,5vw,2.5rem)" }}
          >
            Student
            <br />
            <span className="text-[#5fff60]">Sign Up.</span>
          </h1>
          <p className="sg-root text-[0.62rem] tracking-[0.1em] uppercase text-[rgba(95,255,96,0.38)] mb-8">
            create your account
          </p>

          <GoogleAuthWrapper />

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[rgba(95,255,96,0.1)]" />
            <span className="sg-root text-[0.58rem] tracking-[0.1em] uppercase text-[rgba(95,255,96,0.3)]">
              or
            </span>
            <div className="flex-1 h-px bg-[rgba(95,255,96,0.1)]" />
          </div>

          <p className="sg-root text-[0.65rem] tracking-[0.04em] text-[rgba(180,220,180,0.4)] text-center">
            Already have an account?{" "}
            <Link
              to="/account/login"
              className="text-[#5fff60] hover:text-[#7fff80] transition-colors underline underline-offset-2"
            >
              Login
            </Link>
          </p>

          <p className="sg-root mt-5 text-[0.56rem] tracking-[0.06em] text-[rgba(95,255,96,0.6)] text-center">
            HACKSRPINT · ENCRYPTED · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
