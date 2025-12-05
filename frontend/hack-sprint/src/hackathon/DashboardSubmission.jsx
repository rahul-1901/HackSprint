import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, Code, Clock, Users, Calendar } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getDashboard } from "../backendApis/api";
import "./Hackathon.css";

// Input component
function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
            {...props}
        />
    );
}

// Button component
function Button({ children, variant = "default", className = "", ...props }) {
    const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
        outline: "border border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white",
        ghost: "text-gray-400 hover:bg-gray-800 hover:text-white",
    };
    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}

// StatCard component
const StatCard = ({ icon: Icon, label, value }) => (
    <div className="p-4 bg-gray-800 rounded-xl border border-green-500/30">
        <Icon className="w-5 h-5 text-green-500 mb-2" />
        <div className="text-sm text-gray-400">{label}</div>
        <div className="font-semibold text-white">{value}</div>
    </div>
);

// SubmissionForm component (text-only submission)
const SubmissionForms = ({ isOpen, onClose, hackathonId }) => {
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [hackathon, setHackathon] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLeader, setIsLeader] = useState(false);
    const [isTeamMember, setIsTeamMember] = useState(false);
    const [teamId, setTeamId] = useState(null);

    const navigate = useNavigate();

    // Fetch hackathon details
    useEffect(() => {
        if (!hackathonId || !isOpen) return;
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}`)
            .then((res) => res.json())
            .then((data) => setHackathon(data))
            .catch((err) => console.error("Error fetching hackathon:", err));
    }, [hackathonId, isOpen]);

    // Fetch user and team info
    useEffect(() => {
        if (!isOpen) return;

        const fetchUserData = async () => {
            try {
                const res = await getDashboard();
                const fetchedUserData = res.data.userData;
                setUserData(fetchedUserData);

                const leader = fetchedUserData.leaderOfHackathons?.some(
                    (id) => String(id) === String(hackathonId)
                );
                setIsLeader(leader || false);

                if (fetchedUserData.team) {
                    setTeamId(fetchedUserData.team);
                    const teamRes = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/api/team/${fetchedUserData.team}`
                    );
                    const teamData = await teamRes.json();
                    const team = teamData.team;

                    if (team?.hackathon?._id && String(team.hackathon._id) === String(hackathonId)) {
                        const member = team.members?.some((m) => String(m._id) === String(fetchedUserData._id));
                        setIsTeamMember(member || false);
                    } else {
                        setIsTeamMember(false);
                    }
                } else {
                    setIsTeamMember(false);
                }
            } catch (err) {
                console.error("Error fetching user/team:", err);
                setUserData(null);
                setIsLeader(false);
                setIsTeamMember(false);
            }
        };

        fetchUserData();
    }, [hackathonId, isOpen]);

    // Fetch submission status
    useEffect(() => {
        if (!hackathonId || !userData) return;

        const fetchSubmissionStatus = async () => {
            try {
                const params = new URLSearchParams({
                    hackathonId,
                    teamId: userData.team || "",
                    userId: userData._id,
                });

                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/submit/status?${params.toString()}`
                );
                const data = await res.json();
                setSubmissionStatus(data);
            } catch (err) {
                console.error("Error fetching submission status:", err);
            }
        };

        fetchSubmissionStatus();
    }, [hackathonId, userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const canSubmit = isLeader || !isTeamMember;
        if (!canSubmit) {
            toast.error("Only team leaders can submit!", { position: "top-right", theme: "dark" });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("repoUrl", repoUrl);
            formData.append("hackathonId", hackathonId);
            formData.append("userId", userData._id);
            if (teamId) formData.append("teamId", teamId);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submit`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Submission failed");

            toast.success("Submission successful!", { position: "top-right" });
            setRepoUrl("");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Submission failed. Try again.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !hackathon || !userData) return null;

    const durationDays = Math.ceil(
        (new Date(hackathon.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
            <ToastContainer />
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] p-6 shadow-xl border border-green-500/50 text-white overflow-y-auto scrollbar-hide"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-2xl font-bold">{hackathon.title}</h2>
                        <p className="text-gray-400">{hackathon.subTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        icon={Code}
                        label="Prize Pool"
                        value={`₹${(
                            (hackathon.prizeMoney1 || 0) +
                            (hackathon.prizeMoney2 || 0) +
                            (hackathon.prizeMoney3 || 0)
                        ).toLocaleString("en-IN")}`}
                    />
                    <StatCard icon={Clock} label="Duration" value={`${durationDays} Days`} />
                    <StatCard icon={Users} label="Participants" value={hackathon.numParticipants || 0} />
                    <StatCard icon={Calendar} label="Difficulty" value={hackathon.difficulty} />
                </div>

                <p className="text-gray-300 mb-6">{hackathon.description}</p>

                {submissionStatus?.submitted ? (
                    <div className="p-4 bg-gray-800 rounded-lg border border-green-500/50 space-y-2">
                        <p className="text-green-400 font-semibold">Already Submitted!</p>

                        {/* Repo */}
                        {submissionStatus.submission.repoUrl && (
                            <p>
                                Repo:{" "}
                                <a
                                    href={submissionStatus.submission.repoUrl}
                                    className="text-blue-500 underline"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {submissionStatus.submission.repoUrl}
                                </a>
                            </p>
                        )}

                        {/* Docs */}
                        {submissionStatus.submission.docs?.length > 0 && (
                            <div>
                                <p className="font-medium text-gray-300">Submitted Documents:</p>
                                <ul className="list-disc list-inside text-gray-400 space-y-1">
                                    {submissionStatus.submission.docs.map((doc) => (
                                        <li key={doc._id}>
                                            <a
                                                href={doc.url}
                                                className="text-blue-400 underline"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {doc.original_filename || "Document"}
                                            </a>
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({(doc.size / 1024).toFixed(1)} KB)
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Videos */}
                        {submissionStatus.submission.videos?.length > 0 && (
                            <div>
                                <p className="font-medium text-gray-300">Submitted Videos:</p>
                                <ul className="list-disc list-inside text-gray-400 space-y-1">
                                    {submissionStatus.submission.videos.map((vid) => (
                                        <li key={vid._id}>
                                            <a
                                                href={vid.url}
                                                className="text-blue-400 underline"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {vid.original_filename || "Video"}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Enter your submission URL or text"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            disabled={loading || (!isLeader && isTeamMember)}
                            className="w-full bg-green-500 text-gray-900 font-bold shadow-lg hover:bg-green-400 transition-all duration-300"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                )}
            </motion.div>
        </motion.div>,
        document.body
    );
};

export default SubmissionForms;
