"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, User } from "lucide-react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/leaderBoard`
        );
        let data = res.data.leaderboard || [];

        if (data.length > 0) {
          // ✅ Sort by points (descending)
          data = [...data].sort((a, b) => b.points - a.points);
          setLeaderboard(data);
          setHasData(true);
        } else {
          setLeaderboard([]);
          setHasData(false);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setLeaderboard([]);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 text-xl">
        Loading Leaderboard...
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br overflow-hidden from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-10">
        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full"></div>
            <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-black bg-clip-text bg-gradient-to-b from-green-400 to-green-700 text-transparent ZaptronFont">
              {/* <Trophy className="inline-block mr-3 text-yellow-400" size={40} /> */}
              Leaderboard
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-slate-400 mt-4 text-base sm:text-lg font-medium"
          >
            Compete with the best minds and claim your throne
          </motion.p>
        </div>

        {/* No Data Message */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-slate-800/20 backdrop-blur-2xl rounded-2xl md:rounded-3xl border border-slate-700/30 shadow-2xl shadow-slate-900/50 p-12">
            <Trophy className="mx-auto mb-6 text-slate-500" size={64} />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-300 mb-4">
              No Competitors Yet
            </h2>
            <p className="text-slate-400 text-lg">
              Be the first to join the competition and claim your spot on the leaderboard!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ✅ Split top 3 and the rest
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br overflow-hidden from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 blur-3xl bg-clip-text bg-gradient-to-b from-green-400 to-green-700 rounded-full"></div>
          <h1 className="relative text-6xl sm:text-7xl md:text-8xl font-black bg-clip-text bg-gradient-to-b from-green-400 to-green-700 text-transparent ZaptronFont">
            {/* <Trophy className="inline-block mr-3 text-yellow-400" size={40} /> */}
            Leaderboard
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-slate-400 -mt-2 text-base sm:text-lg font-medium"
        >
          Compete with the best minds and claim your throne
        </motion.p>
      </div>

      {/* ✅ Podium - Desktop: 2nd, 1st, 3rd | Mobile: 1st, 2nd, 3rd */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto"
      >
        {/* Desktop Layout - 2nd, 1st, 3rd */}
        <div className="hidden sm:grid grid-cols-3 gap-8 sm:gap-12 mb-12 max-w-5xl mx-auto items-end">
          {topThree[1] && <PodiumCard user={topThree[1]} place={2} />}
          {topThree[0] && <PodiumCard user={topThree[0]} place={1} highlight />}
          {topThree[2] && <PodiumCard user={topThree[2]} place={3} />}
        </div>

        {/* Mobile Layout - 1st, 2nd, 3rd */}
        <div className="sm:hidden grid grid-cols-1 gap-6 mb-12 max-w-sm mx-auto">
          {topThree[0] && <PodiumCard user={topThree[0]} place={1} highlight />}
          {topThree[1] && <PodiumCard user={topThree[1]} place={2} />}
          {topThree[2] && <PodiumCard user={topThree[2]} place={3} />}
        </div>

        {/* Main Table */}
        <div className="bg-slate-800/20 backdrop-blur-2xl rounded-2xl md:rounded-3xl border border-slate-700/30 shadow-2xl shadow-slate-900/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 px-4 sm:px-6 py-6 sm:py-6 border-b border-slate-600/20">
            <h2 className="text-2xl sm:text-3xl font-black text-center bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Quest Ranking
            </h2>
            <p className="text-center text-slate-400 mt-1 font-medium text-sm sm:text-base">
              Elite performers
            </p>
          </div>

          {/* Table wrapper → scrollable only on small screens */}
          <div className="overflow-x-auto sm:overflow-visible">
            <table className="w-full min-w-[500px] sm:min-w-0">
              <thead>
                <tr className="text-slate-300 text-xs sm:text-sm font-bold uppercase tracking-widest bg-slate-800/30 border-b border-slate-600/20">
                  <th className="py-4 sm:py-6 px-4 text-left whitespace-nowrap">
                    Position
                  </th>
                  <th className="py-4 sm:py-6 px-6 sm:px-10 text-left whitespace-nowrap">
                    Competitor
                  </th>
                  <th className="py-4 sm:py-6 px-6 sm:px-10 text-left whitespace-nowrap">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {rest.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.05 }}
                    className={`group transition-all duration-500 cursor-pointer ${idx % 2 === 0
                      ? "bg-slate-800/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:border-l-4 hover:border-l-cyan-400"
                      : "bg-slate-700/5 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:border-l-4 hover:border-l-emerald-400"
                      } hover:shadow-lg hover:shadow-slate-900/30 hover:translate-x-2`}
                  >
                    {/* Rank */}
                    <td className="py-4 sm:py-6 px-4 sm:px-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-600/80 to-slate-700/80 flex items-center justify-center font-black text-white shadow-lg">
                        {idx + 4}
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-3 sm:py-6 px-6 sm:px-10 max-w-[220px] sm:max-w-none">
                      <div className="flex items-center gap-3 sm:gap-5">
                        <div className="w-full">
                          <span className="font-bold text-sm sm:text-lg block truncate">
                            {user.name}
                          </span>
                          <div className="text-slate-400 text-xs sm:text-sm font-medium truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-4 sm:py-6 px-6 sm:px-10 whitespace-nowrap">
                      <div className="font-black text-lg sm:text-2xl text-emerald-400 truncate">
                        {user.points} pts
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const PodiumCard = ({ user, place }) => (
  <motion.div
    key={user._id}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative text-center"
  >
    <div className="relative bg-gradient-to-br from-slate-400/15 to-slate-600/15 border border-slate-400/20 rounded-2xl p-4 sm:p-6 backdrop-blur-md hover:scale-105 transition-all duration-500">
      {/* 👑 Crown only for 1st place */}
      {place === 1 && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-2 shadow-lg shadow-yellow-400/30">
            <Crown className="text-white" size={20} />
          </div>
        </div>
      )}

      <div className="relative z-10 mt-2">
        {/* Circle Rank Badge */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center shadow-lg ${place === 1
            ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-400/30"
            : place === 2
              ? "bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-400/30"
              : "bg-gradient-to-br from-orange-400 to-orange-500 shadow-orange-400/30"
            }`}
        >
          <span className="text-white font-black text-lg sm:text-xl">{place}</span>
        </div>

        {/* Name + Points */}
        <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{user.name}</h3>
        <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          {user.points}
        </p>
      </div>
    </div>
  </motion.div>
);

export default Leaderboard;