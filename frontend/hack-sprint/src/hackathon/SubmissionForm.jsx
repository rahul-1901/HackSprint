import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Clock, Calendar, Users, Code, FileVideo, FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
// We are removing the direct CSS import as it's causing a build error in this environment.
// The ToastContainer component itself often provides a baseline of functionality.
// import "react-toastify/dist/ReactToastify.css";

// Reusable Input Component
function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    />
  );
}

// Reusable Button Component
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

// Stat Card for Hackathon Info
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-gray-800 rounded-xl border border-green-500/30">
    <Icon className="w-5 h-5 text-green-500 mb-2" />
    <div className="text-sm text-gray-400">{label}</div>
    <div className="font-semibold text-white">{value}</div>
  </div>
);

// File Upload Component with Preview
function FileUpload({
  label,
  icon: Icon,
  accept,
  file,
  onFileChange,
  onRemove,
  preview,
}) {
  return (
    <div className="space-y-1">
      <label className="block text-gray-300">{label}</label>
      <div className="relative">
        <label className="flex items-center justify-center w-full h-32 p-4 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept={accept}
            onChange={onFileChange}
            className="hidden"
          />
          {file ? (
            <div className="flex flex-col items-center space-y-2">
              {preview}
              <span className="text-gray-300 truncate w-40 text-center">{file.name}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <Icon className="w-8 h-8 mb-2" />
              <span className="text-sm text-center">
                Click to upload or drag and drop
              </span>
            </div>
          )}
        </label>
        {file && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-700 hover:bg-red-500 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

const SubmissionForm = ({ isOpen, onClose }) => {
  const { id: hackathonId } = useParams();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [hackathon, setHackathon] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);


  useEffect(() => {
    if (!hackathonId || !isOpen) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}`)
      .then((res) => res.json())
      .then((data) => setHackathon(data))
      .catch((err) => console.error("Error fetching hackathon:", err));
  }, [hackathonId, isOpen]);

  // Clean up object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
    setVideoFile(null);
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("repoUrl", repoUrl);
      formData.append("hackathonId", hackathonId);
      if (videoFile) formData.append("video", videoFile);
      if (pdfFile) formData.append("pdf", pdfFile);

      // Corrected fetch call with FormData
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/submit/submitHackathonSolution`,
        {
          method: "POST",
          body: formData, // No 'Content-Type' header needed for FormData
        }
      );

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Submission successful!", {
        position: "top-right",
        theme: "dark",
      });
      setRepoUrl("");
      setVideoFile(null);
      setPdfFile(null);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Try again.", {
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
      className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 pt-20"
    >
      <ToastContainer />
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-green-500/50 text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-2xl font-bold">{hackathon.title}</h2>
            <p className="text-gray-400">{hackathon.subTitle}</p>
          </div>
          <button
            onClick={onCloseClick}
            className="text-gray-400 hover:text-white"
          >
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

          {/* Video File Upload Section */}
          <FileUpload
            label="Upload Demo Video"
            icon={FileVideo}
            accept="video/*"
            file={videoFile}
            onFileChange={handleVideoFileChange}
            onRemove={handleRemoveVideo}
            preview={
              videoFile && (
                <video
                  src={videoPreviewUrl}
                  controls
                  className="rounded-lg w-full max-h-24 object-contain"
                />
              )
            }
          />

          {/* PDF File Upload Section */}
          <FileUpload
            label="Upload Documentation (PDF)"
            icon={FileText}
            accept="application/pdf"
            file={pdfFile}
            onFileChange={handlePdfFileChange}
            onRemove={handleRemovePdf}
            preview={
              pdfFile && (
                <FileText className="w-12 h-12 text-blue-500" />
              )
            }
          />
          
          <Button
            type="submit"
            disabled={loading}
            className="cursor-pointer group w-full bg-green-500 text-gray-900 font-bold shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all duration-300 hover:shadow-green-400/40 transform hover:scale-105 px-6 py-2.5 text-base"
          >
            {loading ? "Submitting..." : "Submit Project"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SubmissionForm;
