import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, LogOut } from "lucide-react";

const Button = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default:
      "text-white hover:from-emerald-600 hover:to-green-700 flex items-center justify-center gap-2 transform transition-all duration-200 shadow-lg cursor-pointer shadow-emerald-400/15 hover:shadow-emerald-400/25",
    outline:
      "border-2 border-gray-700 text-gray-300 hover:text-white hover:border-emerald-400 hover:bg-emerald-400/10 flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-200",
  };
  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <header className="relative z-50 border-b border-gray-800 bg-gray-900 backdrop-blur-lg sticky top-0">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10">
            <img
              src="hackSprint.webp"
              className="w-full h-full object-contain"
              alt="HackSprint Logo"
            />
          </div>
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-mono tracking-wide">
            HackSprint
          </span>
        </button>

        <nav className="hidden md:flex items-center space-x-4">
          {isAdminLoggedIn ? (
            <>
              <Button onClick={() => navigate("/admin")}>
                <span>Dashboard</span>
              </Button>
              <Button
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <span>Logout</span>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/adminlogin")}>
              <span>Organize Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </nav>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full z-50 left-0 border-b-1 right-0 bg-gray-900 border-t border-gray-800 shadow-lg">
          <div className="p-4 space-y-4 flex flex-col">
            {isAdminLoggedIn ? (
              <>
                <Button
                  className="w-full justify-between"
                  onClick={() => {
                    navigate("/admin");
                    setIsMenuOpen(false);
                  }}
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  className="w-full justify-between flex items-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <span>Logout</span>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                className="w-full justify-between"
                onClick={() => {
                  navigate("/adminlogin");
                  setIsMenuOpen(false);
                }}
              >
                <span>Organize Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
