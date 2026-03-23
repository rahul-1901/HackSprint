import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDashboard } from "../backendApis/api";
import {
  Menu, X, User, Trophy, Terminal, LogOut,
  Coins, LogIn, Crown, Github, GitBranch,
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const profileMenuRef = useRef(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setIsLoggedIn(false); return; }
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setUserInfo(res.data.userData);
        setIsLoggedIn(true);
      } catch { handleLogout(); }
    };
    fetchData();
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("lastVisit");
    const storedCoins  = parseInt(localStorage.getItem("coins")  || "0", 10);
    const storedStreak = parseInt(localStorage.getItem("streak") || "0", 10);
    let newCoins = storedCoins, newStreak = storedStreak;
    if (lastVisit !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      newStreak = lastVisit === yesterday.toDateString() ? storedStreak + 1 : 1;
      newCoins += 10 + Math.floor(newStreak / 5) * 5;
      localStorage.setItem("coins", newCoins.toString());
      localStorage.setItem("streak", newStreak.toString());
      localStorage.setItem("lastVisit", today);
    }
    setCoins(newCoins); setStreak(newStreak);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target))
        setShowProfileMenu(false);
    };
    if (showProfileMenu) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  const navItems = [
    { name: "Hackathons", pageLink: "/hackathons", icon: Trophy },
    { name: "Practice",   pageLink: "/quest",       icon: Terminal },
    { name: "Leaderboard",pageLink: "/leaderboard", icon: Crown },
  ];

  const handleNavigate = (link) => { navigate(link); setIsOpen(false); setShowProfileMenu(false); };
  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("email");
    setUserInfo(null); setIsLoggedIn(false);
    navigate("/"); setIsOpen(false); setShowProfileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`nb-root nb-nav fixed top-0 w-full z-50 transition-all duration-300 p-1 ${
        isScrolled
          ? "bg-[rgba(8,10,8,0.97)] backdrop-blur-xl border-b border-[rgba(95,255,96,0.15)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-[rgba(8,10,8,0.82)] backdrop-blur-sm border-b border-[rgba(95,255,96,0.08)]"
      }`}>

        {/* top scanline accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(95,255,96,0.35)] to-transparent pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex items-center justify-between h-14">

            {/* ── Logo ── */}
            <button onClick={() => handleNavigate("/")} className="flex items-center gap-[0.55rem] bg-transparent border-none cursor-pointer">
              <img src="/hackSprint.webp" className="w-8 h-8 object-contain" alt="HackSprint" />
              <span className="nb-syne font-extrabold text-[1.05rem] tracking-tight text-white">
                Hack<span className="text-[#5fff60]">Sprint</span>
              </span>
            </button>

            {/* ── Desktop nav ── */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ name, pageLink, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => handleNavigate(pageLink)}
                  className={`relative nb-root inline-flex items-center gap-[0.35rem] text-[0.65rem] tracking-[0.08em] uppercase px-[0.75rem] py-[0.45rem] rounded-[3px] cursor-pointer transition-all duration-150
                    ${isActive(pageLink)
                      ? "text-[#5fff60] bg-[rgba(95,255,96,0.08)] border border-[rgba(95,255,96,0.25)] nb-link-active"
                      : "text-[rgba(180,220,180,0.55)] border border-transparent hover:text-[#5fff60] hover:bg-[rgba(95,255,96,0.06)] hover:border-[rgba(95,255,96,0.15)]"
                    }`}
                >
                  <Icon size={13} /> {name}
                </button>
              ))}

              {/* icon group */}
              <div className="flex items-center gap-1 ml-3 pl-3 border-l border-[rgba(95,255,96,0.1)]">
                <button
                  onClick={() => window.open("https://github.com/devlup-labs/HackSprint", "_blank")}
                  title="GitHub"
                  className="nb-root w-8 h-8 flex items-center justify-center text-[rgba(95,255,96,0.35)] hover:text-[#5fff60] hover:shadow-[0_0_10px_rgba(95,255,96,0.3)] rounded-[3px] transition-all duration-200 cursor-pointer"
                >
                  <Github size={16} />
                </button>
                <button
                  onClick={() => window.open("https://miro.com/app/board/uXjVGHQV81E=/?share_link_id=472464826506", "_blank")}
                  title="Architecture"
                  className="nb-root w-8 h-8 flex items-center justify-center text-[rgba(95,255,96,0.35)] hover:text-[#5fff60] hover:shadow-[0_0_10px_rgba(95,255,96,0.3)] rounded-[3px] transition-all duration-200 cursor-pointer"
                >
                  <GitBranch size={16} />
                </button>
              </div>

              {/* profile button */}
              <div className="relative ml-1" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full bg-[rgba(95,255,96,0.12)] border-2 border-[rgba(95,255,96,0.3)] flex items-center justify-center hover:border-[rgba(95,255,96,0.6)] hover:shadow-[0_0_12px_rgba(95,255,96,0.2)] transition-all duration-200 cursor-pointer"
                >
                  {isLoggedIn && userInfo?.name
                    ? <span className="nb-syne font-extrabold text-[#5fff60] text-[0.7rem]">{userInfo.name[0].toUpperCase()}</span>
                    : <User size={14} className="text-[#5fff60]" />}
                </button>

                {/* ── Profile dropdown ── */}
                {showProfileMenu && (
                  <div className="nb-dropdown absolute right-0 mt-2 w-60 bg-[rgba(8,10,8,0.98)] border border-[rgba(95,255,96,0.15)] rounded-[4px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
                    {/* corner brackets */}
                    <span className="absolute top-[-1px] left-[-1px] w-[8px] h-[8px] border-t-2 border-l-2 border-[rgba(95,255,96,0.45)]" />
                    <span className="absolute bottom-[-1px] right-[-1px] w-[8px] h-[8px] border-b-2 border-r-2 border-[rgba(95,255,96,0.45)]" />

                    {isLoggedIn ? (
                      <>
                        {/* user header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(95,255,96,0.08)] bg-[rgba(95,255,96,0.04)]">
                          <div className="w-9 h-9 rounded-full bg-[rgba(95,255,96,0.12)] border-2 border-[rgba(95,255,96,0.3)] flex items-center justify-center flex-shrink-0">
                            <span className="nb-syne font-extrabold text-[#5fff60] text-[0.85rem]">
                              {userInfo?.name ? userInfo.name[0].toUpperCase() : "U"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="nb-root text-[0.75rem] font-semibold text-white truncate">{userInfo?.name || "Guest"}</p>
                            <p className="nb-root text-[0.6rem] text-[rgba(180,220,180,0.4)] truncate">{userInfo?.email || ""}</p>
                          </div>
                        </div>

                        {/* stats grid */}
                        <div className="grid grid-cols-2 gap-2 p-3">
                          <button
                            onClick={() => handleNavigate("/dashboard")}
                            className="nb-root flex flex-col items-center gap-1 p-2.5 bg-[rgba(95,255,96,0.05)] border border-[rgba(95,255,96,0.1)] rounded-[3px] text-[rgba(180,220,180,0.6)] hover:text-[#5fff60] hover:border-[rgba(95,255,96,0.28)] hover:bg-[rgba(95,255,96,0.08)] transition-all cursor-pointer"
                          >
                            <User size={15} className="text-[#5fff60]" />
                            <span className="text-[0.58rem] tracking-[0.06em] uppercase">Profile</span>
                          </button>
                          <div className="nb-coin-pulse nb-root flex flex-col items-center gap-1 p-2.5 bg-[rgba(255,184,77,0.06)] border border-[rgba(255,184,77,0.15)] rounded-[3px] select-none">
                            <Coins size={15} className="text-[#ffb84d]" />
                            <span className="text-[0.58rem] tracking-[0.06em] uppercase text-[rgba(255,184,77,0.7)]">{coins} Coins</span>
                          </div>
                        </div>

                        {/* logout */}
                        <div className="px-3 pb-3 border-t border-[rgba(95,255,96,0.08)] pt-2">
                          <button
                            onClick={handleLogout}
                            className="nb-root w-full flex items-center gap-2 text-[0.62rem] tracking-[0.06em] uppercase px-3 py-2 rounded-[3px] text-[rgba(255,80,80,0.6)] hover:text-[#ff6060] hover:bg-[rgba(255,60,60,0.06)] border border-transparent hover:border-[rgba(255,60,60,0.2)] transition-all cursor-pointer"
                          >
                            <LogOut size={13} /> Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-3">
                        <button
                          onClick={() => handleNavigate("/account/login")}
                          className="nb-root w-full flex items-center justify-center gap-2 text-[0.62rem] tracking-[0.08em] uppercase px-4 py-2.5 rounded-[3px] border cursor-pointer transition-all bg-[#5fff60] border-[#5fff60] text-[#050905] font-bold hover:bg-[#7fff80]"
                        >
                          <LogIn size={13} /> Login
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="md:hidden flex items-center justify-center p-1.5 rounded-[3px] border border-[rgba(95,255,96,0.12)] text-[rgba(95,255,96,0.55)] hover:border-[rgba(95,255,96,0.35)] hover:text-[#5fff60] transition-all cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {isOpen && (
          <div className="nb-mobile md:hidden bg-[rgba(8,10,8,0.98)] border-t border-[rgba(95,255,96,0.08)]">
            <div className="max-w-[1200px] mx-auto px-5 py-4 flex flex-col gap-1">

              {navItems.map(({ name, pageLink, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => handleNavigate(pageLink)}
                  className={`nb-root w-full inline-flex items-center justify-between text-[0.65rem] tracking-[0.08em] uppercase px-4 py-3 rounded-[3px] border cursor-pointer transition-all
                    ${isActive(pageLink)
                      ? "text-[#5fff60] bg-[rgba(95,255,96,0.08)] border-[rgba(95,255,96,0.25)]"
                      : "text-[rgba(180,220,180,0.55)] border-transparent hover:text-[#5fff60] hover:bg-[rgba(95,255,96,0.06)] hover:border-[rgba(95,255,96,0.15)]"
                    }`}
                >
                  <span className="flex items-center gap-2"><Icon size={13} /> {name}</span>
                </button>
              ))}

              {/* divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(95,255,96,0.1)] to-transparent my-2" />

              {isLoggedIn ? (
                <>
                  {/* user row */}
                  <div className="nb-root flex items-center gap-3 px-4 py-3 bg-[rgba(95,255,96,0.04)] border border-[rgba(95,255,96,0.1)] rounded-[3px]">
                    <div className="w-9 h-9 rounded-full bg-[rgba(95,255,96,0.12)] border-2 border-[rgba(95,255,96,0.3)] flex items-center justify-center flex-shrink-0">
                      <span className="nb-syne font-extrabold text-[#5fff60] text-[0.85rem]">
                        {userInfo?.name ? userInfo.name[0].toUpperCase() : "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="nb-root text-[0.72rem] font-semibold text-white truncate">{userInfo?.name || "Guest"}</p>
                      <p className="nb-root text-[0.58rem] text-[rgba(180,220,180,0.4)] truncate">{userInfo?.email || ""}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#ffb84d]">
                      <Coins size={13} />
                      <span className="nb-root text-[0.62rem] font-semibold">{coins || 0}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="nb-root w-full inline-flex items-center gap-2 text-[0.65rem] tracking-[0.08em] uppercase px-4 py-3 rounded-[3px] border border-transparent text-[rgba(180,220,180,0.55)] hover:text-[#5fff60] hover:bg-[rgba(95,255,96,0.06)] hover:border-[rgba(95,255,96,0.15)] transition-all cursor-pointer"
                  >
                    <User size={13} className="text-[#5fff60]" /> Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="nb-root w-full inline-flex items-center gap-2 text-[0.65rem] tracking-[0.08em] uppercase px-4 py-3 rounded-[3px] border border-transparent text-[rgba(255,80,80,0.55)] hover:text-[#ff6060] hover:bg-[rgba(255,60,60,0.06)] hover:border-[rgba(255,60,60,0.15)] transition-all cursor-pointer"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigate("/account/login")}
                  className="nb-root w-full inline-flex items-center justify-center gap-2 text-[0.65rem] tracking-[0.1em] uppercase px-4 py-3 rounded-[3px] border cursor-pointer bg-[#5fff60] border-[#5fff60] text-[#050905] font-bold hover:bg-[#7fff80] transition-all"
                >
                  <LogIn size={13} /> Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* spacer */}
      <div className="h-14" />
    </>
  );
};

export default Navbar;