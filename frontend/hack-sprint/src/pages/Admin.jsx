import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Code, Trophy, Calendar, DollarSign, Users, BookOpen, Settings, CheckCircle, AlertCircle, Info, Star, FileText, Target, Award } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('devquest');
    const [devQuestForm, setDevQuestForm] = useState({
        points: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
    });
    const [hackathonForm, setHackathonForm] = useState({
        title: '',
        subTitle: '',
        description: '',
        startDate: '',
        endDate: '',
        refMaterial: '',
        // status: false,
        difficulty: 'Intermediate',
        category: [],
        prizeMoney: '',
        techStackUsed: [],
        overview: '',
        themes: [],
        FAQs: [],
        teams: [],
        aboutUs: '',
        projectSubmission: [],
        TandCforHackathon: [],
        evaluationCriteria: [],
        registeredParticipants: [],
        image: null, // Add image field for file
        imagePreview: '' // Add imagePreview for displaying the image
    });
    const [customCategory, setCustomCategory] = useState('');
    const [customTechStack, setCustomTechStack] = useState('');
    const [customTheme, setCustomTheme] = useState('');
    const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
    const [newEvalCriteria, setNewEvalCriteria] = useState('');
    const [newTheme, setnewTheme] = useState('');
    const [newTandC, setNewTandC] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const difficultyOptions = ['Expert', 'Advanced', 'Intermediate', 'Beginner'];
    const categoryOptions = ['Web Dev', 'AI/ML', 'Blockchain', 'IoT', 'Other'];
    const techStackOptions = [
        'React', 'Node.js', 'MongoDB', 'Socket.io', 'Python',
        'TensorFlow', 'OpenAI', 'FastAPI', 'Solidity', 'Web3.js',
        'IPFS', 'Arduino', 'PostgreSQL', 'Other'
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB.');
            return;
        }
        if (file) {
            // Validate file type
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, PNG, or GIF).');
                return;
            }
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setHackathonForm({
                ...hackathonForm,
                image: file,
                imagePreview: previewUrl
            });
        }
    };

    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (hackathonForm.imagePreview) {
                URL.revokeObjectURL(hackathonForm.imagePreview);
            }
        };
    }, [hackathonForm.imagePreview]);

    const handleDevQuestSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        // await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('DevQuest Form Data:', devQuestForm);
        alert('DevQuest question added successfully!');

        // Reset form
        setDevQuestForm({
            points: '',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: ''
        });
        setIsSubmitting(false);
    };

    const handleHackathonSubmit = async (e) => {
        e.preventDefault();
        if (hackathonForm.category.length === 0) {
            alert("Please select at least one category.");
            return;
        }
        if (hackathonForm.techStackUsed.length === 0) {
            alert("Please select at least one tech.");
            return;
        }
        setIsSubmitting(true);

        try {
            // Simulate API call
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/hackathons`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Hackathon Form Data:', Object.fromEntries(formData));
            alert(response.data.message); // Display backend success message

            // Create FormData for API submission (if needed)
            const formData = new FormData();
            formData.append('title', hackathonForm.title);
            formData.append('subTitle', hackathonForm.subTitle);
            formData.append('description', hackathonForm.description);
            formData.append('startDate', hackathonForm.startDate);
            formData.append('endDate', hackathonForm.endDate);
            formData.append('refMaterial', hackathonForm.refMaterial);
            formData.append('difficulty', hackathonForm.difficulty);
            formData.append('category', JSON.stringify(hackathonForm.category));
            formData.append('prizeMoney', hackathonForm.prizeMoney);
            formData.append('techStackUsed', JSON.stringify(hackathonForm.techStackUsed));
            formData.append('overview', hackathonForm.overview);
            formData.append('themes', JSON.stringify(hackathonForm.themes));
            formData.append('FAQs', JSON.stringify(hackathonForm.FAQs));
            formData.append('teams', JSON.stringify(hackathonForm.teams));
            formData.append('aboutUs', hackathonForm.aboutUs);
            formData.append('projectSubmission', JSON.stringify(hackathonForm.projectSubmission));
            formData.append('TandCforHackathon', JSON.stringify(hackathonForm.TandCforHackathon));
            formData.append('evaluationCriteria', JSON.stringify(hackathonForm.evaluationCriteria));
            formData.append('registeredParticipants', JSON.stringify(hackathonForm.registeredParticipants));
            if (hackathonForm.image) {
                formData.append('image', hackathonForm.image);
            }

            console.log('Hackathon Form Data:', Object.fromEntries(formData)); // Log for debugging
            alert('Hackathon created successfully!');
        } catch (error) {
            console.error('Error submitting hackathon:', error);
            alert('Failed to create hackathon: ' + (error.response?.data?.error || 'Unknown error'));
        }

        console.log('Hackathon Form Data:', hackathonForm);
        alert('Hackathon created successfully!');

        // Reset form
        setHackathonForm({
            title: '',
            subTitle: '',
            description: '',
            startDate: '',
            endDate: '',
            refMaterial: '',
            // status: false,
            difficulty: 'Intermediate',
            category: [],
            prizeMoney: '',
            techStackUsed: [],
            overview: '',
            themes: [],
            FAQs: [],
            teams: [],
            aboutUs: '',
            projectSubmission: [],
            TandCforHackathon: [],
            evaluationCriteria: [],
            registeredParticipants: [],
            image: null,
            imagePreview: ''
        });
        setCustomCategory('');
        setCustomTechStack('');
        setCustomTheme('');
        setNewFAQ({ question: '', answer: '' });
        setNewEvalCriteria('');
        setnewTheme('');
        setNewTandC('');
        setIsSubmitting(false);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...devQuestForm.options];
        newOptions[index] = value;
        setDevQuestForm({ ...devQuestForm, options: newOptions });
    };

    const toggleArrayField = (field, value) => {
        const currentArray = hackathonForm[field];

        if (value === 'Other') {
            if (currentArray.includes('Other')) {
                const newArray = currentArray.filter(item => item !== 'Other' && !item.startsWith('Custom: '));
                setHackathonForm({ ...hackathonForm, [field]: newArray });
                if (field === 'category') setCustomCategory('');
                if (field === 'techStackUsed') setCustomTechStack('');
                // if (field === 'themes') setCustomTheme('');
            } else {
                const newArray = [...currentArray, 'Other'];
                setHackathonForm({ ...hackathonForm, [field]: newArray });
            }
        } else {
            const newArray = currentArray.includes(value)
                ? currentArray.filter(item => item !== value)
                : [...currentArray, value];
            setHackathonForm({ ...hackathonForm, [field]: newArray });
        }
    };

    const handleCustomInput = (field, value, customValue) => {
        if (customValue.trim()) {
            const currentArray = hackathonForm[field];
            const filteredArray = currentArray.filter(item => !item.startsWith('Custom: '));
            const newArray = [...filteredArray, `Custom: ${customValue.trim()}`];
            setHackathonForm({ ...hackathonForm, [field]: newArray });
        }
    };

    const addFAQ = () => {
        if (newFAQ.question.trim() && newFAQ.answer.trim()) {
            setHackathonForm({
                ...hackathonForm,
                FAQs: [...hackathonForm.FAQs, { ...newFAQ }]
            });
            setNewFAQ({ question: '', answer: '' });
        }
    };

    const removeFAQ = (index) => {
        const newFAQs = hackathonForm.FAQs.filter((_, i) => i !== index);
        setHackathonForm({ ...hackathonForm, FAQs: newFAQs });
    };

    const addEvalCriteria = () => {
        if (newEvalCriteria.trim()) {
            setHackathonForm({
                ...hackathonForm,
                evaluationCriteria: [...hackathonForm.evaluationCriteria, newEvalCriteria.trim()]
            });
            setNewEvalCriteria('');
        }
    };

    const removeEvalCriteria = (index) => {
        const newCriteria = hackathonForm.evaluationCriteria.filter((_, i) => i !== index);
        setHackathonForm({ ...hackathonForm, evaluationCriteria: newCriteria });
    };

    const addTheme = () => {
        if (newTheme.trim()) {
            setHackathonForm({
                ...hackathonForm,
                themes: [...hackathonForm.themes, newTheme.trim()]
            });
            setnewTheme('');
        }
    };

    const removeTheme = (index) => {
        const theme = hackathonForm.themes.filter((_, i) => i !== index);
        setHackathonForm({ ...hackathonForm, themes: theme });
    };

    const addTandC = () => {
        if (newTandC.trim()) {
            setHackathonForm({
                ...hackathonForm,
                TandCforHackathon: [...hackathonForm.TandCforHackathon, newTandC.trim()]
            });
            setNewTandC('');
        }
    };

    const removeTandC = (index) => {
        const newTandC = hackathonForm.TandCforHackathon.filter((_, i) => i !== index);
        setHackathonForm({ ...hackathonForm, TandCforHackathon: newTandC });
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Advanced': return 'text-red-400';
            case 'Expert': return 'text-red-800';
            case 'Intermediate': return 'text-yellow-400 ';
            case 'Beginner': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    const getSelectedCount = (array) => {
        return array.length > 0 ? `(${array.length} selected)` : '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            {/* Animated background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-orange-500/5"></div>

            {/* Header */}
            <div className="relative bg-gray-900/90 backdrop-blur-xl border-b border-gray-800/50 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-auto sm:h-20 py-4 sm:py-0 space-y-4 sm:space-y-0">

                        {/* Left Section */}
                        <div className="flex items-center space-x-4">
                            <div className="relative p-2 sm:p-3 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg">
                                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Admin Dashboard
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                    Manage your platform content
                                </p>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-3 px-3 py-2 sm:px-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs sm:text-sm text-gray-300">
                                Welcome back, Admin
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Navigation Tabs */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex space-x-2 bg-gray-900/60 p-2 rounded-xl backdrop-blur-sm border border-gray-800/50 shadow-lg">
                    <button
                        onClick={() => setActiveTab('devquest')}
                        className={`relative flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-lg transition-all duration-300 font-medium overflow-hidden group ${activeTab === 'devquest'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/70'
                            }`}
                    >
                        {activeTab === 'devquest' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 animate-pulse"></div>
                        )}
                        <Code className="h-5 w-5 relative z-10" />
                        <span className="relative z-10">DevQuest Questions</span>
                        {activeTab === 'devquest' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('hackathon')}
                        className={`relative flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-lg transition-all duration-300 font-medium overflow-hidden group ${activeTab === 'hackathon'
                            ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/25'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/70'
                            }`}
                    >
                        {activeTab === 'hackathon' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-orange-700/20 animate-pulse"></div>
                        )}
                        <Trophy className="h-5 w-5 relative z-10" />
                        <span className="relative z-10">Hackathons</span>
                        {activeTab === 'hackathon' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'devquest' && (
                    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600/10 to-blue-700/10 border-b border-gray-800/50 p-8">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                                    <Code className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white hover pointer">Add DevQuest Question</h2>
                                    <p className="text-blue-300/80 mt-1">Create engaging coding challenges for developers</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleDevQuestSubmit} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span>Question Points</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={devQuestForm.points}
                                        onChange={(e) => setDevQuestForm({ ...devQuestForm, points: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:border-gray-600"
                                        placeholder="Enter points for this question"
                                        min="1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                        <span>Correct Answer</span>
                                    </label>
                                    <select
                                        value={devQuestForm.correctAnswer}
                                        onChange={(e) => setDevQuestForm({ ...devQuestForm, correctAnswer: parseInt(e.target.value) })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 hover:border-gray-600"
                                    >
                                        <option value={0}>Option 1</option>
                                        <option value={1}>Option 2</option>
                                        <option value={2}>Option 3</option>
                                        <option value={3}>Option 4</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <BookOpen className="h-4 w-4 text-blue-400" />
                                    <span>Question</span>
                                </label>
                                <textarea
                                    required
                                    value={devQuestForm.question}
                                    onChange={(e) => setDevQuestForm({ ...devQuestForm, question: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 resize-none hover:border-gray-600"
                                    placeholder="Enter your question here..."
                                />
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                    <span>Answer Options</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {devQuestForm.options.map((option, index) => (
                                        <div key={index} className="space-y-2">
                                            <label className={`flex items-center space-x-2 text-sm font-semibold ${devQuestForm.correctAnswer === index ? 'text-green-400' : 'text-gray-300'
                                                }`}>
                                                {devQuestForm.correctAnswer === index && <CheckCircle className="h-4 w-4" />}
                                                <span>Option {index + 1} {devQuestForm.correctAnswer === index && '(Correct)'}</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                className={`w-full px-4 py-4 bg-gray-800/80 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-gray-600 ${devQuestForm.correctAnswer === index
                                                    ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/30'
                                                    : 'border-gray-700/50 focus:border-blue-500 focus:ring-blue-500/30'
                                                    }`}
                                                placeholder={`Enter option ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                                    <span>Explanation (Optional)</span>
                                </label>
                                <textarea
                                    value={devQuestForm.explanation}
                                    onChange={(e) => setDevQuestForm({ ...devQuestForm, explanation: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 resize-none hover:border-gray-600"
                                    placeholder="Provide an explanation for the correct answer..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-6 py-5 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center space-x-3 shadow-lg ${isSubmitting
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.98] hover:shadow-blue-500/25'
                                    } text-white`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Adding Question...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5" />
                                        <span>Add DevQuest Question</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'hackathon' && (
                    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-orange-600/10 to-orange-700/10 border-b border-gray-800/50 p-8">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl shadow-lg">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Create Hackathon</h2>
                                    <p className="text-orange-300/80 mt-1">Design exciting coding competitions for the community</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleHackathonSubmit} className="p-8 space-y-8">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <Trophy className="h-4 w-4 text-orange-400" />
                                        <span>Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={hackathonForm.title}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, title: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 hover:border-gray-600"
                                        placeholder="Enter hackathon title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <span>Subtitle</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={hackathonForm.subTitle}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, subTitle: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 hover:border-gray-600"
                                        placeholder="Enter subtitle"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <BookOpen className="h-4 w-4 text-orange-400" />
                                    <span>Description</span>
                                </label>
                                <textarea
                                    required
                                    value={hackathonForm.description}
                                    onChange={(e) => setHackathonForm({ ...hackathonForm, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 resize-none hover:border-gray-600"
                                    placeholder="Describe the hackathon..."
                                />
                            </div>

                            {/* Overview */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <Info className="h-4 w-4 text-blue-400" />
                                    <span>Overview</span>
                                </label>
                                <textarea
                                    value={hackathonForm.overview}
                                    onChange={(e) => setHackathonForm({ ...hackathonForm, overview: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 resize-none hover:border-gray-600"
                                    placeholder="Provide an overview of the hackathon..."
                                />
                            </div>

                            {/* About Us */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <Users className="h-4 w-4 text-purple-400" />
                                    <span>About Us</span>
                                </label>
                                <textarea
                                    value={hackathonForm.aboutUs}
                                    onChange={(e) => setHackathonForm({ ...hackathonForm, aboutUs: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 resize-none hover:border-gray-600"
                                    placeholder="Tell participants about your organization..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <FileText className="h-4 w-4 text-orange-400" />
                                    <span>Upload Hackathon Image (Optional)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handleImageUpload}
                                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 hover:border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                                />
                                {hackathonForm.imagePreview && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-300 mb-2">Image Preview:</p>
                                        <img
                                            src={hackathonForm.imagePreview}
                                            alt="Hackathon Preview"
                                            className="max-w-xs rounded-lg border border-gray-700/50 shadow-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setHackathonForm({ ...hackathonForm, image: null, imagePreview: '' })}
                                            className="mt-2 text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Date, Difficulty, Prize, Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <Calendar className="h-4 w-4 text-green-400" />
                                        <span>Start Date</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={hackathonForm.startDate}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, startDate: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 hover:border-gray-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <Calendar className="h-4 w-4 text-red-400" />
                                        <span>End Date</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={hackathonForm.endDate}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, endDate: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 hover:border-gray-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <DollarSign className="h-4 w-4 text-yellow-400" />
                                        <span>Prize Money</span>
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        value={hackathonForm.prizeMoney}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, prizeMoney: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 hover:border-gray-600"
                                        placeholder="Enter prize amount"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <AlertCircle className="h-4 w-4 text-purple-400" />
                                        <span>Difficulty Level</span>
                                    </label>
                                    <select
                                        value={hackathonForm.difficulty}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, difficulty: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 hover:border-gray-600"
                                    >
                                        {difficultyOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    <p className={`text-sm font-medium ${getDifficultyColor(hackathonForm.difficulty)}`}>
                                        Current: {hackathonForm.difficulty}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                        <BookOpen className="h-4 w-4 text-blue-400" />
                                        <span>Reference Material URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={hackathonForm.refMaterial}
                                        onChange={(e) => setHackathonForm({ ...hackathonForm, refMaterial: e.target.value })}
                                        className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 hover:border-gray-600"
                                        placeholder="https://example.com/resources"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <Users className="h-4 w-4 text-blue-400" />
                                    <span>Categories {getSelectedCount(hackathonForm.category)}</span>
                                </label>
                                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {categoryOptions.map(category => (
                                            <label key={category} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-700/30 transition-all duration-200">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={hackathonForm.category.includes(category)}
                                                        onChange={() => toggleArrayField('category', category)}
                                                        className="w-5 h-5 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                                                    />
                                                    {hackathonForm.category.includes(category) && (
                                                        <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-400" />
                                                    )}
                                                </div>
                                                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-200 font-medium">
                                                    {category}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {hackathonForm.category.includes('Other') && (
                                        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600/50">
                                            <input
                                                type="text"
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                onBlur={() => handleCustomInput('category', 'Other', customCategory)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleCustomInput('category', 'Other', customCategory)}
                                                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200"
                                                placeholder="Enter custom category..."
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <Code className="h-4 w-4 text-green-400" />
                                    <span>Tech Stack {getSelectedCount(hackathonForm.techStackUsed)}</span>
                                </label>
                                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {techStackOptions.map(tech => (
                                            <label key={tech} className="flex items-center space-x-2 cursor-pointer group p-2 rounded-lg hover:bg-gray-700/30 transition-all duration-200">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={hackathonForm.techStackUsed.includes(tech)}
                                                        onChange={() => toggleArrayField('techStackUsed', tech)}
                                                        className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                                                    />
                                                    {hackathonForm.techStackUsed.includes(tech) && (
                                                        <CheckCircle className="absolute -top-1 -right-1 w-2.5 h-2.5 text-green-400" />
                                                    )}
                                                </div>
                                                <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-200 font-medium">
                                                    {tech}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    {hackathonForm.techStackUsed.includes('Other') && (
                                        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600/50">
                                            <input
                                                type="text"
                                                value={customTechStack}
                                                onChange={(e) => setCustomTechStack(e.target.value)}
                                                onBlur={() => handleCustomInput('techStackUsed', 'Other', customTechStack)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleCustomInput('techStackUsed', 'Other', customTechStack)}
                                                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200"
                                                placeholder="Enter custom tech stack..."
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Themes Section */}
                            <div className="space-y-4">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <Target className="h-4 w-4 text-blue-400" />
                                    <span>Themes {getSelectedCount(hackathonForm.themes)}</span>
                                </label>
                                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 space-y-4">
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newTheme}
                                            onChange={(e) => setnewTheme(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200"
                                            placeholder="Enter evaluation criteria"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTheme}
                                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>Add</span>
                                        </button>
                                    </div>

                                    {hackathonForm.themes.length > 0 && (
                                        <div className="space-y-2 mt-4">
                                            {hackathonForm.themes.map((theme, index) => (
                                                <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50 flex justify-between items-center">
                                                    <span className="text-gray-300 text-sm">{theme}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTheme(index)}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FAQs Section */}
                            <div className="space-y-4">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                                    <span>FAQs ({hackathonForm.FAQs.length})</span>
                                </label>
                                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={newFAQ.question}
                                            onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200"
                                            placeholder="FAQ Question"
                                        />
                                        <input
                                            type="text"
                                            value={newFAQ.answer}
                                            onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200"
                                            placeholder="FAQ Answer"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addFAQ}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add FAQ</span>
                                    </button>

                                    {hackathonForm.FAQs.length > 0 && (
                                        <div className="space-y-3 mt-4">
                                            {hackathonForm.FAQs.map((faq, index) => (
                                                <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-600/50 flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium text-sm">{faq.question}</p>
                                                        <p className="text-gray-300 text-xs mt-1">{faq.answer}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFAQ(index)}
                                                        className="ml-3 text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Evaluation Criteria Section */}
                            <div className="space-y-4">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <Award className="h-4 w-4 text-blue-400" />
                                    <span>Evaluation Criteria ({hackathonForm.evaluationCriteria.length})</span>
                                </label>
                                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 space-y-4">
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newEvalCriteria}
                                            onChange={(e) => setNewEvalCriteria(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200"
                                            placeholder="Enter evaluation criteria"
                                        />
                                        <button
                                            type="button"
                                            onClick={addEvalCriteria}
                                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>Add</span>
                                        </button>
                                    </div>

                                    {hackathonForm.evaluationCriteria.length > 0 && (
                                        <div className="space-y-2 mt-4">
                                            {hackathonForm.evaluationCriteria.map((criteria, index) => (
                                                <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50 flex justify-between items-center">
                                                    <span className="text-gray-300 text-sm">{criteria}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEvalCriteria(index)}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Conditions Section */}
                            <div className="space-y-4">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                                    <FileText className="h-4 w-4 text-red-400" />
                                    <span>Terms and Conditions ({hackathonForm.TandCforHackathon.length})</span>
                                </label>
                                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 space-y-4">
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newTandC}
                                            onChange={(e) => setNewTandC(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-200"
                                            placeholder="Enter terms and conditions"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTandC}
                                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>Add</span>
                                        </button>
                                    </div>

                                    {hackathonForm.TandCforHackathon.length > 0 && (
                                        <div className="space-y-2 mt-4">
                                            {hackathonForm.TandCforHackathon.map((term, index) => (
                                                <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-600/50 flex justify-between items-center">
                                                    <span className="text-gray-300 text-sm">{term}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTandC(index)}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-6 py-5 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center space-x-3 shadow-lg ${isSubmitting
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 hover:scale-[1.02] active:scale-[0.98] hover:shadow-orange-500/25'
                                    } text-white`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Creating Hackathon...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5" />
                                        <span>Create Hackathon</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        Admin Dashboard v2.0 - Built with ❤️ for developers
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Admin;