"use client"

import { useState, useEffect } from "react"
import { CornerDownRight, X } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"


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
      style={{
        animationName: "morph",
        animationDuration: "8s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }}
    />
    <div
      className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-600/3 rounded-full blur-3xl"
      style={{
        animationDelay: "4s",
        animationName: "morph",
        animationDuration: "8s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-400/2 rounded-full blur-2xl"
      style={{
        animationDelay: "2s",
        animationName: "morph",
        animationDuration: "8s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }}
    />
  </div>
)

const Quest = () => {
  const [isCorrect, setIsCorrect] = useState(false)
  const [questions, setQuestions] = useState([])
  const [previewQuest, setPreviewQuest] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(null)
  const [dummyPreview, setDummyPreview] = useState({ question: "", options: [] });
  const [prevFive, setPrevFive] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  // ✅ Handle countdown redirect
  useEffect(() => {
    if (redirectCountdown === null) return
    if (redirectCountdown === 0) {
      navigate("/account/login")
      return
    }
    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [redirectCountdown, navigate])

  // ✅ View All Questions handler
  const handleViewAll = () => {
    if (isLoggedIn) {
      navigate("/questions")
    } else {
      setRedirectCountdown(3)
    }
  }

  useEffect(() => {
    const fetchDailyQuizzes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dailyquiz/allquiz`);
        const quizData = response.data.quizData || [];

        // ✅ Build preview: only 5 questions total across all quizzes
        const allQuestions = quizData.flatMap(quiz => quiz.questions);
        const topFiveQuestions = allQuestions.slice(0, 5);

        const preview = {
          question: "Here are the last 5 Daily Quiz Questions:",
          options: topFiveQuestions.map((q, i) => `Q${i + 1}: ${q.question}`),
        };
        setDummyPreview(preview);

        // ✅ Build prevFive: each quiz keeps its own questions
        const latestFiveQuizzes = quizData.slice(0, 5).map((quiz) => ({
          key: quiz._id,
          date: new Date(quiz.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric"
          }),
          topic: quiz.Title,
          questions: quiz.questions, // 👈 keep original per-quiz questions
        }));
        setPrevFive(latestFiveQuizzes);

      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchDailyQuizzes();
  }, []);




  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/devquest`)
        const fetchedData = response.data["Questions&Answer"] || response.data.questions || response.data
        const formattedQuestions = (fetchedData || []).map((item) => ({
          id: item.id,
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          topic: item.topic,
        }))
        setQuestions(formattedQuestions)
      } catch (err) {
        console.error("Error fetching questions:", err)
      }
    }
    fetchQuestions()
  }, [])

  const todayCount = questions.length || 5
  const todayTopic = (questions[0] && questions[0].topic) || "Devlup Intro Quiz"
  const todayDateStr = new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })

  // const prevFive = Array.from({ length: 5 }).map((_, i) => {
  //   const d = new Date()
  //   d.setDate(d.getDate() - (i + 1))
  //   return {
  //     key: i,
  //     date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  //     topic: "Web Dev",
  //   }
  // })

  // const dummyPreview = {
  //   question: "What is web technology?",
  //   options: [
  //     "A collection of tools and techniques used to create and deliver content on the World Wide Web",
  //     "A type of software that enables users to access and interact with information on the internet",
  //     "A network of interconnected computers that share information and services",
  //     "A system for storing and retrieving information on the internet",
  //   ],
  // }



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { type: "spring", stiffness: 400, damping: 17 },
    },
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  }

  return (

    <motion.div
      className="min-h-screen bg-gray-900 text-white font-sans relative overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"></div>
        {/* Geometric patterns */}
        <GridBackground />

        {/* Large typography watermark */}
        <motion.div
          className="absolute top-20 left-8 text-green-500/[0.03] text-[140px] font-black select-none tracking-wider transform -rotate-3"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        >
          DEV
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-8 text-green-500/[0.02] text-[100px] font-black select-none tracking-wider"
          initial={{ opacity: 0, scale: 0.8, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.7, duration: 1.3, ease: "easeOut" }}
        >
          QUEST
        </motion.div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header className="pt-8 pb-12 max-w-7xl mx-auto" variants={fadeInUp}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <motion.div className="space-y-1" variants={fadeInLeft}>
              <motion.p
                className="text-sm text-gray-400 font-mono tracking-wider uppercase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                HackSprint · DevQuests
              </motion.p>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl ZaptronFont text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-700 tracking-tight leading-none"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              >
                DevQuest
              </motion.h1>
              <motion.div
                className="flex items-center gap-4 mt-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.div
                  className="w-12 h-px bg-green-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                ></motion.div>
                <p className="text-lg text-gray-300 font-light tracking-wide">Daily Challenges</p>
              </motion.div>
            </motion.div>

            <motion.div className="lg:text-right" variants={fadeInRight}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-full bg-gray-800/50 backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: "rgb(75 85 99)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                ></motion.div>
                <span className="text-sm text-gray-300 font-mono">Stay consistent · Maintain Your Streak</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main className="max-w-7xl mx-auto" variants={staggerContainer}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column - Info Cards */}
            <motion.div
              className="lg:col-span-5 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  title: "Revise Core Concepts",
                  desc: "Strengthen your fundamentals daily with short, focused DevQuests.",
                  accent: "top-0 left-0",
                },
                {
                  title: "Build Your Streak",
                  desc: "Attempt daily and maintain your streak while climbing the leaderboard.",
                  accent: "top-0 right-0",
                },
                {
                  title: "New Daily Challenges",
                  desc: "Hands-on problems covering MongoDB, Express, React, and Node.js.",
                  accent: "bottom-0 left-0",
                },
                {
                  title: "Sharpen Interview Skills",
                  desc: "Curated from real-world coding interview patterns.",
                  accent: "bottom-0 right-0",
                },
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  className="group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:bg-gray-800/50 hover:border-gray-600"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover="hover"
                >
                  {/* Subtle accent corner */}
                  <motion.div
                    className={`absolute ${card.accent} w-3 h-3 bg-green-500/30 rounded-sm transition-all duration-300 group-hover:bg-green-500/50`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  ></motion.div>

                  <div className="space-y-3">
                    <motion.h3
                      className="text-lg font-semibold text-green-400 group-hover:text-green-300 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-gray-300 leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                    >
                      {card.desc}
                    </motion.p>
                  </div>

                  {/* Subtle bottom line */}
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right Column - Today's Questions */}
            <motion.div className="lg:col-span-7" variants={fadeInRight}>
              <motion.div
                className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8 shadow-2xl"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Question Count */}
                  <motion.div className="flex-shrink-0" variants={scaleIn}>
                    <div className="relative">
                      <motion.div
                        className="w-36 h-36 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 flex items-center justify-center shadow-xl"
                        whileHover={{
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.5 },
                        }}
                      >
                        <div className="text-center text-white">
                          <motion.div
                            className="text-4xl font-black text-green-400 mb-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                          >
                            {/* {todayCount} */}
                            8
                          </motion.div>
                          <motion.div
                            className="text-sm font-mono text-gray-300 tracking-wide"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.4 }}
                          >
                            Questions
                          </motion.div>
                        </div>
                      </motion.div>
                      {/* Geometric accent */}
                      <motion.div
                        className="absolute -top-2 -right-2 w-4 h-4 bg-green-500/50 rounded-sm"
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1.2, duration: 0.4 }}
                      ></motion.div>
                      <motion.div
                        className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-500/30 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.4, duration: 0.3 }}
                      ></motion.div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    {/* Header Info */}
                    <motion.div
                      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                      variants={fadeInUp}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <p className="text-sm text-gray-400 font-mono mb-1">TODAY'S TOPIC</p>
                        <h3 className="text-xl lg:text-2xl font-bold text-white">{todayTopic}</h3>
                      </motion.div>
                      <motion.div
                        className="text-left sm:text-right"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <p className="text-sm text-gray-400 font-mono mb-1">DATE</p>
                        <p className="text-lg font-semibold text-green-400">{todayDateStr}</p>
                      </motion.div>
                    </motion.div>

                    {/* Description */}
                    <motion.div className="space-y-4" variants={fadeInUp}>
                      <motion.p
                        className="text-gray-300 leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        DevQuest delivers short, focused challenges daily — perfect for interviews and building
                        real-world skills.
                      </motion.p>

                      {/* Divider */}
                      <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9, duration: 0.4 }}
                      >
                        <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent"></div>
                        <motion.div
                          className="w-1 h-1 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
                        ></motion.div>
                        <div className="flex-1 h-px bg-gradient-to-l from-green-500/30 to-transparent"></div>
                      </motion.div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4"
                      variants={staggerContainer}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      <motion.button
                        onClick={() => navigate("/questions")}
                        className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] shadow-lg cursor-pointer"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>View Today's Questions</span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                        >
                          <CornerDownRight className="w-4 h-4" />
                        </motion.div>
                      </motion.button>
                      {/* <motion.button
                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                        className="px-6 py-3 text-sm font-medium text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-400/50 rounded-xl transition-all duration-300 hover:bg-green-500/5"
                        whileHover={{
                          scale: 1.02,
                          borderColor: "rgba(34, 197, 94, 0.5)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Previous DevQuests
                      </motion.button> */}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Previous DevQuests Section */}
          <motion.section
            className="mt-20 pb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              {/* <motion.div
                className="w-8 h-px bg-green-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              ></motion.div>
              <h2 className="text-xl font-bold text-green-400 font-mono tracking-wide">PREVIOUS DEVQUESTS</h2>
              <motion.div
                className="flex-1 h-px bg-gradient-to-r from-green-500/20 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
              ></motion.div> */}
            </motion.div>

            {/* <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {prevFive.map((quest, index) => (
                <motion.button
                  key={quest.key}
                  onClick={() => setPreviewQuest(quest)}
                  className="group text-left p-6 bg-gray-800/20 border border-gray-700/40 rounded-xl transition-all duration-300 hover:bg-gray-800/40 hover:border-gray-600/60 hover:scale-[1.02]"
                  variants={fadeInUp}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-green-400 font-semibold">{quest.date}</span>
                      <motion.div
                        className="w-2 h-2 bg-gray-600 group-hover:bg-green-500/50 rounded-full transition-colors"
                        whileHover={{ scale: 1.5 }}
                      ></motion.div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {quest.topic}
                      </h3>
                      <motion.div
                        className="mt-2 w-8 h-px bg-green-500/20 group-hover:bg-green-500/40 transition-colors"
                        whileHover={{ scaleX: 1.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      ></motion.div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div> */}
          </motion.section>
        </motion.main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {previewQuest && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewQuest(null)}
          >
            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <motion.div
                className="flex items-center justify-between p-6 border-b border-gray-700"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{previewQuest.topic}</h2>
                  <p className="text-sm text-green-400 font-mono">{previewQuest.date}</p>
                </div>
                <motion.button
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setPreviewQuest(null)}
                  whileHover={{ scale: 1.1, backgroundColor: "rgb(55 65 81)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Modal Content */}
              <motion.div
                className="p-6 overflow-y-auto max-h-[70vh]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">SAMPLE QUESTION</h3>
                    <p className="text-gray-300 leading-relaxed">{dummyPreview.question}</p>
                  </div>

                  <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="visible">
                    {dummyPreview.options.map((option, idx) => (
                      <motion.div
                        key={idx}
                        className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-200 shadow-lg"
                        style={{
                          opacity: isLoggedIn ? 1 : 1 - idx * 0.35, // 👈 forces different opacity per option
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                        }}
                        variants={{
                          ...fadeInUp,
                          visible: {
                            ...fadeInUp.visible,
                            opacity: isLoggedIn ? 1 : 1 - idx * 0.35, // 👈 overrides only for options
                          },
                        }}
                        initial="hidden"
                        animate="visible"
                        whileHover={{
                          x: 5,
                          opacity: isLoggedIn ? 1 : 1 - idx * 0.35, // opacity on hover
                          backgroundColor: "rgba(55, 65, 81, 0.5)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        <span className="font-mono text-green-400 mr-3 text-sm">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="text-sm">{option}</span>
                      </motion.div>
                    ))}

                  </motion.div>
                </div>
              </motion.div>

              {/* Modal Footer */}
              <motion.div
                className="p-6 border-t border-gray-700 bg-gray-800/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {!isLoggedIn && (
                  <motion.button
                    onClick={handleViewAll}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.01] shadow-lg"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {redirectCountdown !== null ? (
                      <span>Redirecting to login in {redirectCountdown}...</span>
                    ) : (
                      <span>View All Questions</span>
                    )}
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Quest