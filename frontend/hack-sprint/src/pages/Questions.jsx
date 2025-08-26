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

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dailyquiz/today`);

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
            setIsLoading(false);

            loadProgress();

            const savedQuizStarted = localStorage.getItem(STORAGE_KEYS.QUIZ_STARTED);
            if (savedQuizStarted === null && !checkQuizExpiry()) {
                setQuizStarted(true);
                setTimeLeft(10);
                localStorage.setItem(STORAGE_KEYS.QUIZ_START_TIME, Date.now().toString());
            }
        } catch (err) {
            console.error("Error fetching questions:", err);
            setIsLoading(false);
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
            <div className="min-h-screen bg-gradient-to-br py-4 from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
                    <div className="text-center max-w-4xl">
                        {/* Success Badge */}
                        <div className="mb-8">
                            <div className="inline-flex mt-5 items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-2xl mb-2 animate-bounce">
                                <div className="text-4xl">🏆</div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent mb-4">
                                Assessment Complete!
                            </h1>

                            <p className="text-xl text-slate-300">Excellent work on completing the DevQuest challenge</p>
                        </div>

                        {/* Results Dashboard */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-5 mb-8 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-white mb-8">Performance Summary</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl font-bold text-white">{stats.total}</span>
                                    </div>
                                    <p className="text-slate-400 font-medium">Total Questions</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl font-bold text-emerald-400">{stats.answered}</span>
                                    </div>
                                    <p className="text-slate-400 font-medium">Answered</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl font-bold text-green-400">{stats.correct}</span>
                                    </div>
                                    <p className="text-slate-400 font-medium">Correct</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                        <span className="text-2xl font-bold text-white">{stats.percentage}%</span>
                                    </div>
                                    <p className="text-slate-400 font-medium">Success Rate</p>
                                </div>
                            </div>

                            {/* Performance Badge */}
                            <div className="mt-8 pt-8 border-t border-slate-700/50">
                                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-full">
                                    <span className="text-emerald-400 font-semibold">
                                        {stats.percentage >= 80 ? "Outstanding Performance!" :
                                            stats.percentage >= 60 ? "Great Job!" :
                                                "Good Effort! Keep Learning!"}
                                    </span>
                                </div>
                            </div>

                            {/* Navigate Button */}
                            <div className="mt-5">
                                <button
                                    onClick={() => navigate("/leaderboard")}
                                    className="px-6 py-3 cursor-pointer bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-lg rounded-4xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Go to LeaderBoard
                                </button>
                            </div>
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
