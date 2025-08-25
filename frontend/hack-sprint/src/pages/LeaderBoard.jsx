"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, User } from "lucide-react";
import axios from "axios";

const Leaderboard = () => {
  const [filter, setFilter] = useState("All Time");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/leaderBoard`
        );
        console.log("Leaderboard data:", res.data);
        setLeaderboard(res.data.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white px-4 py-10">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full"></div>
          <h1 className="relative text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            <Trophy className="inline-block mr-4 text-yellow-400" size={48} />
            Leaderboard
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-slate-400 mt-4 text-lg font-medium"
        >
          Compete with the best minds and claim your throne
        </motion.p>

        {/* Filter Tabs */}
      </div>

      {/* Leaderboard Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto"
      >
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-12 mb-12 max-w-5xl mx-auto items-end">
          {/* Second place (left) */}
          {leaderboard[1] && <PodiumCard user={leaderboard[1]} place={2} />}

          {/* First place (center, bigger) */}
          {leaderboard[0] && (
            <PodiumCard user={leaderboard[0]} place={1} highlight />
          )}

          {/* Third place (right) */}
          {leaderboard[2] && <PodiumCard user={leaderboard[2]} place={3} />}
        </div>

        {/* Main Leaderboard Table */}
        <div className="bg-slate-800/20 backdrop-blur-2xl rounded-3xl border border-slate-700/30 shadow-2xl shadow-slate-900/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 px-8 py-8 border-b border-slate-600/20">
            <h2 className="text-3xl font-black text-center bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Global Rankings
            </h2>
            <p className="text-center text-slate-400 mt-2 font-medium">
              Elite performers worldwide
            </p>
          </div>

          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-slate-300 text-sm font-bold uppercase tracking-widest bg-slate-800/30 border-b border-slate-600/20">
                  <th className="py-6 px-8 text-left">Position</th>
                  <th className="py-6 px-8 text-left">Competitor</th>
                  <th className="py-6 px-8 text-left">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {leaderboard.slice(3).map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.05 }}
                    className={`group transition-all duration-500 cursor-pointer ${
                      idx % 2 === 0
                        ? "bg-slate-800/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:border-l-4 hover:border-l-cyan-400"
                        : "bg-slate-700/5 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:border-l-4 hover:border-l-emerald-400"
                    } hover:shadow-lg hover:shadow-slate-900/30 hover:translate-x-2`}
                  >
                    {/* Rank */}
                    <td className="py-6 px-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600/80 to-slate-700/80 flex items-center justify-center font-black text-white shadow-lg">
                        {idx + 4}
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                          <User className="text-white" size={24} />
                        </div>
                        <div>
                          <span className="font-bold text-xl">{user.name}</span>
                          <div className="text-slate-400 text-sm font-medium">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-6 px-8">
                      <div className="font-black text-2xl text-emerald-400">
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

const PodiumCard = ({ user, place, highlight }) => (
  <motion.div
    key={user._id}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`relative text-center ${highlight ? "scale-110 order-2" : ""}`}
  >
    <div className="relative bg-gradient-to-br from-slate-400/15 to-slate-600/15 border border-slate-400/20 rounded-2xl p-6 backdrop-blur-md hover:scale-105 transition-all duration-500">
      {place === 1 && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-2 shadow-lg shadow-yellow-400/30">
            <Crown className="text-white" size={20} />
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg ${
            place === 1
              ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-400/30"
              : place === 2
              ? "bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-400/30"
              : "bg-gradient-to-br from-orange-400 to-orange-500 shadow-orange-400/30"
          }`}
        >
          <span className="text-white font-black text-xl">{place}</span>
        </div>
        <h3 className="font-bold text-lg mb-2">{user.name}</h3>
        <p className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          {user.points}
        </p>
      </div>
    </div>
  </motion.div>
);

export default Leaderboard;
