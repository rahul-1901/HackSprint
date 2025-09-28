"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Loader from "../components/Loader"
import { Users, Calendar, Timer, Code, Trophy, Zap, Search, Filter, X } from "lucide-react"
// KEY CHANGE: Import the functions from your api.js file
import { getActiveHackathons, getExpiredHackathons, getUpcomingHackathons } from "../backendApis/api"

const GridBackground = () => (
  <div className="absolute inset-0 opacity-10  pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
      `,
        backgroundSize: "50px 50px",
      }}
    />
  </div>
)

const TabButton = ({ active, onClick, children, count, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all cursor-pointer duration-300 flex items-center gap-2 sm:gap-3 font-medium text-sm sm:text-base ${active
      ? "bg-green-500/20 text-green-300 border border-green-500/30"
      : "bg-white/5 text-gray-400 border border-gray-700/50 hover:bg-white/10 hover:text-green-400 hover:border-green-500/20"
      }`}
  >
    <Icon size={16} className={active ? "text-green-400" : "text-gray-500"} />
    <span>{children}</span>
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-mono ${active ? "bg-green-500/30 text-green-300" : "bg-gray-700/50 text-gray-400"
        }`}
    >
      {count}
    </span>
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 rounded-lg animate-pulse" />
    )}
  </button>
)

const HackathonCard = ({ hackathon }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [countdown, setCountdown] = useState("")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  function getProgress(startDate, endDate) {
    const now = new Date().getTime()
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    if (now <= start) return 0
    if (now >= end) return 100

    const totalDuration = end - start
    const elapsed = now - start

    return ((elapsed / totalDuration) * 100).toFixed(2)
  }

  const getCountdown = (targetDate) => {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const diff = target - now

    if (diff <= 0) {
      return "0d 0h 0m"
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${days}d ${hours}h ${minutes}m`
  }

  useEffect(() => {
    if (!hackathon.startDate || !hackathon.endDate) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(hackathon.status === "upcoming" ? hackathon.startDate : hackathon.endDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [hackathon.endDate, hackathon.startDate, hackathon.status])

  const isExpired = hackathon.status === "expired"
  const isUpcoming = hackathon.status === "upcoming"

  const getStatusColor = () => {
    if (isExpired) return "red"
    if (isUpcoming) return "blue"
    return "green"
  }

  const statusColor = getStatusColor()

  return (
    <div
      className={`border border-green-500/20 bg-white/5 backdrop-blur-sm hover:border-green-400 hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer relative group overflow-hidden ${isHovered ? "shadow-2xl shadow-green-500/20" : ""
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (hackathon.status !== "upcoming") {
          navigate(`/hackathon/${hackathon._id}`)
        } else {
          
        }
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent transform -skew-x-12 transition-transform duration-1000 ${isHovered ? "translate-x-full" : "-translate-x-full"}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-80 lg:h-60 h-48 w-full relative overflow-hidden rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
            {hackathon.image && !imageError ? (
              <>
                <img src={hackathon.image || "/placeholder.svg"} alt={hackathon.title} className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"} ${isHovered ? "scale-105" : "scale-100"}`} onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 relative">
                <div className="absolute inset-0 opacity-10"><div className="w-full h-full" style={{ backgroundImage: `linear-gradient(45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%)`, backgroundSize: "30px 30px", backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px" }} /></div>
                <div className="text-center z-10"><Code size={40} className="text-green-400/60 mx-auto mb-2" /><div className="text-green-400/40 text-sm font-mono">HACKATHON</div></div>
              </div>
            )}
            <div className="absolute top-3 left-3 z-20">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-${statusColor}-500/30`}>
                <span className={`h-2 w-2 rounded-full bg-${statusColor}-400 animate-pulse`}></span>
                <span className={`text-xs font-medium text-${statusColor}-300 uppercase tracking-wide`}>{hackathon.status}</span>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex gap-1 z-20">
              {(hackathon.techStack || []).slice(0, 3).map((tech, index) => (<div key={index} className="backdrop-blur-sm bg-black/30 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">{tech}</div>))}
              {hackathon.techStack && hackathon.techStack.length > 3 && (<div className="backdrop-blur-sm bg-black/30 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">+{hackathon.techStack.length - 3}</div>)}
            </div>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHovered ? "animate-pulse" : ""}`}><div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rotate-45 transform translate-x-16 -translate-y-16" /><div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rotate-12 transform -translate-x-12 translate-y-12" /></div>
          </div>
        </div>
        <div className="flex-1 px-4 sm:px-5 py-4 sm:py-5 relative z-10">
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-${statusColor}-500/10 backdrop-blur-sm`}>
              <Timer size={12} className={`text-${statusColor}-400`} />
              <span className={`font-mono text-xs sm:text-sm text-${statusColor}-400`}>{isExpired ? "0d 0h 0m" : countdown || getCountdown(isUpcoming ? hackathon.startDate : hackathon.endDate)}</span>
            </div>
          </div>
          <div className="pr-20 sm:pr-24 md:pr-28 lg:pr-32">
            <div className="flex flex-col gap-2 mb-3">
              <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl text-white/90 leading-tight">{hackathon.title}</h3>
              <div className="flex gap-1 flex-wrap">
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full whitespace-nowrap">{hackathon.difficulty}</span>
                {(hackathon.category || []).map((cat, idx) => (<span key={idx} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full whitespace-nowrap">{cat}</span>))}
              </div>
            </div>
            <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-2">{hackathon.description}</p>
            <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
              {(hackathon.techStack || []).map((tech, index) => (<span key={index} className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded">{tech}</span>))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 lg:gap-8">
              <div className="flex items-center text-xs sm:text-sm"><Users size={14} className="text-gray-500" /><span className="ml-1 text-gray-400">{hackathon.participants} participants</span></div>
              <div className="flex items-center text-xs sm:text-sm">
                <Trophy size={14} className="text-gray-500" />
                <span className="ml-1 text-gray-400">
                  ₹{(
                    (hackathon.prizeMoney1 || 0) +
                    (hackathon.prizeMoney2 || 0) +
                    (hackathon.prizeMoney3 || 0)
                  ).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center text-xs sm:text-sm"><Calendar size={14} className="text-gray-500" /><span className="ml-1 text-gray-400">{hackathon.dates}</span></div>
            </div>
          </div>
        </div>
      </div>
      {hackathon.status === "active" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300" style={{ width: `${getProgress(hackathon.startDate, hackathon.endDate)}%` }} />
        </div>
      )}
    </div>
  )
}

const Hackathons = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")
  const [activeHackathons, setActiveHackathons] = useState([])
  const [expiredHackathons, setExpiredHackathons] = useState([])
  const [upcomingHackathons, setUpcomingHackathons] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("fade-in") } }) }, { threshold: 0.1 },)
    const sections = document.querySelectorAll(".fade-section")
    sections.forEach((section) => observer.observe(section))
    return () => { sections.forEach((section) => observer.unobserve(section)) }
  }, [])

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        // KEY CHANGE: Using functions from api.js instead of direct axios calls
        const [activeRes, expiredRes, upcomingRes] = await Promise.all([
          getActiveHackathons(),
          getExpiredHackathons(),
          getUpcomingHackathons(),
        ]);

        const mapData = (data, status) =>
          (data || []).map((h) => ({
            ...h,
            status: status,
            participants: h.numParticipants || 0,
            prize: h.prizeMoney,
            techStack: h.techStackUsed || [],
            category: h.category || "General",
            image: h.image || h.imageUrl || null,
            dates: `${new Date(h.startDate).toLocaleDateString()} - ${new Date(h.endDate).toLocaleDateString()}`,
          }));

        // KEY CHANGE: Accessing data from the correct properties
        setActiveHackathons(mapData(activeRes.data.allHackathons, "active"));
        setExpiredHackathons(mapData(expiredRes.data.expiredHackathons, "expired"));
        setUpcomingHackathons(mapData(upcomingRes.data.upcomingHackathons, 'upcoming'));
      } catch (error) {
        console.error("Error fetching hackathons:", error)
        if (error.response?.status === 404 && error.config.url.includes("upcomingHackathons")) {
          setUpcomingHackathons([])
        }
      }
    }
    fetchHackathons()
  }, [])

  const getCurrentHackathons = () => {
    let hackathons;
    switch (activeTab) {
      case "active": hackathons = activeHackathons; break;
      case "upcoming": hackathons = upcomingHackathons; break;
      case "expired": hackathons = expiredHackathons; break;
      default: hackathons = activeHackathons;
    }

    return hackathons.filter((hackathon) => {
      const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase())
      const mainCategories = ["Web Dev", "AI/ML", "Blockchain", "IoT"]
      let matchesCategory = true
      if (selectedCategory) {
        if (selectedCategory === "Other") {
          const hackathonCategories = Array.isArray(hackathon.category) ? hackathon.category : [hackathon.category]
          matchesCategory = hackathonCategories.every((cat) => !mainCategories.includes(cat))
        } else {
          matchesCategory = Array.isArray(hackathon.category) ? hackathon.category.includes(selectedCategory) : hackathon.category === selectedCategory
        }
      }
      const matchesDifficulty = !selectedDifficulty || hackathon.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }

  const getAllCategories = () => ["Web Dev", "AI/ML", "Blockchain", "IoT", "Other"];
  const getAllDifficulties = () => ["Beginner", "Intermediate", "Advanced", "Expert"];
  const clearFilters = () => { setSearchTerm(""); setSelectedCategory(""); setSelectedDifficulty(""); };
  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty;

  const getTabTitle = () => {
    switch (activeTab) {
      case "active": return "Active Hackathons";
      case "upcoming": return "Upcoming Hackathons";
      case "expired": return "Expired Hackathons";
      default: return "Active Hackathons";
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case "active": return (<span className="relative flex items-center"><span className="h-3 w-3 rounded-full bg-green-400 animate-pulse shadow-lg inline-block"></span><span className="absolute inset-0 h-3 w-3 rounded-full bg-green-400 animate-ping"></span></span>);
      case "upcoming": return <span className="h-3 w-3 rounded-full bg-blue-400 shadow-lg"></span>;
      case "expired": return <span className="h-3 w-3 rounded-full bg-red-400 opacity-50"></span>;
      default: return null;
    }
  };

  const getTabGradient = () => {
    switch (activeTab) {
      case "active": return "from-green-300 to-green-800";
      case "upcoming": return "from-blue-300 to-blue-800";
      case "expired": return "from-red-300 to-red-500";
      default: return "from-green-300 to-green-800";
    }
  };

  return (
    <div className="bg-gray-900 relative overflow-hidden min-h-screen -mt-16">
      <Loader />
      <GridBackground />
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32 lg:mt-40">
        <div className="flex flex-col w-full max-w-7xl">
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
            <TabButton active={activeTab === "active"} onClick={() => setActiveTab("active")} count={activeHackathons.length} icon={Zap}>Active</TabButton>
            <TabButton active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")} count={upcomingHackathons.length} icon={Calendar}>Upcoming</TabButton>
            <TabButton active={activeTab === "expired"} onClick={() => setActiveTab("expired")} count={expiredHackathons.length} icon={Timer}>Expired</TabButton>
          </div>
          <div className="mb-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 z-10 text-gray-400" /></div>
              <input type="text" placeholder="Search hackathons by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-12 py-3 border border-gray-700/50 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors" />
              {searchTerm && (<button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>)}
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${showFilters || hasActiveFilters ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-white/5 text-gray-400 border border-gray-700/50 hover:bg-white/10 hover:text-green-400"}`} >
                <Filter size={16} /> Filters
                {hasActiveFilters && (<span className="bg-green-500/30 text-green-300 px-2 py-0.5 rounded-full text-xs">{[searchTerm, selectedCategory, selectedDifficulty].filter(Boolean).length}</span>)}
              </button>
              {hasActiveFilters && (<button onClick={clearFilters} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"><X size={14} />Clear Filters</button>)}
            </div>
            {showFilters && (
              <div className="flex flex-wrap gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-gray-700/50 z-50">
                <div className="min-w-48">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="block w-full px-3 py-2 border border-gray-700/50 rounded-lg bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 z-10">
                    <option value="" className="bg-gray-800 text-white">All Categories</option>
                    {getAllCategories().map((category) => (<option key={category} value={category} className="bg-gray-800 text-white">{category}</option>))}
                  </select>
                </div>
                <div className="min-w-48">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                  <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="block w-full px-3 py-2 border border-gray-700/50 rounded-lg bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                    <option value="" className="bg-gray-800">All Difficulties</option>
                    {getAllDifficulties().map((difficulty) => (<option key={difficulty} value={difficulty} className="bg-gray-800">{difficulty}</option>))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl ZaptronFont text-transparent bg-clip-text bg-gradient-to-b ${getTabGradient()} flex items-center gap-3`}>{getTabIcon()}{getTabTitle()}</h2>
            <div className="flex items-center gap-4"><div className="text-sm text-gray-400"><span className="text-green-400 font-mono">{getCurrentHackathons().length}</span> {activeTab}{hasActiveFilters && <span className="text-yellow-400 ml-2">(filtered)</span>}</div></div>
          </div>
          <div className="space-y-4 sm:space-y-6 mb-20 sm:mb-32 lg:mb-40">
            {getCurrentHackathons().length > 0 ? (getCurrentHackathons().map((hackathon, index) => (<HackathonCard key={`${activeTab}-${index}`} hackathon={hackathon} />))) : (<div className="text-center py-12 sm:py-16"><div className="text-6xl sm:text-8xl mb-4 opacity-20">{hasActiveFilters ? "🔍" : "🏆"}</div><h3 className="text-xl sm:text-2xl text-gray-400 mb-2">{hasActiveFilters ? "No hackathons match your filters" : `No ${activeTab} hackathons`}</h3><p className="text-gray-500">{hasActiveFilters ? "Try adjusting your search or filters" : "Check back later for updates!"}</p></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hackathons