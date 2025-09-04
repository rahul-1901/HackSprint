import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDashboard } from "../backendApis/api";
import { useNavigate } from "react-router-dom";

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
    const [quizResetTimer, setQuizResetTimer] = useState(86400);
    const [isLoading, setIsLoading] = useState(true);
    const [quizId, setQuizId] = useState(null);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboard();
                setUserId(res.data.userData._id);
                console.log(res.data.userData);
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
        QUIZ_START_TIME: 'devquest_quiz_start_time',
        RESET_TIMER: 'devquest_reset_timer'
    };

    const checkQuizExpiry = () => {
        const startTime = localStorage.getItem(STORAGE_KEYS.QUIZ_START_TIME);
        if (startTime) {
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - parseInt(startTime)) / 1000);
            return elapsedTime >= 86400;
        }
        return false;
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
        setQuizResetTimer(86400);
        clearProgress();
    };

    const loadProgress = () => {
        try {
            if (checkQuizExpiry()) {
                resetQuizState();
                return;
            }

            const savedIndex = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
            const savedTimeLeft = localStorage.getItem(STORAGE_KEYS.TIME_LEFT);
            const savedAnswers = localStorage.getItem(STORAGE_KEYS.USER_ANSWERS);
            const savedQuizStarted = localStorage.getItem(STORAGE_KEYS.QUIZ_STARTED);
            const savedQuizCompleted = localStorage.getItem(STORAGE_KEYS.QUIZ_COMPLETED);
            const savedResetTimer = localStorage.getItem(STORAGE_KEYS.RESET_TIMER);
            const startTime = localStorage.getItem(STORAGE_KEYS.QUIZ_START_TIME);

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

            if (startTime && savedResetTimer) {
                const currentTime = Date.now();
                const elapsedTime = Math.floor((currentTime - parseInt(startTime)) / 1000);
                const remainingTime = Math.max(0, 86400 - elapsedTime);
                setQuizResetTimer(remainingTime);
            } else if (savedResetTimer !== null) {
                setQuizResetTimer(parseInt(savedResetTimer, 10));
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
            localStorage.setItem(STORAGE_KEYS.RESET_TIMER, quizResetTimer.toString());

            if (!localStorage.getItem(STORAGE_KEYS.QUIZ_START_TIME)) {
                localStorage.setItem(STORAGE_KEYS.QUIZ_START_TIME, Date.now().toString());
            }
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

            const savedQuizStarted = localStorage.getItem(STORAGE_KEYS.QUIZ_STARTED);
            if (savedQuizStarted === null && !checkQuizExpiry()) {
                setQuizStarted(true);
                setTimeLeft(10);
                localStorage.setItem(STORAGE_KEYS.QUIZ_START_TIME, Date.now().toString());
            }
        }
    };


    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (quizStarted && quizResetTimer > 0) {
            const timer = setTimeout(() => {
                setQuizResetTimer(quizResetTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (quizResetTimer === 0 && quizStarted) {
            window.location.reload();
        }
    }, [quizResetTimer, quizStarted]);

    useEffect(() => {
        if (quizCompleted && quizResetTimer > 0) {
            const timer = setTimeout(() => {
                setQuizResetTimer(quizResetTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (quizCompleted && quizResetTimer === 0) {
            window.location.reload();
        }
    }, [quizResetTimer, quizCompleted]);

    useEffect(() => {
        if (questions.length > 0 && quizStarted) {
            saveProgress();
        }
    }, [currentQuestionIndex, timeLeft, userAnswers, quizStarted, quizCompleted, quizResetTimer, questions.length]);

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

    const handleTimeUp = () => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = null;
        setUserAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(10);
            setSelectedAnswer(null);
        } else {
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
                console.log("Correct answer logged");
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/incorrectanswer`, payload);
                console.log("Incorrect answer logged");
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
            console.log("Quiz completion logged");
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
        setQuizResetTimer(86400);
        localStorage.setItem(STORAGE_KEYS.QUIZ_START_TIME, Date.now().toString());
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

    // Start Screen
    // if (!quizStarted) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
    //             {/* Animated Background Elements */}
    //             <div className="absolute inset-0">
    //                 <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
    //                 <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    //                 <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
    //             </div>

    //             {/* Grid Pattern */}
    //             <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

    //             <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
    //                 <div className="text-center max-w-4xl">
    //                     {/* Logo/Title Section */}
    //                     <div className="mb-12 space-y-6">
    //                         <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-2xl">
    //                             <div className="text-3xl font-bold text-white">DQ</div>
    //                         </div>

    //                         <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent leading-tight">
    //                             DevQuest
    //                         </h1>

    //                         <div className="space-y-2">
    //                             <p className="text-2xl font-medium text-slate-300">Professional Developer Assessment</p>
    //                             <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto rounded-full"></div>
    //                         </div>
    //                     </div>

    //                     {/* Feature Cards */}
    //                     <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
    //                         <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
    //                             <div className="text-emerald-500 text-3xl mb-3">⚡</div>
    //                             <h3 className="font-semibold text-white mb-2">Daily Challenges</h3>
    //                             <p className="text-slate-400 text-sm">Fresh questions every 24 hours</p>
    //                         </div>

    //                         <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
    //                             <div className="text-green-500 text-3xl mb-3">🎯</div>
    //                             <h3 className="font-semibold text-white mb-2">Instant Feedback</h3>
    //                             <p className="text-slate-400 text-sm">Learn with detailed explanations</p>
    //                         </div>

    //                         <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
    //                             <div className="text-teal-500 text-3xl mb-3">📊</div>
    //                             <h3 className="font-semibold text-white mb-2">Track Progress</h3>
    //                             <p className="text-slate-400 text-sm">Monitor your skill development</p>
    //                         </div>
    //                     </div>

    //                     {/* CTA Section */}
    //                     <div className="space-y-6">
    //                         <button
    //                             onClick={startQuiz}
    //                             className="group relative px-12 py-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-emerald-500/25"
    //                         >
    //                             <span className="relative z-10">Begin Assessment</span>
    //                             <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
    //                         </button>

    //                         <p className="text-slate-400 text-lg">
    //                             Ready to test your development expertise?
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // Quiz Completed Screen
    if (quizCompleted) {
        const stats = getQuizStats();
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
                {/* Enhanced Animated Background */}
                <div className="absolute inset-0">
                    {/* Floating orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>

                    {/* Animated particles */}
                    <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400/40 rounded-full animate-ping"></div>
                    <div className="absolute top-40 right-32 w-1 h-1 bg-green-400/60 rounded-full animate-ping delay-700"></div>
                    <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-teal-400/50 rounded-full animate-ping delay-300"></div>

                    {/* Gradient mesh overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30"></div>
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
                    <div className="text-center max-w-5xl w-full">
                        {/* Hero Section with Trophy Animation */}
                        <div className="mb-12 animate-fade-in-up">
                            <div className="relative mb-8">
                                {/* Trophy with glow effect */}
                                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-full shadow-2xl mb-6 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full animate-ping opacity-20"></div>
                                    <div className="text-6xl animate-bounce relative z-10">🏆</div>
                                    {/* Sparkle effects */}
                                    <div className="absolute -top-2 -right-2 text-yellow-400 text-2xl animate-pulse">✨</div>
                                    <div className="absolute -bottom-2 -left-2 text-yellow-300 text-xl animate-pulse delay-500">⭐</div>
                                </div>
                            </div>

                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent mb-6 leading-tight">
                                Mission
                                <br />
                                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                    Accomplished!
                                </span>
                            </h1>

                            <div className="max-w-2xl mx-auto mb-8">
                                <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                                    You've successfully conquered the <span className="text-emerald-400 font-semibold">DevQuest</span> challenge
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-24"></div>
                                    <span className="text-emerald-400 text-lg">⚡</span>
                                    <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-24"></div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Results Dashboard */}
                        <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 md:p-10 mb-12 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 0%, transparent 50%), 
                                                radial-gradient(circle at 75% 75%, #059669 0%, transparent 50%)`
                                }}></div>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 tracking-tight">
                                    Performance <span className="text-emerald-400">Analytics</span>
                                </h2>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                                    {/* Total Questions */}
                                    <div className="group text-center transform hover:scale-105 transition-all duration-300">
                                        <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-slate-600/50">
                                            <span className="text-3xl font-black text-white">{stats.total}</span>
                                        </div>
                                        <p className="text-slate-400 font-semibold text-lg">Total Questions</p>
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-slate-500 to-transparent mx-auto mt-2 opacity-50"></div>
                                    </div>

                                    {/* Answered */}
                                    <div className="group text-center transform hover:scale-105 transition-all duration-300">
                                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-600/30 to-emerald-800/30 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-emerald-500/30 relative">
                                            <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl animate-pulse"></div>
                                            <span className="text-3xl font-black text-emerald-400 relative z-10">{stats.answered}</span>
                                        </div>
                                        <p className="text-slate-400 font-semibold text-lg">Answered</p>
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-2"></div>
                                    </div>

                                    {/* Correct */}
                                    <div className="group text-center transform hover:scale-105 transition-all duration-300">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-600/30 to-green-800/30 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-green-500/30 relative">
                                            <div className="absolute inset-0 bg-green-500/10 rounded-3xl animate-pulse delay-200"></div>
                                            <span className="text-3xl font-black text-green-400 relative z-10">{stats.correct}</span>
                                        </div>
                                        <p className="text-slate-400 font-semibold text-lg">Correct</p>
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto mt-2"></div>
                                    </div>

                                    {/* Success Rate */}
                                    <div className="group text-center transform hover:scale-105 transition-all duration-300">
                                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-emerald-400/30 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 animate-pulse"></div>
                                            <span className="text-2xl font-black text-white relative z-10">{stats.percentage}%</span>
                                            {/* Celebration sparkles */}
                                            {stats.percentage >= 80 && (
                                                <>
                                                    <div className="absolute -top-1 -right-1 text-yellow-400 text-sm animate-ping">✨</div>
                                                    <div className="absolute -bottom-1 -left-1 text-yellow-300 text-xs animate-ping delay-300">⭐</div>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-slate-400 font-semibold text-lg">Success Rate</p>
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-2"></div>
                                    </div>
                                </div>

                                {/* Performance Badge Section */}
                                <div className="border-t border-slate-700/50 pt-8">
                                    <div className="mb-6">
                                        <div className={`inline-flex items-center px-8 py-4 rounded-2xl relative overflow-hidden transition-all duration-500 ${stats.percentage >= 80
                                                ? "bg-gradient-to-r from-emerald-600/20 via-green-600/20 to-teal-600/20 border border-emerald-400/40"
                                                : stats.percentage >= 60
                                                    ? "bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-400/40"
                                                    : "bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 border border-orange-400/40"
                                            }`}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                                            <span className={`font-bold text-xl relative z-10 ${stats.percentage >= 80 ? "text-emerald-400" :
                                                    stats.percentage >= 60 ? "text-blue-400" :
                                                        "text-orange-400"
                                                }`}>
                                                {stats.percentage >= 80 ? "Outstanding Performance!" :
                                                    stats.percentage >= 60 ? "Great Job!" :
                                                        "Good Effort! Keep Learning!"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Motivational Message */}
                                    <div className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                                        {stats.percentage >= 80 ?
                                            "Exceptional work! Your mastery of the concepts is truly impressive. You're ready for the next level!" :
                                            stats.percentage >= 60 ?
                                                "Well done! You've demonstrated solid understanding. Continue building on this foundation!" :
                                                "Every expert was once a beginner. Keep practicing and you'll see amazing progress!"
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
                                {/* Primary CTA Button */}
                                <button
                                    onClick={() => navigate("/leaderboard")}
                                    className="group relative px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 border border-emerald-400/20 overflow-hidden min-w-64"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        <span>View Leaderboard</span>
                                        <span className="text-2xl group-hover:animate-bounce">🏆</span>
                                    </div>
                                </button> 
                            </div>

                            {/* Progress Bar Visualization */}
                            <div className="mt-12 max-w-2xl mx-auto">
                                <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-600/30 backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-400 font-medium">Overall Progress</span>
                                        <span className="text-emerald-400 font-bold text-lg">{stats.percentage}%</span>
                                    </div>
                                    <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                            style={{ width: `${stats.percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/50 to-green-400/50 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom CSS for animations */}
                <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
                
                .animate-shimmer {
                    animation: shimmer 3s ease-in-out infinite;
                }
                
                .animate-ping {
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
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
                                {/* <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">DQ</span>
                                </div> */}
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
