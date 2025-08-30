import React, { useEffect, useState } from "react";
import { getDashboard } from "../backendApis/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, CheckCircle, MessageSquare, Star, Coins, User } from "lucide-react";
import { School, Clock, Laptop, MapPin, Edit } from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";


// Floating Particles (Background)
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      +
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

export const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const navigate = useNavigate();
  const [editEducation, setEditEducation] = useState(false);
  const [educationData, setEducationData] = useState({
    institute: "",
    passoutYear: "",
    department: "",
  });

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        const userData = res.data.userData;
        setData(userData);

        // ✅ update education data once user info is fetched
        setEducationData({
          institute: userData.education?.institute || "",
          passoutYear: userData.education?.passoutYear || "",
          department: userData.education?.department || "",
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
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
              className="mt-3 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/40 cursor-pointer"
            >
              Logout
            </button>

          </div>


          {/* Coins + Streak */}
          <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 text-yellow-400 font-bold">
              <Coins /> <span>10 Coins</span>
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
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              Get track of your submissions
            </h3>

            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={
                Array.isArray(data.submissions) && data.submissions.length > 0
                  ? data.submissions.map((s) => ({
                    date: new Date(s.submitted_at).toISOString().split("T")[0],
                    count: 1,
                  }))
                  : // Prefilled demo values
                  []
              }
              classForValue={(value) => {
                if (!value) return "color-empty";
                if (value.count === 1) return "color-scale-1";
                if (value.count === 2) return "color-scale-2";
                if (value.count === 3) return "color-scale-3";
                return "color-scale-4";
              }}
              tooltipDataAttrs={(value) => {
                if (!value || !value.date) return null;
                return {
                  "data-tip": `${value.date}: ${value.count || 0} submissions`,
                };
              }}
              showWeekdayLabels={true}
            />

            {/* Legend */}
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-4">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-green-900/20" />
              <div className="w-3 h-3 rounded-sm bg-green-400" />
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <div className="w-3 h-3 rounded-sm bg-green-600" />
              <div className="w-3 h-3 rounded-sm bg-green-700" />
              <span>More</span>
            </div>

            {/* Custom Heatmap Colors */}
            <style>{`
    .react-calendar-heatmap .color-empty {
      fill: #064e3b; /* dark green for empty days */
    }
    .react-calendar-heatmap .color-scale-1 {
      fill: #10b981; /* light green */
    }
    .react-calendar-heatmap .color-scale-2 {
      fill: #059669; /* medium green */
    }
    .react-calendar-heatmap .color-scale-3 {
      fill: #047857; /* dark green */
    }
    .react-calendar-heatmap .color-scale-4 {
      fill: #065f46; /* deepest green */
    }
  `}</style>
          </div>



          {/* Connected Apps */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              Connected Apps
            </h3>

            {data.editAppsIndex === undefined ? (
              <div>
                {Array.isArray(data.connectedApps) && data.connectedApps.length > 0 ? (
                  <div className="space-y-3">
                    {data.connectedApps.map((app, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-gray-800/40 border border-green-500/20 rounded-lg"
                      >
                        <span className="text-gray-200 font-medium">{app.name}</span>
                        <div className="flex gap-2">
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-lg text-green-300 hover:bg-green-600/40 transition cursor-pointer"
                          >
                            Visit
                          </a>
                          <button
                            onClick={() => setData({ ...data, editAppsIndex: idx, tempAppName: app.name, tempAppUrl: app.url })}
                            className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 hover:bg-yellow-600/40 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              const newApps = [...(data.connectedApps || [])];
                              newApps.splice(idx, 1);
                              setData({ ...data, connectedApps: newApps });
                            }}
                            className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/40 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No connected apps available.</p>
                )}

                <button
                  onClick={() => setData({ ...data, editAppsIndex: "new", tempAppName: "", tempAppUrl: "" })}
                  className="mt-3 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/40 cursor-pointer"
                >
                  Add App
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                <input
                  type="text"
                  placeholder="App Name (e.g. GitHub, LinkedIn)"
                  value={data.tempAppName || ""}
                  onChange={(e) => setData({ ...data, tempAppName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="url"
                  placeholder="App URL (https://...)"
                  value={data.tempAppUrl || ""}
                  onChange={(e) => setData({ ...data, tempAppUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (data.tempAppName && data.tempAppUrl) {
                        const newApps = [...(data.connectedApps || [])];

                        if (data.editAppsIndex === "new") {
                          // Adding a new app
                          newApps.push({ name: data.tempAppName, url: data.tempAppUrl });
                        } else {
                          // Editing existing app
                          newApps[data.editAppsIndex] = { name: data.tempAppName, url: data.tempAppUrl };
                        }

                        setData({
                          ...data,
                          connectedApps: newApps,
                          editAppsIndex: undefined,
                          tempAppName: "",
                          tempAppUrl: "",
                        });
                      }
                    }}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/40 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      setData({ ...data, editAppsIndex: undefined, tempAppName: "", tempAppUrl: "" })
                    }
                    className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* Education */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Education</h3>

            {/* Loop through multiple education entries */}
            {(data?.education && data.education.length > 0) ? (
              data.education.map((edu, idx) => {
                // ✅ calculate opacity per card
                const opacity = 1 - idx * 0.15; // decreases 15% each next card
                const bgColor = `rgba(31, 41, 55, ${opacity})`; // gray-800 with decreasing intensity

                return (
                  <div
                    key={idx}
                    className="p-4 mb-4 border border-green-500/20 rounded-lg shadow-md hover:scale-[1.01] transition-transform space-y-3 relative"
                    style={{ backgroundColor: bgColor }}
                  >
                    {/* College Name + Timeline */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <School size={20} /> {edu?.institute || "N/A"}
                      </h4>
                      {edu?.timeline && (
                        <p className="text-sm text-gray-300 flex items-center gap-2">
                          <Clock size={16} /> {edu.timeline}
                        </p>
                      )}
                    </div>

                    {/* Department + Grade */}
                    {(edu?.department || edu?.grade) && (
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        {edu.department && (
                          <span className="flex items-center gap-2 font-medium text-white">
                            <Laptop size={16} /> {edu.department}
                          </span>
                        )}
                        {edu.grade && (
                          <span className="flex items-center gap-2 font-medium">
                            <span className="text-green-300">CGPA:</span> {edu.grade}
                            <Star size={14} className="text-yellow-400" />
                          </span>
                        )}
                      </div>
                    )}

                    {/* Location */}
                    {edu?.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-2 mt-2">
                        <MapPin size={14} /> {edu.location}
                      </p>
                    )}

                    {/* Edit/Delete Buttons */}
                    <div className="flex justify-end gap-3 mt-3">
                      <button
                        onClick={() => {
                          setEducationData(edu);
                          setEditEducation(true);
                          setEditIndex(idx);
                        }}
                        className="px-3 py-1 rounded-lg bg-green-500/20 hover:bg-green-600/40 border border-green-500/40 text-green-400 cursor-pointer flex items-center gap-1"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...data.education];
                          updated.splice(idx, 1);
                          setData({ ...data, education: updated });
                        }}
                        className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-600/40 border border-red-500/40 text-red-400 cursor-pointer flex items-center gap-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400">No education data available.</p>
            )}

            {/* Add/Edit Form */}
            {editEducation && (
              <div className="space-y-3 mt-4">
                <input
                  type="text"
                  placeholder="Institute"
                  value={educationData?.institute || ""}
                  onChange={(e) =>
                    setEducationData({ ...educationData, institute: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="text"
                  placeholder="Timeline (e.g., 2024–2028)"
                  value={educationData?.timeline || ""}
                  onChange={(e) =>
                    setEducationData({ ...educationData, timeline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="text"
                  placeholder="Department / Branch (e.g., Computer Science)"
                  value={educationData?.department || ""}
                  onChange={(e) =>
                    setEducationData({ ...educationData, department: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="text"
                  placeholder="CGPA/Percentage (e.g., 8.7/10)"
                  value={educationData?.grade || ""}
                  onChange={(e) =>
                    setEducationData({ ...educationData, grade: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="text"
                  placeholder="Location (e.g., New York, USA)"
                  value={educationData?.location || ""}
                  onChange={(e) =>
                    setEducationData({ ...educationData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      let updated = [...(data.education || [])];
                      if (typeof editIndex === "number") {
                        updated[editIndex] = educationData; // update existing
                      } else {
                        updated.push(educationData); // add new
                      }
                      setData({ ...data, education: updated });
                      setEducationData({});
                      setEditIndex(null);
                      setEditEducation(false);
                    }}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/40"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditEducation(false);
                      setEducationData({});
                      setEditIndex(null);
                    }}
                    className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add New Education Button */}
            {!editEducation && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setEditEducation(true)}
                  className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/40"
                >
                  + Add Education
                </button>
              </div>
            )}
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
                      className="text-green-400 underline hover:text-green-300 cursor-pointer"
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
      </div>
    </div>
  );
}

export default UserDashboard;