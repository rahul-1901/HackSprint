import React, { useEffect, useState } from "react";
import { getDashboard } from "../backendApis/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, CheckCircle, MessageSquare, Star, Coins } from "lucide-react";

// Floating Particles (Background)
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse"
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

// Grid Background
const GridBackground = () => (
  <div className="absolute inset-0 opacity-10">
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

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const navigate = useNavigate();

  // Daily Coin + Streak System
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

      setShowReward(true);
    }

    setCoins(newCoins);
    setStreak(newStreak);
  }, []);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res.data.userData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout successfull...", { autoClose: 1000 });
    setTimeout(() => {
      navigate("/");
    }, 1700);
  };

  // If still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-green-400 text-xl">
        Loading Dashboard...
      </div>
    );
  }

  // If no data
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 text-xl">
        Failed to load dashboard ❌
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="w-full md:w-1/4 space-y-6">
          {/* Profile Card */}
<div className="bg-white/5 border border-green-500/20 rounded-xl p-6 flex flex-col items-center hover:border-green-400 transition-all text-center">
  <div className="relative">
    <img
      src={
        data.avatar_url ||
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
      }
      alt="Avatar"
      className="w-24 h-24 rounded-full border-2 border-green-500/50"
    />
  </div>

  <h2 className="mt-4 text-xl font-bold">{data.name || "Unnamed User"}</h2>
  <p className="text-sm text-gray-400">{data.roll_no || "N/A"}</p>
  <p className="text-sm text-green-400 mt-1">
    Rank: #{data.rank || "N/A"}
  </p>

  <button
    onClick={handleLogout}
    className="mt-3 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/40"
  >
    Logout
  </button>
</div>


          {/* Coins + Streak */}
          <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 text-yellow-400 font-bold">
              <Coins /> <span>{coins} Coins</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">🔥 Streak: {streak} days</p>
          </div>

          {/* Community Stats */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-green-400">Community Stats</h3>
            <div className="flex items-center gap-3">
              <Eye size={16} className="text-green-400" />
              <span>Views: {data.stats?.views || 0}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-green-400" />
              <span>Solutions: {data.stats?.solutions || 0}</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare size={16} className="text-green-400" />
              <span>Discussions: {data.stats?.discussions || 0}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star size={16} className="text-green-400" />
              <span>Reputation: {data.stats?.reputation || 0}</span>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-green-400">Languages</h3>
            {Array.isArray(data.languages) &&
              data.languages.map((lang, i) => (
                <div key={i} className="flex justify-between mt-2">
                  <span>{lang.name}</span>
                  <span className="text-gray-400">
                    {lang.solved} problems solved
                  </span>
                </div>
              ))}
          </div>

          {/* Skills */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-green-400">Skills</h3>
            {data.skills &&
              Object.entries(data.skills).map(([level, items], idx) => (
                <div key={idx}>
                  <div className="text-sm font-bold mb-2">{level}</div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-sm"
                      >
                        {item.name} x{item.count}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 space-y-6">

        {/* Submissions Heatmap */}
<div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
  <h3 className="text-lg font-semibold text-green-400">
    Submissions in the Last Year
  </h3>

  {(() => {
    const today = new Date();
    const days = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    // 📊 Count submissions per day
    const submissionCount = {};
    if (Array.isArray(data.submissions)) {
      data.submissions.forEach((s) => {
        const dateKey = new Date(s.submitted_at).toISOString().split("T")[0];
        submissionCount[dateKey] = (submissionCount[dateKey] || 0) + 1;
      });
    }

    // 🎨 Color intensity
    const getLevel = (count) => {
      if (!count) return "bg-green-900/20"; // empty
      if (count === 1) return "bg-green-400";
      if (count === 2) return "bg-green-500";
      if (count === 3) return "bg-green-600";
      return "bg-green-700";
    };

    // 📅 Group into weeks (columns of 7 days)
    const weeks = [];
    let week = [];
    days.forEach((day, idx) => {
      week.push(day);
      if (week.length === 7 || idx === days.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    // 📅 Month Labels
    const monthLabels = [];
    let prevMonth = "";
    weeks.forEach((week, wIdx) => {
      const month = new Date(week[0]).toLocaleString("default", { month: "short" });
      if (month !== prevMonth) {
        monthLabels.push({ idx: wIdx, month });
        prevMonth = month;
      }
    });

    return (
      <>
        {/* Heatmap */}
        <div className="relative mt-6">
          <div className="flex gap-[4px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[4px]">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className={`w-3 h-3 rounded-sm ${getLevel(submissionCount[day])}`}
                    title={`${day}: ${submissionCount[day] || 0} submissions`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Month Labels */}
          <div className="flex absolute -bottom-6 left-0 w-full text-xs text-gray-400">
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: `${(m.idx / weeks.length) * 100}%` }}
              >
                {m.month}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-10">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-green-900/20" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <div className="w-3 h-3 rounded-sm bg-green-600" />
          <div className="w-3 h-3 rounded-sm bg-green-700" />
          <span>More</span>
        </div>
      </>
    );
  })()}
</div>


          {/* Connected Accounts */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
            <h3 className="text-lg font-semibold text-green-400">
              Connected Accounts
            </h3>
            <div className="flex justify-between mt-2">
              <span>GitHub</span>
              <span className="text-gray-400">{data.github_id || "Not Connected"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Stack Overflow</span>
              <span className="text-gray-400">{data.stack_id || "Not Connected"}</span>
            </div>
          </div>
          
          {/* Participated in Hackathons */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
            <h3 className="text-lg font-semibold text-green-400">
              Participated in Hackathons
            </h3>
            <ul className="mt-4 space-y-3">
              {Array.isArray(data.submissions) && data.submissions.length > 0 ? (
                data.submissions.map((hack, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-gray-300"
                  >
                    <span>{hack.title}</span>
                    <a
                      href={hack.repo_url || "#"}
                      className="text-green-400 underline hover:text-green-300"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Repo
                    </a>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">📦 No hackathon submissions yet.</p>
              )}
            </ul>
          </div>
          

          {/* Education */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
            <h3 className="text-lg font-semibold text-green-400">Education</h3>
            <p className="text-gray-400">
              {data.education || "No data available."}{" "}
              <a href="#" className="text-green-400 underline">
                Update now
              </a>
            </p>
          </div>
        </div>
      </div>

      

      {/* Reward Popup */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-2xl shadow-lg text-center w-80">
            <h2 className="text-xl font-bold mb-2">🎉 Daily Reward!</h2>
            <p className="mb-2">You earned <span className="text-yellow-600 font-bold">+10 coins</span> today.</p>
            <p className="text-sm text-gray-600 mb-4">🔥 Current Streak: {streak} days</p>
            <button
              onClick={() => setShowReward(false)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;