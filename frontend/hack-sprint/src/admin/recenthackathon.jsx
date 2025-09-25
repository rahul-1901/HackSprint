import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Code, Calendar, Users, Trophy, Timer } from 'lucide-react';

// --- BACKGROUND COMPONENTS ---

const GridBackground = () => (
  <div className="absolute inset-0 opacity-10 pointer-events-none">
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
);

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

// --- HACKATHON CARD FROM ADMIN PROFILE ---

const HackathonCard = ({ hackathon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`border border-blue-500/20 bg-white/5 backdrop-blur-sm hover:border-blue-400 hover:scale-[1.02] transition-all duration-300 rounded-xl cursor-pointer relative group overflow-hidden ${isHovered ? "shadow-2xl shadow-blue-500/20" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent transform -skew-x-12 transition-transform duration-1000 ${isHovered ? "translate-x-full" : "-translate-x-full"}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-80 lg:h-60 h-48 w-full relative overflow-hidden rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
            {hackathon.image && !imageError ? (
              <>
                <img src={hackathon.image} alt={hackathon.title} className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"} ${isHovered ? "scale-105" : "scale-100"}`} onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 relative">
                 <div className="absolute inset-0 opacity-10">
                   <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%)`, backgroundSize: "30px 30px", backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px" }}/>
                 </div>
                 <div className="text-center z-10"><Code size={40} className="text-blue-400/60 mx-auto mb-2" /><div className="text-blue-400/40 text-sm font-mono">HACKATHON</div></div>
              </div>
            )}
            {/* REMOVED: Status Tag */}
            <div className="absolute bottom-3 left-3 flex gap-1 z-20">
              {(hackathon.techStack || []).slice(0, 3).map((tech, index) => (<div key={index} className="backdrop-blur-sm bg-black/30 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20">{tech}</div>))}
              {hackathon.techStack && hackathon.techStack.length > 3 && (<div className="backdrop-blur-sm bg-black/30 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20">+{hackathon.techStack.length - 3}</div>)}
            </div>
          </div>
        </div>
        <div className="flex-1 px-4 sm:px-5 py-4 sm:py-5 relative z-10">
          {/* REMOVED: Timer Tag */}
          <div className="pr-20 sm:pr-24 md:pr-28 lg:pr-32">
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

// --- MOCK DATA ---
const allHackathons = [
    { id: 'recent-01', slug: "gamedev-gauntlet", title: "GameDev Gauntlet", image: "https://placehold.co/600x400/0D1117/8B5CF6?text=GameDev", difficulty: 'Intermediate', category: ['Gaming'], description: 'Create the next indie hit in this fast-paced game development challenge.', participants: 250, prize: 4000, dates: 'Sep 25 - Sep 30, 2025', techStack: ['Unity', 'C#', 'Blender'], status: 'recent' },
    { id: 'recent-02', slug: "cyber-sentinel-showdown", title: "Cyber Sentinel Showdown", image: "https://placehold.co/600x400/0D1117/3B82F6?text=Cyber+Sentinel", difficulty: 'Advanced', category: ['Security'], description: 'A capture-the-flag style event for cybersecurity experts and enthusiasts.', participants: 155, prize: 8000, dates: 'Sep 24 - Sep 28, 2025', techStack: ['Kali', 'Python'], status: 'recent' },
];

// --- MAIN PAGE COMPONENT ---

const RecentlyStartedPage = () => {
  const recentlyStartedHackathons = allHackathons.filter(h => h.status === 'recent');

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <FloatingParticles />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="text-center my-12 sm:my-16">
          <h1 className="flex items-center justify-center gap-x-4 text-4xl sm:text-5xl md:text-6xl text-white ZaptronFont leading-tight">
            <span>Recently Started</span>
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">Catch the momentum! These hackathons have just kicked off.</p>
        </header>
        <main>
          <div className="flex flex-col gap-8">
            {recentlyStartedHackathons.map((hackathon) => (
              <Link key={hackathon.id} to={`/Hacksprintkaadminprofile/${hackathon.slug}/usersubmissions`}>
                <HackathonCard hackathon={hackathon} />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecentlyStartedPage;