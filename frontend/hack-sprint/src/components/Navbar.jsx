import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getDashboard } from '../backendApis/api';
import { Menu, X, User, Trophy, Terminal, LogOut, Coins, LogIn } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);

  const profileMenuRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!!token) {
      const fetchData = async () => {
        try {
          const res = await getDashboard();
          setUserInfo(res.data.userData);
        } catch (err) {
          console.log("Error fetching dashboard data", err)
        }
      };
      fetchData();
    }
    setIsLoggedIn(!!token)
  }, [location])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Hackathons', pageLink: '/hackathons', icon: Trophy },
    { name: 'Practice', pageLink: '/quest', icon: Terminal },
    { name: 'Leaderboard', pageLink: '/leaderboard', icon: Terminal }
  ]

  const handleNavigate = (link) => {
    navigate(link)
    setIsOpen(false)
    setShowProfileMenu(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUserInfo(null)
    setIsLoggedIn(false)
    navigate("/")
    setIsOpen(false)
    setShowProfileMenu(false)
  }

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("lastVisit");
    const storedCoins = parseInt(localStorage.getItem("coins") || "0", 10);
    const storedStreak = parseInt(localStorage.getItem("streak") || "0", 10);

    let newCoins = storedCoins;
    let newStreak = storedStreak;
    let rewardEarned = 0;

    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit === yesterday.toDateString()) {
        newStreak = storedStreak + 1; // continued streak
      } else {
        newStreak = 1; // reset streak
      }

      rewardEarned = 10 + Math.floor(newStreak / 5) * 5; // 10 coins + bonus every 5 days
      newCoins += rewardEarned;

      localStorage.setItem("coins", newCoins.toString());
      localStorage.setItem("streak", newStreak.toString());
      localStorage.setItem("lastVisit", today);
    }

    setCoins(newCoins);
    setStreak(newStreak);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showProfileMenu])

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-green-500/30'
        : 'bg-gray-900/80 backdrop-blur-sm border-b border-green-900/50'
        }`}>

        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />

        <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <img src='hackSprint.webp' className="w-full h-full object-contain" alt="HackSprint Logo" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-mono tracking-wide">
                HackSprint
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.pageLink)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition cursor-pointer"
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </button>
                )
              })}

              {/* Profile Dropdown */}
              <div className="relative ml-4" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg cursor-pointer"
                >
                  <User size={16} className="text-white" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-green-500/20 rounded-xl shadow-xl overflow-hidden">
                    {isLoggedIn ? (
                      <>
                        {/* User Info */}
                        <div className="flex items-center p-4 border-b border-green-500/20 bg-gray-800">
                          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                            {userInfo?.name ? userInfo.name[0].toUpperCase() : "U"}
                          </div>
                          <div className="ml-3">
                            <p className="text-white font-semibold">{userInfo?.name || "Guest User"}</p>
                            <p className="text-gray-400 text-xs">{userInfo?.email || ""}</p>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3 p-4">
                          <button
                            onClick={() => handleNavigate('/dashboard')}
                            className="flex flex-col items-center p-3 bg-gray-800 hover:bg-green-500/20 rounded-lg text-gray-200 cursor-pointer"
                          >
                            <User size={20} className="mb-1 text-green-400" />
                            <span className="text-xs">Profile</span>
                          </button>

                          {/* Coins Display (non-clickable) */}
                          <div className="flex flex-col items-center p-3 bg-gray-800 rounded-lg text-gray-200 select-none">
                            <Coins size={20} className="mb-1 text-yellow-400" />
                            <span className="text-xs">{coins || 0} Coins</span>
                          </div>
                        </div>

                        {/* Logout */}
                        <div className="flex flex-col p-2 border-t border-green-500/20">
                          <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-lg cursor-pointer"
                          >
                            <LogOut size={16} className="mr-2" /> Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4">
                        <button
                          onClick={() => handleNavigate('/account/login')}
                          className="flex items-center w-full px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer"
                        >
                          <LogIn size={16} className="mr-2" /> Login
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-green-400 transition p-2 rounded-lg hover:bg-green-500/10 cursor-pointer"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-green-500/20">
            <div className="container mx-auto px-3 sm:px-4 py-4">
              {/* Navigation Items */}
              <div className="space-y-2 mb-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.pageLink)}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition cursor-pointer"
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* User Section */}
              {isLoggedIn ? (
                <div className="border-t border-green-500/20 pt-4">
                  {/* User Info */}
                  <div className="flex items-center p-4 bg-gray-800 rounded-lg mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                      {userInfo?.name ? userInfo.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-white font-semibold">{userInfo?.name || "Guest User"}</p>
                      <p className="text-gray-400 text-sm">{userInfo?.email || ""}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Coins size={16} />
                      <span className="text-sm font-semibold">{userInfo?.coins || 10}</span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigate('/dashboard')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition cursor-pointer"
                    >
                      <User size={18} className="text-green-400" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-lg transition cursor-pointer"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-green-500/20 pt-4">
                  <button
                    onClick={() => handleNavigate('/account/login')}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition cursor-pointer"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="h-14 sm:h-16" />
    </>
  )
}

export default Navbar