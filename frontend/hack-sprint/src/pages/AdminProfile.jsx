"use client"

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Code, Calendar, Users, CheckCircle, User, Shield, Activity, Play, Square, ArrowRight, Settings, BarChart2,
  Timer, Trophy 
} from 'lucide-react';
// KEY CHANGE: Import the API functions
import { getActiveHackathons, getUpcomingHackathons, getExpiredHackathons } from '../backendApis/api'; // Adjust path if needed

// --- HELPER & BACKGROUND COMPONENTS ---

const GridBackground = () => (
  <div className="absolute inset-0 opacity-5">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
    <div
      className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"
      style={{ animation: "morph 8s ease-in-out infinite" }}
    />
    <div
      className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-600/3 rounded-full blur-3xl"
      style={{ animation: "morph 8s ease-in-out infinite 4s" }}
    />
  </div>
);


const HackathonCard = ({ hackathon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`border border-green-500/20 bg-white/5 backdrop-blur-sm hover:border-green-400 hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer relative group overflow-hidden ${isHovered ? "shadow-2xl shadow-green-500/20" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
                 <div className="absolute inset-0 opacity-10">
                   <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%)`, backgroundSize: "30px 30px", backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px" }}/>
                 </div>
                 <div className="text-center z-10"><Code size={40} className="text-green-400/60 mx-auto mb-2" /><div className="text-green-400/40 text-sm font-mono">HACKATHON</div></div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex gap-1 z-20">
              {(hackathon.techStack || []).slice(0, 3).map((tech, index) => (<div key={index} className="backdrop-blur-sm bg-black/30 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">{tech}</div>))}
              {hackathon.techStack && hackathon.techStack.length > 3 && (<div className="backdrop-blur-sm bg-black/30 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">+{hackathon.techStack.length - 3}</div>)}
            </div>
          </div>
        </div>
        <div className="flex-1 px-4 sm:px-5 py-4 sm:py-5 relative z-10">
          <div>
            <div className="flex flex-col gap-2 mb-3">
              <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl text-white/90 leading-tight">{hackathon.title}</h3>
              <div className="flex gap-1 flex-wrap">
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full whitespace-nowrap">{hackathon.difficulty}</span>
                {(hackathon.category || []).map((cat, idx) => (<span key={idx} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full whitespace-nowrap">{cat}</span>))}
              </div>
            </div>
            <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-2">{hackathon.description}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 lg:gap-8">
              <div className="flex items-center text-xs sm:text-sm"><Users size={14} className="text-gray-500" /><span className="ml-1 text-gray-400">{hackathon.participants} participants</span></div>
              <div className="flex items-center text-xs sm:text-sm"><Trophy size={14} className="text-gray-500" /><span className="ml-1 text-gray-400">${hackathon.prize}</span></div>
              <div className="flex items-center text-xs sm:text-sm"><Calendar size={14} className="text-gray-500" /><span className="ml-1 text-gray-400">{hackathon.dates}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- MAIN ADMIN PROFILE COMPONENT ---

const AdminProfile = () => {
  const navigate = useNavigate();
  const handleNavigate = (link) => {
    navigate(link);
  };

  const [liveHackathons, setLiveHackathons] = useState([]);
  const [recentlyStartedHackathons, setRecentlyStartedHackathons] = useState([]);
  const [endedHackathons, setEndedHackathons] = useState([]);
  
  const adminData = {
    name: "John Anderson",
    email: "john.anderson@hacksprint.com",
    role: "Platform Administrator",
    joinDate: "January 2023",
    lastActive: "2 minutes ago",
    permissions: ["Full Access", "User Management", "Event Creation"]
  };
  
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        // KEY CHANGE: Removed the hardcoded URL and now using imported API functions.
        // These functions correctly use the URL from your .env file.
        const [activeRes, recentRes, expiredRes] = await Promise.all([
          getActiveHackathons(),
          getUpcomingHackathons(), // This will fetch 'recently started' based on your API setup
          getExpiredHackathons(),
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
            slug: h.slug || h._id
          }));

        // Note: Check the exact property your backend API returns the data array in.
        // It might be `activeRes.data.allHackathons`, `activeRes.data`, etc. Adjust accordingly.
        setLiveHackathons(mapData(activeRes.data.allHackathons, "live"));
        setRecentlyStartedHackathons(mapData(recentRes.data.recentHackathons, 'recent'));
        setEndedHackathons(mapData(expiredRes.data.expiredHackathons, "ended"));
      } catch (error) {
        console.error("Error fetching hackathons:", error);
        // Your mock data fallback can remain here
      }
    };
    fetchHackathons();
  }, []);

  const HackathonList = ({ hackathons, viewMoreLink }) => (
    <div className="flex flex-col gap-6"> {/* Using flexbox and gap for consistent spacing */}
      {hackathons.slice(0, 3).map((hackathon, index) => {
        if (index < 2) {
          return (
            <Link key={hackathon._id} to={`/Hacksprintkaadminprofile/${hackathon.slug}/usersubmissions`} className="block">
              <HackathonCard hackathon={hackathon} />
            </Link>
          );
        }
        if (index === 2) {
          return (
            <div key={hackathon._id} className="relative">
              <Link to={`/Hacksprintkaadminprofile/${hackathon.slug}/users`} className="block pointer-events-none" tabIndex="-1">
                <HackathonCard hackathon={hackathon} />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => handleNavigate(viewMoreLink)}
                  className="bg-gray-800/50 hover:bg-gray-700/60 text-gray-200 font-semibold py-3 px-6 rounded-lg border border-gray-600 backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group hover:border-green-400 hover:text-white"
                >
                  View More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* --- TOP ADMIN SECTION --- */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-px h-8 bg-green-400"></div>
            <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">ADMIN DASHBOARD</span>
            <div className="w-px h-8 bg-green-400"></div>
          </div>
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl ZaptronFont text-green-400">Administrator Profile</h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl">Manage platform operations, monitor hackathons, and oversee community growth.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-green-400/30 transition-all duration-500">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-400/10 border-2 border-green-400/20 rounded-full flex items-center justify-center"><User className="w-10 h-10 text-green-400" /></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"><Shield className="w-4 h-4 text-gray-900" /></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{adminData.name}</h2>
                    <p className="text-green-400 font-medium mb-1">{adminData.role}</p>
                    <p className="text-gray-400 text-sm">{adminData.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-green-400 text-sm font-medium">ACTIVE</span></div>
                  <p className="text-gray-400 text-sm">Last seen: {adminData.lastActive}</p>
                </div>
              </div>
              <div className="mb-8">
                 <div className="p-4 bg-green-400/5 border border-green-400/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-2"><Calendar className="w-5 h-5 text-green-400" /><span className="text-white font-medium">Join Date</span></div>
                    <p className="text-gray-400">{adminData.joinDate}</p>
                  </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" />Access Permissions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {adminData.permissions.map((permission) => (<div key={permission} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-green-400/30 transition-colors duration-300"><CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /><span className="text-gray-300 text-sm">{permission}</span></div>))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-green-400/30 transition-all duration-500">
                <button onClick={() => navigate('/createhackathon')} className="w-full bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-green-400 px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 group">
                    <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                    Create Hackathon
                </button>
            </div>
          </div>
        </div>
        
        {/* --- HACKATHON SECTIONS --- */}
        
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                Live Hackathons
            </h2>
            <HackathonList hackathons={liveHackathons} viewMoreLink="/Hacksprintkaadminprofile/livehackathons" />
        </div>

        <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                Recently Started
            </h2>
            <HackathonList hackathons={recentlyStartedHackathons} viewMoreLink="/Hacksprintkaadminprofile/recentlystarted" />
        </div>

        <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                Ended Hackathons
            </h2>
            <HackathonList hackathons={endedHackathons} viewMoreLink="/Hacksprintkaadminprofile/endedhackathons" />
        </div>

      </div>

      <style jsx>{`
        @keyframes morph {
          0%, 100% { border-radius: 50%; transform: scale(1); }
          25% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          75% { border-radius: 40% 30% 60% 70% / 40% 50% 60% 80%; }
        }
        .ZaptronFont {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;