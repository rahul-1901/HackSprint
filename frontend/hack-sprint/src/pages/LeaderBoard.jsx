import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaMedal } from "react-icons/fa";

const dummyData = Array.from({ length: 15 }).map((_, i) => ({
  rank: i + 1,
  username: `User_${i + 1}`,
  points: Math.floor(Math.random() * 500) + 100,
  time: `${Math.floor(Math.random() * 30) + 1} min`
}));

const Leaderboard = () => {
  const [filter, setFilter] = useState("All Time");

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      {/* Header Banner */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg"
        >
          🏆 Leaderboard
        </motion.h1>
        <p className="text-gray-400 mt-2">
          Track your progress and climb to the top every day.
        </p>

        
        <div className="flex justify-center mt-6 gap-4">
          {["All Time", "Weekly", "Monthly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === tab
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                <th className="py-2 px-2 text-left w-[10%]">Rank</th>
                <th className="py-2 px-2 text-left w-[40%]">Username</th>
                <th className="py-2 px-2 text-left w-[25%]">Points</th>
                <th className="py-2 px-2 text-left w-[25%]">Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((user, idx) => (
                <motion.tr
                  key={user.rank}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`text-sm border-b border-gray-800/50 last:border-0 hover:bg-white/10 hover:scale-[1.01] transition-transform ${
                    idx < 3 ? "font-semibold" : ""
                  }`}
                >
                  
                  <td className="py-2 px-2">
                    {user.rank <= 3 ? (
                      <FaMedal
                        className={`text-xl ${
                          user.rank === 1
                            ? "text-yellow-400"
                            : user.rank === 2
                            ? "text-gray-300"
                            : "text-orange-400"
                        }`}
                      />
                    ) : (
                      <span>{user.rank}</span>
                    )}
                  </td>

                  
                  <td className="py-2 px-2 flex items-center gap-3">
                    <FaUserCircle className="text-2xl text-cyan-400" />
                    <span>{user.username}</span>
                  </td>

                  
                  <td className="py-2 px-2">{user.points}</td>

                  
                  <td className="py-2 px-2">{user.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
