import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, User } from "lucide-react";

const dummyData = Array.from({ length: 15 }).map((_, i) => ({
  rank: i + 1,
  username: `User_${i + 1}`,
  points: Math.floor(Math.random() * 500) + 100,
  time: `${Math.floor(Math.random() * 30) + 1} min`
}));

const Leaderboard = () => {
  const [filter, setFilter] = useState("All Time");

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center mt-8 gap-2"
        >
          {["All Time", "Weekly", "Monthly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                filter === tab
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-2xl shadow-cyan-500/25 scale-105"
                  : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Leaderboard Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto"
      >
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-12 mb-12 max-w-5xl mx-auto">
          {dummyData.slice(0, 3).map((user, idx) => {
            const positions = [1, 0, 2]; // Second place, First place, Third place
            const actualIdx = positions[idx];
            const actualUser = dummyData[actualIdx];
            return (
              <motion.div
                key={actualUser.rank}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className={`relative text-center ${
                  actualUser.rank === 1 ? 'order-2 scale-110' : actualUser.rank === 2 ? 'order-1' : 'order-3'
                }`}
              >
                <div className="relative bg-gradient-to-br from-slate-400/15 to-slate-600/15 border border-slate-400/20 rounded-2xl p-6 backdrop-blur-md hover:bg-gradient-to-br hover:from-slate-300/20 hover:to-slate-500/20 hover:border-slate-300/30 hover:scale-105 hover:shadow-2xl hover:shadow-slate-400/20 transition-all duration-500 group">
                  {actualUser.rank === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-2 shadow-lg shadow-yellow-400/30 group-hover:shadow-yellow-400/50 transition-all duration-300">
                        <Crown className="text-white" size={20} />
                      </div>
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg ${
                      actualUser.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-400/30' :
                      actualUser.rank === 2 ? 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-400/30' :
                      'bg-gradient-to-br from-orange-400 to-orange-500 shadow-orange-400/30'
                    } transition-transform duration-300`}>
                      <span className="text-white font-black text-xl">{actualUser.rank}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-slate-200 transition-colors duration-300">{actualUser.username}</h3>
                    <p className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-emerald-300 transition-all duration-300">{actualUser.points}</p>
                    <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">{actualUser.time}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Leaderboard Table */}
        <div className="bg-slate-800/20 backdrop-blur-2xl rounded-3xl border border-slate-700/30 shadow-2xl shadow-slate-900/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 px-8 py-8 border-b border-slate-600/20">
            <h2 className="text-3xl font-black text-center bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Global Rankings
            </h2>
            <p className="text-center text-slate-400 mt-2 font-medium">Elite performers worldwide</p>
          </div>
          
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-slate-300 text-sm font-bold uppercase tracking-widest bg-slate-800/30 border-b border-slate-600/20">
                  <th className="py-6 px-8 text-left">Position</th>
                  <th className="py-6 px-8 text-left">Competitor</th>
                  <th className="py-6 px-8 text-left">Performance</th>
                  <th className="py-6 px-8 text-left">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {dummyData.slice(3).map((user, idx) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.05 }}
                    className={`group transition-all duration-500 cursor-pointer ${
                      idx % 2 === 0 
                        ? 'bg-slate-800/10 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:border-l-4 hover:border-l-cyan-400' 
                        : 'bg-slate-700/5 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:border-l-4 hover:border-l-emerald-400'
                    } hover:shadow-lg hover:shadow-slate-900/30 hover:translate-x-2`}
                  >
                    {/* Rank */}
                    <td className="py-6 px-8">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600/80 to-slate-700/80 flex items-center justify-center font-black text-white group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                            {user.rank}
                          </div>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-blue-600/0 group-hover:from-cyan-400/20 group-hover:to-blue-600/20 transition-all duration-500"></div>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-5 group-hover:translate-x-3 transition-transform duration-500">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center group-hover:scale-110 group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-500 shadow-lg">
                            <User className="text-white" size={24} />
                          </div>
                          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-blue-600/0 group-hover:from-cyan-400/30 group-hover:to-blue-600/30 blur group-hover:blur-md transition-all duration-500"></div>
                        </div>
                        <div>
                          <span className="font-bold text-xl group-hover:text-cyan-300 transition-colors duration-500">{user.username}</span>
                          <div className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors duration-500">Elite Competitor</div>
                        </div>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-6 px-8">
                      <div className="font-black text-2xl text-emerald-400 group-hover:text-emerald-300 group-hover:scale-105 transition-all duration-500">
                        {user.points}
                        <span className="text-slate-400 text-base font-medium ml-2 group-hover:text-slate-300">points</span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-6 px-8">
                      <div className="font-bold text-lg text-slate-300 group-hover:text-white group-hover:scale-105 transition-all duration-500">
                        {user.time}
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

export default Leaderboard;