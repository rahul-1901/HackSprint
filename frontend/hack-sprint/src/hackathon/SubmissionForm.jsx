import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Clock, Calendar, Users, Code } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    />
  );
}

function Button({ children, variant = "default", className = "", ...props }) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none";
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    outline:
      "border border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white",
    ghost: "text-gray-400 hover:bg-gray-800 hover:text-white",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

const SubmissionForm = ({ isOpen, onClose }) => {
  const { id: hackathonId } = useParams();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [hackathon, setHackathon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hackathonId || !isOpen) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}`)
      .then((res) => res.json())
      .then((data) => setHackathon(data))
      .catch((err) => console.error("Error fetching hackathon:", err));
  }, [hackathonId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/submit/submitHackathonSolution`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl, hackathonId }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("✅ Submission successful!", {
        position: "top-right",
        theme: "dark",
      });
      setRepoUrl("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Submission failed. Try again.", {
        position: "top-right",
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const onCloseClick = () => {
  onClose?.(); // closes the modal
};

  if (!isOpen || !hackathon) return null;

  const durationDays = Math.ceil(
    (new Date(hackathon.endDate) - new Date(hackathon.startDate)) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-green-500/50 text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{hackathon.title}</h2>
            <p className="text-gray-400">{hackathon.subTitle}</p>
          </div>
          <button onClick={onCloseClick} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Hackathon Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Code}
            label="Prize Pool"
            value={`$${hackathon.prizeMoney || 0}`}
          />
          <StatCard
            icon={Clock}
            label="Duration"
            value={`${durationDays} Days`}
          />
          <StatCard
            icon={Users}
            label="Participants"
            value={hackathon.submissions?.length || 0}
          />
          <StatCard
            icon={Calendar}
            label="Difficulty"
            value={hackathon.difficulty}
          />
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-6">{hackathon.description}</p>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            className="border-green-500/30"
            placeholder="Enter your GitHub repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
          <Button type="submit" 
          disabled={loading} className="cursor-pointer group w-full bg-green-500 text-gray-900 font-bold shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all duration-300 hover:shadow-green-400/40 transform hover:scale-105 px-6 py-2.5 text-base">
            {loading ? "Submitting..." : "Submit Project"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-gray-800 rounded-xl border border-green-500/30">
    <Icon className="w-5 h-5 text-green-500 mb-2" />
    <div className="text-sm text-gray-400">{label}</div>
    <div className="font-semibold text-white">{value}</div>
  </div>
);

export default SubmissionForm;