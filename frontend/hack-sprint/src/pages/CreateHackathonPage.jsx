import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  UploadCloud,
  ArrowLeft,
  Plus,
  X,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { getAdminDetails, createHackathon } from "../backendApis/api";

/* ================= BACKGROUND ================= */
const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);

/* ================= IMAGE DROP ZONE ================= */
const ImageDropZone = ({
  preview,
  onFileSelect,
  onClear,
  label = "Upload Image",
  accept = "image/*",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div>
      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-green-400 bg-green-400/10"
              : "border-gray-600 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/60"
          }`}
        >
          <UploadCloud
            className={`w-8 h-8 transition-colors ${
              isDragging ? "text-green-400" : "text-gray-500"
            }`}
          />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-300">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              JPEG, PNG, WEBP · Max 5MB
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={(e) =>
              e.target.files[0] && onFileSelect(e.target.files[0])
            }
          />
        </div>
      ) : (
        <div className="relative group w-full h-40 rounded-xl overflow-hidden border border-gray-700">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs rounded-lg transition-all"
            >
              <ImagePlus className="w-3.5 h-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-xs rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={(e) =>
              e.target.files[0] && onFileSelect(e.target.files[0])
            }
          />
        </div>
      )}
    </div>
  );
};

/* ================= DYNAMIC LIST INPUT ================= */
const DynamicListInput = ({ label, placeholder, values, onUpdate }) => {
  const [currentValue, setCurrentValue] = useState("");

  const handleAdd = () => {
    if (currentValue.trim() && !values.includes(currentValue.trim())) {
      onUpdate([...values, currentValue.trim()]);
      setCurrentValue("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-green-900/50 text-green-300 text-sm px-3 py-1 rounded-full"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => onUpdate(values.filter((_, i) => i !== index))}
              className="text-green-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-2 rounded-lg flex-shrink-0"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

/* ================= DYNAMIC FAQ INPUT ================= */
const DynamicFaqInput = ({ values, onUpdate }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAdd = () => {
    if (question.trim() && answer.trim()) {
      onUpdate([
        ...values,
        { question: question.trim(), answer: answer.trim() },
      ]);
      setQuestion("");
      setAnswer("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        FAQs
      </label>
      <div className="space-y-2 mb-3">
        {values.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-start gap-4"
          >
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{faq.question}</p>
              <p className="text-gray-400 text-sm mt-1">{faq.answer}</p>
            </div>
            <button
              type="button"
              onClick={() => onUpdate(values.filter((_, i) => i !== index))}
              className="text-red-400 hover:text-red-300 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-gray-700 pt-3">
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
        />
        <textarea
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows="2"
          className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 resize-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>
    </div>
  );
};

/* ================= DYNAMIC REWARD INPUT ================= */
const DynamicRewardInput = ({ values, onUpdate }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    if (description.trim() && amount && Number(amount) > 0) {
      onUpdate([
        ...values,
        { description: description.trim(), amount: Number(amount) },
      ]);
      setDescription("");
      setAmount("");
    }
  };

  const totalPrize = values.reduce((sum, reward) => sum + reward.amount, 0);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Rewards
      </label>
      <div className="space-y-2 mb-3">
        {values.map((reward, index) => (
          <div
            key={index}
            className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-center gap-4"
          >
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">
                {reward.description}
              </p>
              <p className="text-green-400 text-sm mt-1">
                ₹{reward.amount.toLocaleString("en-IN")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdate(values.filter((_, i) => i !== index))}
              className="text-red-400 hover:text-red-300 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      {values.length > 0 && (
        <div className="bg-green-900/20 border border-green-500/30 p-2 rounded-lg mb-3">
          <p className="text-green-400 text-sm font-semibold">
            Total Prize Pool: ₹{totalPrize.toLocaleString("en-IN")}
          </p>
        </div>
      )}
      <div className="space-y-2 border-t border-gray-700 pt-3">
        <input
          type="text"
          placeholder="Reward Description (e.g., 1st Place, Best Innovation)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Reward
        </button>
      </div>
    </div>
  );
};

/* ================= HELPERS ================= */

/**
 * FIX #4 — Convert datetime-local string to proper ISO string.
 * "2026-03-20T18:30" → "2026-03-20T18:30:00.000Z"
 * Returns null if the value is empty or produces an invalid Date.
 */
const toISOString = (datetimeLocalValue) => {
  if (!datetimeLocalValue) return null;
  const d = new Date(datetimeLocalValue);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

/**
 * FIX #12 — Log all FormData entries before sending (dev-only).
 */
const debugFormData = (fd) => {
  if (import.meta.env.DEV) {
    console.group("[FormData entries]");
    for (const [key, value] of fd.entries()) {
      console.log(
        key,
        "→",
        value instanceof File ? `File(${value.name}, ${value.size}B)` : value
      );
    }
    console.groupEnd();
  }
};

/* ================= MAIN PAGE ================= */
const CreateHackathonPage = () => {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    description: "",
    overview: "",
    startDate: "",
    endDate: "",
    submissionStartDate: "",
    submissionEndDate: "",
    rewards: [],
    difficulty: "Beginner",
    techStackUsed: [],
    category: [],
    themes: [],
    problems: [],
    TandCforHackathon: [],
    evaluationCriteria: [],
    projectSubmission: [],
    FAQs: [],
    refMaterial: "",
    aboutUs: "",
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch admin
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminDetails();
        const admin = res.data.admin;
        // Debug: log the full admin object so we can see exact field names
        console.log("[Admin Data]", admin);
        setAdminData(admin);
      } catch {
        toast.error("You must be logged in to create a hackathon.");
        navigate("/adminlogin");
      }
    };
    fetchAdmin();
  }, [navigate]);

  /* ── Handlers ── */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBannerSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid image format.");
      return;
    }
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleBannerClear = () => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(null);
    setBannerPreview("");
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIX #14 — Early required-field validation before touching FormData
    if (!adminData) {
      toast.error("Admin details not found. Please log in again.");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Hackathon title is required.");
      return;
    }

    // FIX #4 — Validate and convert dates early
    const dateFields = [
      "startDate",
      "endDate",
      "submissionStartDate",
      "submissionEndDate",
    ];
    for (const field of dateFields) {
      if (formData[field] && isNaN(new Date(formData[field]).getTime())) {
        toast.error(`Invalid date for "${field}". Please re-select.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();

      // ── String fields ──
      const stringFields = [
        "title",
        "subTitle",
        "description",
        "overview",
        "difficulty",
        "refMaterial",
        "aboutUs",
      ];
      stringFields.forEach((field) => {
        if (formData[field] !== "" && formData[field] !== undefined) {
          fd.append(field, formData[field]);
        }
      });

      // FIX #4 — Convert datetime-local → ISO string before appending
      dateFields.forEach((field) => {
        const iso = toISOString(formData[field]);
        if (iso) fd.append(field, iso);
      });

      // FIX #3 — Always JSON.stringify arrays; backend must parse these safely
      const arrayFields = [
        "techStackUsed",
        "category",
        "themes",
        "problems",
        "TandCforHackathon",
        "evaluationCriteria",
        "projectSubmission",
      ];
      arrayFields.forEach((field) => {
        fd.append(field, JSON.stringify(formData[field] || []));
      });

      // FAQs (array of objects)
      fd.append("FAQs", JSON.stringify(formData.FAQs || []));

      // FIX #8 — Filter rewards: only keep entries with description + positive amount
      const validRewards = (formData.rewards || []).filter(
        (r) =>
          r && r.description && typeof r.amount === "number" && r.amount > 0
      );
      fd.append("rewards", JSON.stringify(validRewards));

      // FIX #6 — Safely extract admin ID.
      // Mongoose virtualises ._id (ObjectId) as .id (plain string) on serialised objects.
      // Some APIs strip _id and only return id, so we try both.
      const adminId = adminData._id ?? adminData.id ?? null;
      if (!adminId) {
        toast.error("Admin ID missing — please log out and log in again.");
        setIsSubmitting(false);
        return;
      }
      console.log(
        "[Admin ID being sent]",
        adminId,
        "| Full adminData keys:",
        Object.keys(adminData)
      );
      fd.append("adminId", String(adminId));

      // Banner image
      if (bannerFile) fd.append("image", bannerFile);

      // FIX #12 — Log FormData in dev
      debugFormData(fd);

      // FIX #2 — No manual Content-Type header; Axios sets multipart/form-data + boundary automatically
      const res = await createHackathon(fd);

      toast.success("Hackathon submitted for approval!");

      // FIX #1 — Handle BOTH response shapes: { hackathon } and { pendingHackathon }
      const createdHackathon =
        res.data?.hackathon ?? res.data?.pendingHackathon ?? null;
      const hackathonId = createdHackathon?._id;

      navigate("/admin");
    } catch (err) {
      console.error("[CreateHackathon] Submit error:", err);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create hackathon."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors";

  /* ── Render ── */
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <GridBackground />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <header className="my-12">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Create a New Hackathon
          </h1>
          <p className="mt-2 text-gray-400">
            Fill in the details below to set up your event.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Basic Information ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Basic Information
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Hackathon Title *"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                type="text"
                name="subTitle"
                placeholder="Subtitle / Tagline"
                value={formData.subTitle}
                onChange={handleChange}
                className={inputClass}
              />
              <textarea
                name="description"
                placeholder="Short Description (for cards) *"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
                className={inputClass + " resize-none"}
              />
              <textarea
                name="overview"
                placeholder="Detailed Overview"
                value={formData.overview}
                onChange={handleChange}
                rows="5"
                className={inputClass + " resize-none"}
              />

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Banner Image
                </label>
                <ImageDropZone
                  preview={bannerPreview}
                  onFileSelect={handleBannerSelect}
                  onClear={handleBannerClear}
                  label="Upload Banner Image"
                />
              </div>
            </div>
          </div>

          {/* ── Event Details ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Event Details
            </h2>
            <div className="space-y-6">
              <DynamicRewardInput
                values={formData.rewards}
                onUpdate={(v) => setFormData((p) => ({ ...p, rewards: v }))}
              />
              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
              <DynamicListInput
                label="Tech Stack"
                placeholder="e.g., React"
                values={formData.techStackUsed}
                onUpdate={(v) =>
                  setFormData((p) => ({ ...p, techStackUsed: v }))
                }
              />
              <DynamicListInput
                label="Categories"
                placeholder="e.g., AI"
                values={formData.category}
                onUpdate={(v) => setFormData((p) => ({ ...p, category: v }))}
              />
              <DynamicListInput
                label="Themes"
                placeholder="e.g., Sustainability"
                values={formData.themes}
                onUpdate={(v) => setFormData((p) => ({ ...p, themes: v }))}
              />
            </div>
          </div>

          {/* ── Rules & Other Details ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Rules & Other Details
            </h2>
            <div className="space-y-6">
              <DynamicListInput
                label="Problem Statements"
                placeholder="Add a problem statement"
                values={formData.problems}
                onUpdate={(v) => setFormData((p) => ({ ...p, problems: v }))}
              />
              <DynamicListInput
                label="Terms & Conditions"
                placeholder="Add a term/condition"
                values={formData.TandCforHackathon}
                onUpdate={(v) =>
                  setFormData((p) => ({ ...p, TandCforHackathon: v }))
                }
              />
              <DynamicListInput
                label="Evaluation Criteria"
                placeholder="Add a criterion"
                values={formData.evaluationCriteria}
                onUpdate={(v) =>
                  setFormData((p) => ({ ...p, evaluationCriteria: v }))
                }
              />
              <DynamicListInput
                label="Project Submission Guidelines"
                placeholder="Add a guideline"
                values={formData.projectSubmission}
                onUpdate={(v) =>
                  setFormData((p) => ({ ...p, projectSubmission: v }))
                }
              />
            </div>
          </div>

          {/* ── Additional Content ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Additional Content
            </h2>
            <div className="space-y-6">
              <input
                type="text"
                name="refMaterial"
                placeholder="Reference Material URL"
                value={formData.refMaterial}
                onChange={handleChange}
                className={inputClass}
              />
              <textarea
                name="aboutUs"
                placeholder="About the Organizer"
                value={formData.aboutUs}
                onChange={handleChange}
                rows="4"
                className={inputClass + " resize-none"}
              />
              <DynamicFaqInput
                values={formData.FAQs}
                onUpdate={(v) => setFormData((p) => ({ ...p, FAQs: v }))}
              />
            </div>
          </div>

          {/* ── Timeline ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Registration Start Date *",
                  name: "startDate",
                  required: true,
                },
                {
                  label: "Registration End Date *",
                  name: "endDate",
                  required: true,
                },
                {
                  label: "Submission Start Date *",
                  name: "submissionStartDate",
                  required: true,
                },
                {
                  label: "Submission End Date *",
                  name: "submissionEndDate",
                  required: true,
                },
              ].map(({ label, name, required }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                  </label>
                  <input
                    type="datetime-local"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 cursor-pointer hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Approval"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathonPage;
