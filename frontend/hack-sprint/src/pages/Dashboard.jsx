import React, { useEffect, useState } from "react";
import { getDashboard, addEducation, editEducation, deleteEducation, deleteConnectedApp, addConnectedApp, editConnectedApp, addLanguages, deleteLanguages, addSkills, deleteSkills } from "../backendApis/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, CheckCircle, MessageSquare, Star, Coins, User } from "lucide-react";
import { School, Clock, Laptop, MapPin, Edit } from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [editEducationIndex, setEditEducationIndex] = useState(undefined);
  const [educationForm, setEducationForm] = useState({
    institute: "",
    passOutYear: "",
    department: "",
    location: "",
  });
  const [userId, setUserId] = useState("");
  const [editAppsIndex, setEditAppsIndex] = useState(undefined);
  const [tempAppName, setTempAppName] = useState("");
  const [tempAppUrl, setTempAppUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const availableLanguages = [
    "C++", "C", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust"
  ];
  const [selectedSkill, setSelectedSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const availableSkills = [
    "Frontend",
    "Backend",
    "DevOps",
    "Websockets",
    "Machine Learning",
    "DSA",
    "Cybersecurity",
    "Operating Systems"
  ];

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

  const fetchData = async () => {
    try {
      const res = await getDashboard();
      setData(res.data.userData);
      setUserId(res.data.userData._id)
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveApp = async () => {
    if (!tempAppName || !tempAppUrl) return;

    try {

      if (editAppsIndex === "new") {
        await addConnectedApp({ userId, appName: tempAppName, appURL: tempAppUrl });
      } else {
        const appId = data.connectedApps[editAppsIndex]._id;
        await editConnectedApp({
          userId,
          appId,
          appName: tempAppName,
          appURL: tempAppUrl,
        });
      }

      await fetchData();
      resetForm();
    } catch (err) {
      console.error("Error saving app:", err);
    }
  };

  const handleDeleteApp = async (idx) => {
    try {
      const appId = data.connectedApps[idx]._id;
      setData((prev) => ({
        ...prev,
        connectedApps: prev.connectedApps.filter((_, i) => i !== idx),
      }));
      await deleteConnectedApp({ userId, appId });
      console.log("Deleted")

    } catch (err) {
      console.error("Error deleting app:", err);
      await fetchData();
    }
  };

  const resetForm = () => {
    setEditAppsIndex(undefined);
    setTempAppName("");
    setTempAppUrl("");
  };

  const handleSaveEducation = async () => {
    if (!educationForm.institute || !educationForm.passOutYear) return;

    try {
      if (editEducationIndex === "new") {
        await addEducation({ userId, ...educationForm });
      } else {
        const eduId = data.education[editEducationIndex]._id;
        await editEducation({ userId, eduId, ...educationForm });
      }

      await fetchData();
      resetEducationForm();
    } catch (err) {
      console.error("Error saving education:", err);
    }
  };

  const handleDeleteEducation = async (idx) => {
    try {
      const eduId = data.education[idx]._id;
      setData((prev) => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== idx),
      }));
      await deleteEducation({ userId, eduId });
    } catch (err) {
      console.error("Error deleting education:", err);
      await fetchData();
    }
  };

  const resetEducationForm = () => {
    setEditEducationIndex(undefined);
    setEducationForm({
      institute: "",
      timeline: "",
      department: "",
      location: "",
    });
  };

  const handleSaveLanguage = async () => {
    if (!selectedLanguage) return;

    // Avoid duplicates
    if (data.languages.some((lang) => lang.name === selectedLanguage)) {

      return;
    }

    try {
      // Call backend API
      await addLanguages({ userId, language: selectedLanguage });

      // Update frontend state after successful API call
      const updated = [...(data.languages || []), { name: selectedLanguage }];
      setData({ ...data, languages: updated });

      setSelectedLanguage("");
      setIsAddingLanguage(false);
    } catch (err) {
      console.error("Error adding language:", err);
      toast.error(err.response?.data?.message || "Failed to add language");
    }
  };

  const handleDeleteLanguage = async (langName) => {
    try {
      await deleteLanguages({ userId, language: langName });

      setData({
        ...data,
        languages: data.languages.filter((lang) => lang.language !== langName),
      });
    } catch (err) {
      console.error("Error deleting language:", err);
      toast.error(err.response?.data?.message || "Failed to delete language");
    }
  };

  const handleCancelLanguage = () => {
    setSelectedLanguage("");
    setIsAddingLanguage(false);
  };

  const handleSaveSkill = async () => {
    if (!selectedSkill) return;

    if (data.skills.some((s) => s.name === selectedSkill)) {
      toast.error("Skill already added!");
      return;
    }

    try {
      await addSkills({ userId, skill: selectedSkill });
      const updated = [...(data.skills || []), { name: selectedSkill }];
      setData({ ...data, skills: updated });
      setSelectedSkill("");
      setIsAddingSkill(false);
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  const handleCancelSkill = () => {
    setSelectedSkill("");
    setIsAddingSkill(false);
  };

  const handleDeleteSkill = async (skillName) => {
    setData({
      ...data,
      skills: data.skills.filter((s) => s.skill !== skillName),
    });

    try {
      await deleteSkills({ userId, skill: skillName });
    } catch (err) {
      console.error("Error deleting skill:", err);
      toast.error(err.response?.data?.message || "Failed to delete skill");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    toast.success("Logout successfull...", { autoClose: 1000 });
    setTimeout(() => {
      navigate("/");
    }, 1700);
  };

  useEffect(() => {
    fetchData()
  }, [tempAppName, tempAppUrl, editAppsIndex, editEducationIndex, educationForm, selectedLanguage, isAddingLanguage, selectedSkill, isAddingSkill])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-green-400 text-xl">
        Loading Dashboard...
      </div>
    );
  }

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
            {/* <p className="text-sm text-gray-400">{data.roll_no || "N/A"}</p> */}
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
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-4 space-y-2">
            <h3 className="text-lg font-semibold text-green-400 flex justify-between items-center">
              Languages
              {!isAddingLanguage && (
                <button
                  onClick={() => setIsAddingLanguage(true)}
                  className="px-2 py-1 text-sm bg-green-500/20 border border-green-500/40 cursor-pointer rounded-lg text-green-400 hover:bg-green-600/30"
                >
                  + Add
                </button>
              )}
            </h3>

            {/* Existing Language Buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(data.languages) && data.languages.length > 0 ? (
                data.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-sm"
                  >
                    {lang.language}
                    <button
                      onClick={() => handleDeleteLanguage(lang.language)}
                      className="ml-1 px-1 text-white rounded-full"
                    >
                      &times;
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No languages added yet.</p>
              )}
            </div>

            {/* Add Language Form */}
            {isAddingLanguage && (
              <div className="mt-2 flex flex-col gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                >
                  <option value="">Select Language</option>
                  {availableLanguages
                    .filter(
                      (lang) => !data.languages.some((l) => l.name === lang)
                    )
                    .map((lang, i) => (
                      <option key={i} value={lang}>
                        {lang}
                      </option>
                    ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveLanguage}
                    className="px-3 py-1 bg-green-500/20 border cursor-pointer border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/40"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelLanguage}
                    className="px-3 py-1 bg-red-500/20 border border-red-500/50 cursor-pointer rounded-lg text-red-400 hover:bg-red-600/40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-4 space-y-2">
            <h3 className="text-lg font-semibold text-green-400 flex justify-between items-center">
              Skills
              {!isAddingSkill && (
                <button
                  onClick={() => setIsAddingSkill(true)}
                  className="px-2 py-1 text-sm bg-green-500/20 border border-green-500/40 cursor-pointer rounded-lg text-green-400 hover:bg-green-600/30"
                >
                  + Add
                </button>
              )}
            </h3>

            {/* Skill Buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(data.skills) &&
                data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-sm"
                  >
                    {skill.skill}
                    <button
                      onClick={() => handleDeleteSkill(skill.skill)}
                      className="ml-1 px-1 text-white rounded-full"
                    >
                      &times;
                    </button>
                  </span>
                ))}
            </div>

            {/* Add Skill Form */}
            {isAddingSkill && (
              <div className="mt-2 flex flex-col gap-2">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                >
                  <option value="">Select Skill</option>
                  {availableSkills.map((skill, i) => (
                    <option key={i} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveSkill}
                    className="px-3 py-1 bg-green-500/20 border cursor-pointer border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/40"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelSkill}
                    className="px-3 py-1 bg-red-500/20 border border-red-500/50 cursor-pointer rounded-lg text-red-400 hover:bg-red-600/40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 space-y-6">

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
                  :
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
              <div className="w-3 h-3 rounded-sm bg-green-900" />
              <div className="w-3 h-3 rounded-sm bg-green-700" />
              <div className="w-3 h-3 rounded-sm bg-green-600" />
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <div className="w-3 h-3 rounded-sm bg-green-400" />
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

          <div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
            <h3 className="text-lg font-semibold text-green-400 mb-3">Connected Apps</h3>

            {editAppsIndex === undefined ? (
              <div>
                {Array.isArray(data.connectedApps) && data.connectedApps.length > 0 ? (
                  <div className="space-y-3">
                    {data.connectedApps.map((app, idx) => (
                      <div
                        key={app._id}
                        className="flex justify-between items-center p-3 bg-gray-800/40 border border-green-500/20 rounded-lg"
                      >
                        <span className="text-gray-200 font-medium">{app.appName}</span>
                        <div className="flex gap-2">
                          <a
                            href={app.appURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-lg text-green-300 hover:bg-green-600/40 transition cursor-pointer"
                          >
                            Visit
                          </a>
                          <button
                            onClick={() => {
                              setEditAppsIndex(idx);
                              setTempAppName(app.appName);
                              setTempAppUrl(app.appURL);
                            }}
                            className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 hover:bg-yellow-600/40 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteApp(idx)}
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
                  onClick={() => {
                    setEditAppsIndex("new");
                    setTempAppName("");
                    setTempAppUrl("");
                  }}
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
                  value={tempAppName}
                  onChange={(e) => setTempAppName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="url"
                  placeholder="App URL (https://...)"
                  value={tempAppUrl}
                  onChange={(e) => setTempAppUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveApp}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/40 cursor-pointer disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={resetForm}
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

            {editEducationIndex === undefined ? (
              <div>
                {Array.isArray(data.education) && data.education.length > 0 ? (
                  <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                      <div
                        key={edu._id || idx}
                        className="p-5 border border-green-500/20 rounded-xl bg-gray-800/40 transition-all shadow-md"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xl font-bold text-white flex items-center gap-2">
                            <School size={20} className="text-green-400" /> {edu.institute || "N/A"}
                          </h4>
                          {edu.passOutYear && (
                            <span className="text-sm text-gray-300 flex items-center gap-1">
                              <Clock size={14} className="text-green-400" /> {edu.passOutYear}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 pl-1">
                          {edu.department && (
                            <p className="text-sm text-gray-300 flex items-center gap-2">
                              <Laptop size={16} className="text-green-400" /> {edu.department}
                            </p>
                          )}
                          {edu.grade && (
                            <p className="text-sm text-yellow-400 flex items-center gap-2">
                              <Star size={14} className="text-green-500" /> CGPA: {edu.grade}
                            </p>
                          )}
                          {edu.location && (
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                              <MapPin size={14} className="text-green-400" /> {edu.location}
                            </p>
                          )}
                        </div>

                        <div className="border-t border-green-500/20 my-3"></div>

                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setEditEducationIndex(idx);
                              setEducationForm(edu);
                            }}
                            className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 hover:bg-yellow-600/40 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEducation(idx)}
                            className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/40 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                ) : (
                  <p className="text-gray-400">No education data available.</p>
                )}

                <button
                  onClick={() => {
                    setEditEducationIndex("new");
                    setEducationForm({
                      institute: "",
                      passOutYear: "",
                      department: "",
                      location: "",
                    });
                  }}
                  className="mt-3 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/40 cursor-pointer"
                >
                  Add Education
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                <input
                  type="text"
                  placeholder="Institute"
                  value={educationForm.institute}
                  onChange={(e) => setEducationForm({ ...educationForm, institute: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={educationForm.department}
                  onChange={(e) => setEducationForm({ ...educationForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="text"
                  placeholder="Expected Year (e.g., 2024–2028)"
                  value={educationForm.passOutYear}
                  onChange={(e) => setEducationForm({ ...educationForm, passOutYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={educationForm.location}
                  onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-green-500/30 text-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEducation}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/50 cursor-pointer rounded-lg text-green-400 hover:bg-green-600/40"
                  >
                    Save
                  </button>
                  <button
                    onClick={resetEducationForm}
                    className="px-3 py-1 bg-red-500/20 border border-red-500/50 cursor-pointer rounded-lg text-red-400 hover:bg-red-600/40"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Participated in Hackathons */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
            <h3 className="text-lg font-semibold text-green-400">
              Participated in Hackathons
            </h3>
            <ul className="mt-4 space-y-3">
              {Array.isArray(data.submittedHackathons) && data.submittedHackathons.length > 0 ? (
                data.submittedHackathons.map((hack, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-gray-300"
                  >
                    <span>{hack.hackathon.title}</span>
                    <a
                      href={hack.repoUrl || "#"}
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