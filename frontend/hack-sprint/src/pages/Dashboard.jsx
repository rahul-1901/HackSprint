import React, { useEffect, useState } from "react";
import { getDashboard, addEducation, editEducation, deleteEducation, deleteConnectedApp, addConnectedApp, editConnectedApp, addLanguages, deleteLanguages, addSkills, deleteSkills } from "../backendApis/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, CheckCircle, MessageSquare, Star, Coins, User } from "lucide-react";
import { School, Clock, Laptop, MapPin, Edit } from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import SubmissionForms from "../hackathon/DashboardSubmission";

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
  const [hackathon, setHackathon] = useState([]);
  const [submission, setSubmission] = useState([]);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [selectedHackathonId, setSelectedHackathonId] = useState(null);

  const navigate = useNavigate();

  const openSubmissionModal = (hackathonId) => {
    setSelectedHackathonId(hackathonId);
    setIsSubmissionOpen(true);
  };

  const closeSubmissionModal = () => {
    setSelectedHackathonId(null);
    setIsSubmissionOpen(false);
  };


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
    const fetchSubmissions = async () => {
      try {
        const results = await Promise.all(
          data?.submittedHackathons.map(async (id) => {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/submit/getSubmissionById/${id}`);
            return res.data;
          })
        );
        console.log(results)
        setSubmission(results);
      } catch (err) {
        console.error("Error fetching submission:", err);
      }
    };

    if (data?.submittedHackathons.length > 0) {
      fetchSubmissions();
    }
  }, [data]);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const results = await Promise.all(
          submission?.map(async (sub) => {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${sub.hackathon}`);
            return res.data;
          })
        );
        console.log(submission)
        setHackathon(results);
      } catch (err) {
        console.error("Error fetching hackathon:", err);
      }
    };

    if (submission?.length > 0) {
      fetchHackathons();
    }
  }, [data]);

  const jwtExpire = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decode = jwtDecode(token); //jwt-decode basically decode entire jwtToken and give details of user what we provided, in jsonObject
        const currentTime = Math.floor(Date.now() / 1000);

        if (decode.exp < currentTime) //expTime =  issuedAT + what we provided to jwt in backend, it is in seconds by default, even though we have provided in hour in backend 
        {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          toast.success("Logout successfull...", { autoClose: 800, style: { backgroundColor: "#f3f4f6", color: "#000000" } })
          setTimeout(() => {
            navigate('/account/login');
            window.location.reload();
          }, 2000)

        }
      }
    } catch (error) {
      console.error("Error");
    }
  }


  useEffect(() => {
    fetchData()
  }, [tempAppName, tempAppUrl, editAppsIndex, editEducationIndex, educationForm, selectedLanguage, isAddingLanguage, selectedSkill, isAddingSkill])

  useEffect(() => {
    jwtExpire();

    const interval = setInterval(jwtExpire, 60 * 1000);
    return () => clearInterval(interval);
  }, [])

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

          {/* Participated in Hackathons */}
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400 transition-all">
            <h3 className="text-lg font-semibold text-green-400">
              Participated in Hackathons
            </h3>
            <div className="space-y-4 mt-2">
              {hackathon.length > 0 ? (
                hackathon.map((hack) => {
                  const statusText = hack.status ? "Active" : "Inactive";
                  const hackSubmission = submission?.find((sub) => sub.hackathon === hack._id)
                  const submittedAt = hackSubmission?.submittedAt
                    ? new Date(hackSubmission.submittedAt).toLocaleDateString()
                    : "-";
                  const startDate = hack.startDate
                    ? new Date(hack.startDate).toLocaleDateString()
                    : "-";
                  const endDate = hack.endDate
                    ? new Date(hack.endDate).toLocaleDateString()
                    : "-";

                  return (
                    <div
                      key={hack._id}
                      className="flex flex-col md:flex-row items-center bg-white/5 border border-green-500/20 rounded-xl p-4 hover:border-green-400 transition-all"
                    >
                      {/* Hackathon Image */}
                      <div className="w-full md:w-48 h-32 md:h-24 flex-shrink-0 rounded-lg overflow-hidden mr-4 mb-4 md:mb-0">
                        {hack.image ? (
                          <img
                            src={hack.image}
                            alt={hack.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Hackathon Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-green-400">{hack.title}</h3>
                          <p className="text-gray-300 text-sm">{hack.subTitle}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2">
                          <span
                            className={`px-2 py-1 rounded-full ${hack.status ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                              }`}
                          >
                            {statusText}
                          </span>
                          <span>Submitted: {submittedAt}</span>
                          <span>Start: {startDate}</span>
                          <span>End: {endDate}</span>
                          <span className="ml-1 text-gray-400">
                            ₹{(
                              (hack.prizeMoney1 || 0) +
                              (hack.prizeMoney2 || 0) +
                              (hack.prizeMoney3 || 0)
                            ).toLocaleString("en-IN")}
                          </span>

                        </div>

                        <div className="mt-2">
                          {/* <a
                            href={hackSubmission.repoUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-400 underline hover:text-green-300 text-sm"
                          >
                            View Submission
                          </a> */}
                          <button
                            onClick={() => openSubmissionModal(hack._id)}
                            className="mt-2 text-green-400 cursor-pointer"
                          >
                            View Submission
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No hackathons submitted yet.</p>
              )}
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

          {isSubmissionOpen && (
            <SubmissionForms
              isOpen={isSubmissionOpen}
              onClose={closeSubmissionModal}
              hackathonId={selectedHackathonId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;