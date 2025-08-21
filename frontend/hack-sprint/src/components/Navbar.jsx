import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getDashboard } from '../backendApis/api';
import { 
  Menu, X, Trophy, Terminal, 
  User, LogOut, Wallet
} from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false) // dropdown state

  useEffect(() => {
    const userThere = localStorage.getItem("token")
    if (!!userThere) {
      const fetchData = async () => {
        try {
          const res = await getDashboard();
          setUserInfo(res.data.userData);
        } catch (err) {
          console.log("Error...")
        }
      };
      fetchData();
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [location])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { name: 'Hackathons', pageLink: '/hackathons', icon: Trophy },
    { name: 'Practice', pageLink: '/quest', icon: Terminal },
  ]

  const handleNavigate = (link) => {
    navigate(link)
    setIsOpen(false)
    setShowProfileMenu(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/account/login")
    setShowProfileMenu(false)
  }

  const getActiveItem = () => {
    const currentItem = navItems.find(item => item.pageLink === location.pathname)
    return currentItem ? currentItem.name : 'Home'
  }

  return (
    <>
      {/* Animated background particles */}
      <div className="fixed top-0 left-0 right-0 h-16 sm:h-20 pointer-events-none z-40 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-green-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-green-500/30'
          : 'bg-gray-900/80 backdrop-blur-sm border-b border-green-900/50'
      }`}>

        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />

        <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <button onClick={() => handleNavigate('/')} className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <img src='hackSprint.webp' className="w-full h-full object-contain" alt="HackSprint Logo" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-mono tracking-wide">
                HackSprint
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = getActiveItem() === item.name
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.pageLink)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-green-500/20 text-green-400' : 'text-gray-300 hover:text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm lg:text-base">{item.name}</span>
                  </button>
                )
              })}

              {/* Profile Dropdown */}
              {isLoggedIn && (
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  >
                    <User size={16} className="text-white" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-900 rounded-xl shadow-lg border border-green-500/20 z-50">
                      <button
                        onClick={() => handleNavigate('/dashboard')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-green-500/10 hover:text-green-400"
                      >
                        <User size={14} className="mr-2" /> {userInfo?.name || "Profile"}
                      </button>
                      <button
                        onClick={() => handleNavigate('/coins')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-green-500/10 hover:text-green-400"
                      >
                        <Wallet size={14} className="mr-2" /> Coins
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut size={14} className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-green-400 transition p-2 rounded-lg hover:bg-green-500/10"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {isOpen && (
            <div className="md:hidden py-3 border-t border-green-500/20">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = getActiveItem() === item.name
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.pageLink)}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
                        isActive ? 'bg-green-500/20 text-green-400' : 'text-gray-300 hover:text-green-400 hover:bg-green-500/10'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Mobile Profile Dropdown */}
              {isLoggedIn && (
                <div className="mt-3 border-t border-green-500/20 pt-3">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-green-500/10 rounded-lg"
                  >
                    <User size={18} className="mr-2" /> Profile
                  </button>
                  {showProfileMenu && (
                    <div className="pl-8 space-y-1">
                      <button onClick={() => handleNavigate('/dashboard')} className="block w-full text-left text-sm text-gray-300 hover:text-green-400 py-1">
                        {userInfo?.name || "Profile"}
                      </button>
                      <button onClick={() => handleNavigate('/coins')} className="block w-full text-left text-sm text-gray-300 hover:text-green-400 py-1">
                        Coins
                      </button>
                      <button onClick={handleLogout} className="block w-full text-left text-sm text-red-400 hover:text-red-500 py-1">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="h-14 sm:h-16" />
    </>
  )
}

export default Navbar
