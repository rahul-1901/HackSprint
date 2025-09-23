import React, { useState } from 'react';
// MODIFICATION: Import Link
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Code, Calendar, Users, CheckCircle, User, Shield, Activity, Play, Square, ArrowRight } from 'lucide-react';

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

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-green-400 rounded-full opacity-40 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const HackathonCard = ({ hackathon }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex bg-[#0D1117] border border-gray-800 rounded-xl overflow-hidden cursor-pointer relative group transition-all duration-300 hover:border-green-500/50 hover:scale-[1.01]">
      <div className="w-2/5 md:w-1/3 relative">
        <div className="absolute inset-0 bg-gray-900">
          {!imageError ? (
            <img
              src={hackathon.image}
              alt={hackathon.title}
              className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Code size={40} className="text-gray-600" />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>
      <div className="w-3/5 md:w-2/3 p-5 flex flex-col">
        <h3 className="font-semibold text-lg sm:text-xl text-gray-100 mb-4">{hackathon.title}</h3>
        <div className="mt-auto">
            <div className="flex items-center gap-2 text-base text-gray-300 mb-4">
                <Users size={16} className="text-gray-500" />
                <span className="font-medium">{hackathon.participants} participants</span>
            </div>
            <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                <div className="text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Start Date</p>
                    <p className="text-base font-semibold text-gray-200">{formatDate(hackathon.startDate)}</p>
                </div>
                <div className="text-gray-500 font-thin text-xl mx-2">→</div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">End Date</p>
                    <p className="text-base font-semibold text-gray-200">{formatDate(hackathon.endDate)}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// MODIFICATION: Hackathon data is now defined in this file.
const allHackathons = [
    // Live Hackathons
    { id: 'live-01', slug: "ai-innovators-hackathon", title: "AI Innovators Hackathon", participants: 194, startDate: "2025-09-05T00:00:00Z", endDate: "2025-09-12T23:59:59Z", image: "https://placehold.co/600x400/0D1117/22C55E?text=AI+Live", status: 'live' },
    { id: 'live-02', slug: "quantumverse-challenge", title: "QuantumVerse Challenge", participants: 78, startDate: "2025-09-04T00:00:00Z", endDate: "2025-09-11T23:59:59Z", image: "https://placehold.co/600x400/0D1117/F97316?text=QuantumVerse", status: 'live' },
    { id: 'live-03', slug: "cloud-native-sprint", title: "Cloud Native Sprint", participants: 132, startDate: "2025-09-06T00:00:00Z", endDate: "2025-09-10T23:59:59Z", image: "https://placehold.co/600x400/0D1117/0EA5E9?text=Cloud+Sprint", status: 'live'},
    // Recently Started Hackathons
    { id: 'recent-01', slug: "gamedev-gauntlet", title: "GameDev Gauntlet", participants: 250, startDate: "2025-09-08T00:00:00Z", endDate: "2025-09-10T23:59:59Z", image: "https://placehold.co/600x400/0D1117/8B5CF6?text=GameDev", status: 'recent' },
    { id: 'recent-02', slug: "cyber-sentinel-showdown", title: "Cyber Sentinel Showdown", participants: 155, startDate: "2025-09-07T00:00:00Z", endDate: "2025-09-10T23:59:59Z", image: "https://placehold.co/600x400/0D1117/3B82F6?text=Cyber+Sentinel", status: 'recent' },
    { id: 'recent-03', slug: "healthtech-nexus", title: "HealthTech Nexus", participants: 95, startDate: "2025-09-06T00:00:00Z", endDate: "2025-09-12T23:59:59Z", image: "https://placehold.co/600x400/0D1117/EC4899?text=HealthTech", status: 'recent'},
    // Ended Hackathons
    { id: 'ended-01', slug: "decentralized-future-hack", title: "Decentralized Future Hack", participants: 120, startDate: "2025-09-01T00:00:00Z", endDate: "2025-09-05T23:59:59Z", image: "https://placehold.co/600x400/0D1117/F59E0B?text=Blockchain", status: 'ended' },
    { id: 'ended-02', slug: "eco-coders-challenge", title: "Eco-Coders Challenge", participants: 85, startDate: "2025-08-01T00:00:00Z", endDate: "2025-08-05T23:59:59Z", image: "https://placehold.co/600x400/0D1117/10B981?text=Eco+Challenge", status: 'ended' },
    { id: 'ended-03', slug: "sustainable-cities-jam", title: "Sustainable Cities Jam", participants: 110, startDate: "2025-07-15T00:00:00Z", endDate: "2025-07-20T23:59:59Z", image: "https://placehold.co/600x400/0D1117/65A30D?text=Smart+City", status: 'ended'}
];

const AdminProfile = () => {
  const navigate = useNavigate();
  const handleNavigate = (link) => {
    navigate(link);
  };

  const adminData = {
    name: "John Anderson",
    email: "john.anderson@hacksprint.com",
    role: "Platform Administrator",
    joinDate: "January 2023",
    lastActive: "2 minutes ago",
    permissions: ["Full Access", "User Management", "Event Creation"]
  };
  
  // Data is now filtered from the single source above
  const liveHackathons = allHackathons.filter(h => h.status === 'live');
  const recentlyStartedHackathons = allHackathons.filter(h => h.status === 'recent');
  const endedHackathons = allHackathons.filter(h => h.status === 'ended');

  // MODIFICATION: This component now wraps cards in a Link to the users page
  const HackathonList = ({ hackathons, viewMoreLink }) => (
    <div className="space-y-6">
      {hackathons.slice(0, 3).map((hackathon, index) => {
        // The first two cards are simple links
        if (index < 2) {
          return (
            <Link key={hackathon.id} to={`/Hacksprintkaadminprofile/${hackathon.slug}/usersubmissions`} className="block">
              <HackathonCard hackathon={hackathon} />
            </Link>
          );
        }
        // The third card has the "View More" button overlay
        if (index === 2) {
          return (
            <div key={hackathon.id} className="relative">
              <Link to={`/Hacksprintkaadminprofile/${hackathon.slug}/users`} className="block pointer-events-none" tabIndex="-1">
                <HackathonCard hackathon={hackathon} />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
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
      <FloatingParticles />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-px h-8 bg-green-400"></div>
            <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">ADMIN DASHBOARD</span>
            <div className="w-px h-8 bg-green-400"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white ZaptronFont leading-tight">Administrator Profile</h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl">Manage platform operations, monitor hackathons, and oversee community growth.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-green-400/30 transition-all duration-500">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-400/10 border-2 border-green-400/20 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-green-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-gray-900" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{adminData.name}</h2>
                    <p className="text-green-400 font-medium mb-1">{adminData.role}</p>
                    <p className="text-gray-400 text-sm">{adminData.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">ACTIVE</span>
                  </div>
                  <p className="text-gray-400 text-sm">Last seen: {adminData.lastActive}</p>
                </div>
              </div>
              
              <div className="mb-8">
                 <div className="p-4 bg-green-400/5 border border-green-400/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-2"><Calendar className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">Join Date</span>
                    </div>
                    <p className="text-gray-400">{adminData.joinDate}</p>
                  </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" />Access Permissions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {adminData.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-green-400/30 transition-colors duration-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-green-400/30 transition-all duration-500">
                <button className="w-full bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-green-400 px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 group">
                    <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                    Create Hackathon
                </button>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Play className="w-8 h-8 text-green-400" />
                Live Hackathons
            </h2>
            <HackathonList hackathons={liveHackathons} viewMoreLink="/Hacksprintkaadminprofile/livehackathons" />
        </div>

        <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-400" />
                Recently Started Hackathons
            </h2>
            <HackathonList hackathons={recentlyStartedHackathons} viewMoreLink="/Hacksprintkaadminprofile/recentlystarted" />
        </div>

        <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Square className="w-8 h-8 text-red-400" />
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