import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDashboard } from "../backendApis/api";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Questions = () => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationTimer, setExplanationTimer] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeUntilMidnight, setTimeUntilMidnight] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [quizId, setQuizId] = useState(null);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboard();
                setUserId(res.data.userData._id);
                // console.log(res.data.userData);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };

        fetchData();
    }, []);

    const STORAGE_KEYS = {
        CURRENT_INDEX: 'devquest_current_index',
        TIME_LEFT: 'devquest_time_left',
        USER_ANSWERS: 'devquest_user_answers',
        QUIZ_STARTED: 'devquest_quiz_started',
        QUIZ_COMPLETED: 'devquest_quiz_completed',
        QUIZ_DATE: 'devquest_quiz_date'
    };

    // Get seconds until next midnight
    const getSecondsUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0); // Set to next midnight
        return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    };

    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Check if quiz is from today
    const isQuizFromToday = () => {
        const savedDate = localStorage.getItem(STORAGE_KEYS.QUIZ_DATE);
        const currentDate = getCurrentDate();
        return savedDate === currentDate;
    };

    const clearProgress = () => {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Error clearing progress from localStorage:', error);
        }
    };

    const resetQuizState = () => {
        setQuizStarted(false);
        setCurrentQuestionIndex(0);
        setTimeLeft(10);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setExplanationTimer(0);
        setIsCorrect(false);
        setQuizCompleted(false);
        setUserAnswers([]);
        clearProgress();
    };

    const loadProgress = () => {
        try {
            // Check if quiz is from today, if not reset everything
            if (!isQuizFromToday()) {
                resetQuizState();
                return;
            }

            const savedIndex = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
            const savedTimeLeft = localStorage.getItem(STORAGE_KEYS.TIME_LEFT);
            const savedAnswers = localStorage.getItem(STORAGE_KEYS.USER_ANSWERS);
            const savedQuizStarted = localStorage.getItem(STORAGE_KEYS.QUIZ_STARTED);
            const savedQuizCompleted = localStorage.getItem(STORAGE_KEYS.QUIZ_COMPLETED);

            if (savedIndex !== null) {
                setCurrentQuestionIndex(parseInt(savedIndex, 10));
            }
            if (savedTimeLeft !== null) {
                setTimeLeft(parseInt(savedTimeLeft, 10));
            }
            if (savedAnswers !== null) {
                setUserAnswers(JSON.parse(savedAnswers));
            }
            if (savedQuizStarted !== null) {
                setQuizStarted(JSON.parse(savedQuizStarted));
            }
            if (savedQuizCompleted !== null) {
                setQuizCompleted(JSON.parse(savedQuizCompleted));
            }
        } catch (error) {
            console.error('Error loading progress from localStorage:', error);
        }
    };

    const saveProgress = () => {
        try {
            localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, currentQuestionIndex.toString());
            localStorage.setItem(STORAGE_KEYS.TIME_LEFT, timeLeft.toString());
            localStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(userAnswers));
            localStorage.setItem(STORAGE_KEYS.QUIZ_STARTED, JSON.stringify(quizStarted));
            localStorage.setItem(STORAGE_KEYS.QUIZ_COMPLETED, JSON.stringify(quizCompleted));
            localStorage.setItem(STORAGE_KEYS.QUIZ_DATE, getCurrentDate());
        } catch (error) {
            console.error('Error saving progress to localStorage:', error);
        }
    };

    const dummyQuestions = [
        {
            id: "q1",
            question: "What does HTML stand for?",
            options: [
                "HyperText Markup Language",
                "Hyperlink and Text Markup Language",
                "Home Tool Markup Language",
                "Hyper Transfer Markup Language"
            ],
            correctAnswer: 0,
            explanation: "HTML stands for HyperText Markup Language. It's the standard language for creating web pages.",
            points: 10
        },
        {
            id: "q2",
            question: "Which company developed JavaScript?",
            options: [
                "Microsoft",
                "Netscape",
                "Sun Microsystems",
                "Oracle"
            ],
            correctAnswer: 1,
            explanation: "JavaScript was developed by Netscape in the mid-1990s.",
            points: 10
        },
        {
            id: "q3",
            question: "What is the time complexity of binary search?",
            options: [
                "O(n)",
                "O(log n)",
                "O(n log n)",
                "O(1)"
            ],
            correctAnswer: 1,
            explanation: "Binary search works in O(log n) time on sorted arrays.",
            points: 10
        }
    ];

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dailyquiz/today`);

            if (response.data?.dailyQuiz?.questions?.length > 0) {
                const fetchedData = response.data.dailyQuiz.questions;
                const quizId = response.data.dailyQuiz._id;

                const formattedQuestions = fetchedData.map((item) => ({
                    id: item._id,
                    question: item.question,
                    options: item.options,
                    correctAnswer: item.correctAnswer,
                    explanation: item.explanation,
                    points: item.points || 10
                }));

                setQuestions(formattedQuestions);
                setQuizId(quizId);
            } else {
                console.warn("No questions from backend, loading dummy questions...");
                setQuestions(dummyQuestions);
                setQuizId("dummyQuiz");
            }
        } catch (err) {
            console.error("Error fetching questions:", err);
            console.warn("Loading dummy questions due to error...");
            setQuestions(dummyQuestions);
            setQuizId("dummyQuiz");
        } finally {
            setIsLoading(false);
            loadProgress();

            // Auto-start quiz if it's a new day and not yet started
            if (isQuizFromToday()) {
                const savedQuizStarted = localStorage.getItem(STORAGE_KEYS.QUIZ_STARTED);
                if (savedQuizStarted === null) {
                    setQuizStarted(true);
                    setTimeLeft(10);
                }
            } else {
                // New day, start fresh
                setQuizStarted(true);
                setTimeLeft(10);
                localStorage.setItem(STORAGE_KEYS.QUIZ_DATE, getCurrentDate());
            }
        }
    };

    // Midnight countdown timer effect
    useEffect(() => {
        const updateMidnightTimer = () => {
            setTimeUntilMidnight(getSecondsUntilMidnight());
        };

        updateMidnightTimer(); // Initial call

        const timer = setInterval(() => {
            updateMidnightTimer();

            // Check if it's a new day
            if (!isQuizFromToday()) {
                window.location.reload();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0 && quizStarted) {
            saveProgress();
        }
    }, [currentQuestionIndex, timeLeft, userAnswers, quizStarted, quizCompleted, questions.length]);

    useEffect(() => {
        if (quizStarted && !showExplanation && !quizCompleted && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showExplanation) {
            handleTimeUp();
        }
    }, [timeLeft, quizStarted, showExplanation, quizCompleted]);

    useEffect(() => {
        if (showExplanation && explanationTimer > 0) {
            const timer = setTimeout(() => {
                setExplanationTimer(explanationTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (showExplanation && explanationTimer === 0) {
            moveToNextQuestion();
        }
    }, [explanationTimer, showExplanation]);

    const handleTimeUp = async () => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = null;
        setUserAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(10);
            setSelectedAnswer(null);
        } else {
            // Last question, complete the quiz
            const payload = { userId, quizId };
            try {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/finishquiz`, payload);
                // console.log("Quiz completion logged due to timer running out");
            } catch (err) {
                console.error("Error logging quiz completion on timeout:", err);
            }
            setQuizCompleted(true);
        }
    };

    const handleAnswerClick = async (answerIndex) => {
        if (selectedAnswer !== null || showExplanation) return;

        setSelectedAnswer(answerIndex);
        const correct = answerIndex === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);

        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = {
            selectedAnswer: answerIndex,
            isCorrect: correct,
            timeSpent: 10 - timeLeft
        };
        setUserAnswers(newAnswers);

        const questionId = questions[currentQuestionIndex].id;
        const payload = { questionId, userId };

        try {
            if (correct) {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/correctanswer`, payload);
                // console.log("Correct answer logged");
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/incorrectanswer`, payload);
                // console.log("Incorrect answer logged");
            }
        } catch (err) {
            console.error("Error posting answer:", err);
        }

        setShowExplanation(true);
        setExplanationTimer(correct ? 5 : 10);
    };

    const moveToNextQuestion = () => {
        setShowExplanation(false);
        setSelectedAnswer(null);
        setExplanationTimer(0);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(10);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleNextButton = () => {
        moveToNextQuestion();
    };

    const handleFinishQuiz = async () => {
        const payload = { userId, quizId };

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/finishquiz`, payload);
            // console.log("Quiz completion logged");
        } catch (err) {
            console.error("Error logging quiz finish:", err);
        }
        setQuizCompleted(true);
    };

    const startQuiz = () => {
        clearProgress();
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setTimeLeft(10);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setExplanationTimer(0);
        setQuizCompleted(false);
        setUserAnswers([]);
        localStorage.setItem(STORAGE_KEYS.QUIZ_DATE, getCurrentDate());
    };

    const resetQuiz = () => {
        resetQuizState();
        fetchQuestions();
    };

    const getQuizStats = () => {
        const answeredQuestions = userAnswers.filter(answer => answer !== null);
        const correctAnswers = answeredQuestions.filter(answer => answer && answer.isCorrect);
        return {
            total: questions.length,
            answered: answeredQuestions.length,
            correct: correctAnswers.length,
            percentage: answeredQuestions.length > 0 ? Math.round((correctAnswers.length / answeredQuestions.length) * 100) : 0
        };
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Loading Screen
    if (isLoading || questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white flex items-center justify-center">
                <div className="text-center space-y-8">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            Initializing DevQuest
                        </h2>
                        <p className="text-slate-300 text-lg">Preparing your personalized challenge...</p>
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Completed Screen
    if (quizCompleted) {
        const stats = getQuizStats();
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white relative overflow-hidden">
                {/* Background mesh overlay for subtle depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-gray-900/90"></div>

                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 space-y-12">
                    {/* Hero Section */}
                    <div className="text-center max-w-4xl w-full">
                        {/* <div className="flex items-center justify-center mb-4 relative w-32 h-32 mx-auto">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-700 to-green-900 opacity-20 animate-pulse"></div>
                            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-900 to-green-600 shadow-lg">
                                <span className="text-6xl">🏆</span>
                            </div>
                        </div> */}

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent ZaptronFont bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 leading-tight">
                            Mission Accomplished
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 -mt-3">
                            You've successfully completed the <span className="text-emerald-400 font-semibold">DevQuest</span> challenge.
                        </p>
                    </div>

                    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/30 rounded-2xl p-6 max-w-3xl w-full space-y-6 shadow-md">
                        <h2 className="text-xl md:text-2xl font-bold text-center text-white tracking-tight">
                            Performance <span className="text-emerald-400">Analytics</span>
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total Questions", value: stats.total, color: "text-white", bg: "bg-slate-700" },
                                { label: "Answered", value: stats.answered, color: "text-emerald-400", bg: "bg-emerald-800/20" },
                                { label: "Correct", value: stats.correct, color: "text-green-400", bg: "bg-green-800/20" },
                                { label: "Success Rate", value: `${stats.percentage}%`, color: "text-white", bg: "bg-emerald-700/20" },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center text-center space-y-1">
                                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow ${stat.bg}`}>
                                        <span className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                                    </div>
                                    <p className="text-slate-300 text-sm font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-center">
                            <div className={`inline-block px-4 py-2 rounded-xl w-auto md:w-auto border 
      ${stats.percentage >= 80 ? "bg-emerald-700/20 border-emerald-400 text-emerald-400" :
                                    stats.percentage >= 60 ? "bg-blue-700/20 border-blue-400 text-blue-400" :
                                        "bg-orange-700/20 border-orange-400 text-orange-400"}`}>
                                <span className="font-semibold text-sm">
                                    {stats.percentage >= 80 ? "Outstanding Performance!" :
                                        stats.percentage >= 60 ? "Great Job!" :
                                            "Good Effort! Keep Learning!"}
                                </span>
                            </div>
                            <p className="text-slate-300 text-xs mt-2">
                                {stats.percentage >= 80 ? "Exceptional work! Your mastery is impressive." :
                                    stats.percentage >= 60 ? "Well done! Keep building on this foundation." :
                                        "Every expert was once a beginner. Keep practicing!"}
                            </p>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => navigate("/leaderboard")}
                                className="px-4 py-2 bg-emerald-600 cursor-pointer hover:bg-green-600 text-white font-semibold rounded-lg shadow transition hover:scale-105 text-sm"
                            >
                                View Leaderboard 🏆
                            </button>
                        </div>

                        <div className="mt-4">
                            <div className="bg-slate-700 rounded-full h-2">
                                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.percentage}%` }}></div>
                            </div>
                        </div>

                        <div className="mt-4 text-center max-w-md mx-auto text-sm">
                            <h3 className="font-semibold text-white mb-1">Next Quiz Available In</h3>
                            <div className="font-mono font-bold text-emerald-400">{formatTime(timeUntilMidnight)}</div>
                            <p className="text-slate-400">New challenges refresh daily at midnight</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Interface
    const currentQuestion = questions[currentQuestionIndex];
    const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h1 className="text-xl font-bold text-white">DevQuest Assessment</h1>
                                    <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                                </div>
                            </div>

                            {/* Timer */}
                            <div className="flex items-center space-x-4">
                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${timeLeft <= 5 ? 'bg-red-600/20 border border-red-500/30 text-red-400' :
                                    timeLeft <= 10 ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400' :
                                        'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500' :
                                        timeLeft <= 10 ? 'bg-emerald-500' :
                                            'bg-emerald-500'
                                        } animate-pulse`}></div>
                                    <span>{timeLeft}s</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-300">Progress</span>
                                <span className="text-sm font-medium text-emerald-400">
                                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-6 py-8">
                    <div className="max-w-4xl w-full">
                        {/* Question Card */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 mb-8 shadow-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-1xl md:text-2xl font-bold text-white leading-relaxed">
                                    {currentQuestion.question}
                                </h2>
                            </div>

                            {/* Answer Options */}
                            <div className="grid gap-4 mb-8">
                                {currentQuestion.options.map((option, index) => {
                                    const optionLetter = String.fromCharCode(65 + index);
                                    const isSelected = selectedAnswer === index;
                                    const isCorrect = index === currentQuestion.correctAnswer;
                                    const showResult = selectedAnswer !== null;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerClick(index)}
                                            disabled={selectedAnswer !== null}
                                            className={`group relative p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] border-2 ${!showResult
                                                ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-600/50 hover:border-emerald-500/50 cursor-pointer'
                                                : isSelected
                                                    ? isCorrect
                                                        ? 'bg-emerald-600/20 border-emerald-500/50 shadow-emerald-500/20'
                                                        : 'bg-red-600/20 border-red-500/50 shadow-red-500/20'
                                                    : isCorrect
                                                        ? 'bg-emerald-600/20 border-emerald-500/50 shadow-emerald-500/20'
                                                        : 'bg-slate-800/30 border-slate-600/30 opacity-60'
                                                } ${selectedAnswer !== null ? 'cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                {/* Option Letter */}
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${!showResult
                                                    ? 'bg-slate-700 text-slate-300 group-hover:bg-emerald-600 group-hover:text-white'
                                                    : isSelected
                                                        ? isCorrect
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-red-600 text-white'
                                                        : isCorrect
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-slate-700 text-slate-400'
                                                    }`}>
                                                    {optionLetter}
                                                </div>

                                                {/* Option Text */}
                                                <div className="flex-1">
                                                    <p className={`text-base font-medium transition-colors duration-300 ${!showResult
                                                        ? 'text-white group-hover:text-emerald-100'
                                                        : isSelected || isCorrect
                                                            ? 'text-white'
                                                            : 'text-slate-400'
                                                        }`}>
                                                        {option}
                                                    </p>
                                                </div>

                                                {/* Result Icon */}
                                                {showResult && (isSelected || isCorrect) && (
                                                    <div className="flex-shrink-0">
                                                        {isSelected && isCorrect ? (
                                                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                            </div>
                                                        ) : isSelected && !isCorrect ? (
                                                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                                </svg>
                                                            </div>
                                                        ) : isCorrect && !isSelected ? (
                                                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Action Button */}
                            <div className="text-center">
                                {currentQuestionIndex === questions.length - 1 ? (
                                    <button
                                        onClick={handleFinishQuiz}
                                        className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium sm:font-semibold text-base sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
                                    >
                                        Complete Assessment
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNextButton}
                                        className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium sm:font-semibold text-base sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
                                    >
                                        Continue to Next Question
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Explanation Panel */}
                        {showExplanation && (
                            <div className={`bg-slate-800/60 backdrop-blur-sm border-2 rounded-3xl p-6 shadow-2xl transition-all duration-500 ${isCorrect
                                ? 'border-emerald-500/50 shadow-emerald-500/10'
                                : 'border-red-500/50 shadow-red-500/10'
                                }`}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCorrect ? 'bg-emerald-600' : 'bg-red-600'
                                            }`}>
                                            {isCorrect ? (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">
                                                {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                                            </h3>
                                            <p className="text-slate-400">
                                                {isCorrect ? 'Well done!' : 'Review the explanation below'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 rounded-xl border border-slate-600/50">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-slate-300 font-medium">Auto-advance in {explanationTimer}s</span>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                                    <h4 className="text-lg font-semibold text-white mb-3">Explanation</h4>
                                    <p className="text-slate-200 leading-relaxed text-lg">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Previously Answered Indicator */}
                        {hasAnsweredCurrent && !showExplanation && (
                            <div className="text-center mt-6">
                                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span className="text-emerald-400 font-medium">Previously answered</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Questions;