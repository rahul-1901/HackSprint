import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminhome");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        .font-mono-jb { font-family: 'JetBrains Mono', monospace; }
        .font-syne    { font-family: 'Syne', sans-serif; }
        .nav-scanline::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(95,255,96,0.28), transparent);
          pointer-events: none;
        }
      `}</style>

      <header
        className="
          nav-scanline
          sticky top-0 z-50
          font-mono-jb py-1
          bg-[rgba(8,10,8,0.93)]
          border-b border-[rgba(95,255,96,0.10)]
          backdrop-blur-xl
        "
      >
        <div className="max-w-[1200px] mx-auto px-5 h-15 flex items-center justify-between">
          {/* ── Logo ── */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
          >
            <img
              src="hackSprint.webp"
              alt="HackSprint Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-syne font-extrabold text-[1.1rem] tracking-tight text-white">
              Hack<span className="text-[#5fff60]">Sprint</span>
            </span>
          </button>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-2">
            {isAdminLoggedIn ? (
              <>
                {/* Dashboard */}
                <button
                  onClick={() => navigate("/admin")}
                  className="
                    font-mono-jb inline-flex items-center gap-1.5
                    text-[0.7rem] uppercase tracking-widest
                    px-4 py-[0.45rem] rounded-[3px] border cursor-pointer
                    bg-[rgba(95,255,96,0.10)] border-[rgba(95,255,96,0.30)] text-[#5fff60]
                    hover:bg-[rgba(95,255,96,0.18)] hover:border-[rgba(95,255,96,0.55)]
                    hover:shadow-[0_0_14px_rgba(95,255,96,0.15)]
                    transition-all duration-150
                  "
                >
                  <LayoutDashboard size={13} />
                  Dashboard
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="
                    font-mono-jb inline-flex items-center gap-1.5
                    text-[0.7rem] uppercase tracking-widest
                    px-4 py-[0.45rem] rounded-[3px] border cursor-pointer
                    bg-transparent border-[rgba(95,255,96,0.10)] text-[rgba(95,255,96,0.45)]
                    hover:bg-[rgba(255,60,60,0.07)] hover:border-[rgba(255,80,80,0.30)] hover:text-[#ff9090]
                    transition-all duration-150
                  "
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </>
            ) : (
              /* Organize Now */
              <button
                onClick={() => navigate("/adminlogin")}
                className="
                  font-mono-jb inline-flex items-center gap-1.5
                  text-[0.7rem] uppercase tracking-widest
                  px-4 py-[0.45rem] rounded-[3px] border cursor-pointer
                  bg-[rgba(95,255,96,0.10)] border-[rgba(95,255,96,0.30)] text-[#5fff60]
                  hover:bg-[rgba(95,255,96,0.18)] hover:border-[rgba(95,255,96,0.55)]
                  hover:shadow-[0_0_14px_rgba(95,255,96,0.15)]
                  transition-all duration-150
                "
              >
                Organize Now
                <ArrowRight size={13} />
              </button>
            )}
          </nav>

          {/* ── Hamburger ── */}
          <button
            className="
              md:hidden flex items-center justify-center
              p-1.5 rounded-[3px] border cursor-pointer
              bg-transparent border-[rgba(95,255,96,0.12)] text-[rgba(95,255,96,0.55)]
              hover:border-[rgba(95,255,96,0.35)] hover:text-[#5fff60]
              transition-all duration-150
            "
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {isMenuOpen && (
          <div
            className="
              md:hidden flex flex-col gap-2
              px-5 py-4
              border-t border-[rgba(95,255,96,0.08)]
              bg-[rgba(8,10,8,0.97)]
            "
          >
            {isAdminLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    navigate("/admin");
                    setIsMenuOpen(false);
                  }}
                  className="
                    font-mono-jb w-full inline-flex items-center justify-between
                    text-[0.7rem] uppercase tracking-widest
                    px-4 py-2.5 rounded-[3px] border cursor-pointer
                    bg-[rgba(95,255,96,0.10)] border-[rgba(95,255,96,0.30)] text-[#5fff60]
                    hover:bg-[rgba(95,255,96,0.18)] hover:border-[rgba(95,255,96,0.55)]
                    transition-all duration-150
                  "
                >
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard size={13} /> Dashboard
                  </span>
                  <ArrowRight size={13} />
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="
                    font-mono-jb w-full inline-flex items-center justify-between
                    text-[0.7rem] uppercase tracking-widest
                    px-4 py-2.5 rounded-[3px] border cursor-pointer
                    bg-transparent border-[rgba(95,255,96,0.10)] text-[rgba(95,255,96,0.45)]
                    hover:bg-[rgba(255,60,60,0.07)] hover:border-[rgba(255,80,80,0.30)] hover:text-[#ff9090]
                    transition-all duration-150
                  "
                >
                  <span className="flex items-center gap-1.5">
                    <LogOut size={13} /> Logout
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/adminlogin");
                  setIsMenuOpen(false);
                }}
                className="
                  font-mono-jb w-full inline-flex items-center justify-between
                  text-[0.7rem] uppercase tracking-widest
                  px-4 py-2.5 rounded-[3px] border cursor-pointer
                  bg-[rgba(95,255,96,0.10)] border-[rgba(95,255,96,0.30)] text-[#5fff60]
                  hover:bg-[rgba(95,255,96,0.18)] hover:border-[rgba(95,255,96,0.55)]
                  transition-all duration-150
                "
              >
                <span>Organize Now</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default AdminNavbar;
