import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plus,
  Check,
  X,
  User,
  Shield,
  Clock,
  CheckCircle,
  Trophy,
  ArrowRight,
  Users,
  Calendar,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Tag,
  FileText,
  HelpCircle,
  Star,
  Layers,
  AlertCircle,
  BookOpen,
  Link2,
  Info,
  Gift,
  Zap,
  XCircle,
  MessageSquare,
  Pencil,
  UploadCloud,
  ImagePlus,
  Trash2,
  Save,
} from "lucide-react";
import {
  getAdminDetails,
  getAdminHackathons,
  getPendingHackathons,
  approveHackathon,
  rejectHackathon,
  editHackathon,
} from "../backendApis/api";
import { createPortal } from "react-dom";

const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `linear-gradient(rgba(34,197,94,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.6) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
    <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/4 rounded-full blur-3xl" />
  </div>
);

const Badge = ({ children, color = "green" }) => {
  const colors = {
    green: "bg-green-900/50  text-green-300  border-green-700/40",
    blue: "bg-blue-900/50   text-blue-300   border-blue-700/40",
    amber: "bg-amber-900/50  text-amber-300  border-amber-700/40",
    red: "bg-red-900/50    text-red-300    border-red-700/40",
    gray: "bg-gray-800/60   text-gray-400   border-gray-700/40",
    yellow: "bg-yellow-900/50 text-yellow-300 border-yellow-700/40",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/15 text-green-300 border border-green-500/30">
        <CheckCircle size={11} /> Approved
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-300 border border-red-500/30">
        <XCircle size={11} /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
      <Clock size={11} /> Pending
    </span>
  );
};

const DetailRow = ({ icon: Icon, label, value, mono = false }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800/60 last:border-0">
      <Icon size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
      <span className="text-gray-500 text-xs w-32 flex-shrink-0">{label}</span>
      <span
        className={`text-gray-200 text-xs flex-1 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
};

const RejectModal = ({ hackathon, onConfirm, onCancel, isLoading }) => {
  const [reason, setReason] = useState("");
  const textareaRef = useRef(null);
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md bg-gray-900 border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500/60" />
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
            <XCircle size={22} className="text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white">Reject Hackathon</h3>
            <p className="text-gray-400 text-sm mt-0.5">
              Rejecting{" "}
              <span className="text-white font-semibold">
                "{hackathon.title}"
              </span>
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-300 mt-0.5"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <MessageSquare size={14} className="text-red-400" /> Rejection
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              ref={textareaRef}
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              placeholder="Explain why this hackathon is being rejected…"
              rows={4}
              className="w-full bg-gray-800/70 border border-gray-700 focus:border-red-500/50 rounded-xl p-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none transition-colors"
            />
            <div className="flex justify-between mt-1.5">
              <p className="text-xs text-gray-600">
                Stored and shown on the rejected card.
              </p>
              <p
                className={`text-xs ${
                  reason.length > 450 ? "text-red-400" : "text-gray-600"
                }`}
              >
                {reason.length}/500
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white transition-all text-sm font-semibold disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!reason.trim()) {
                  toast.error("Please provide a reason.");
                  return;
                }
                onConfirm(reason.trim());
              }}
              disabled={isLoading || !reason.trim()}
              className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-red-300 transition-all text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Clock size={14} className="animate-spin" /> Rejecting…
                </>
              ) : (
                <>
                  <XCircle size={14} /> Confirm Reject
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalSection = ({ title, children }) => (
  <div className="bg-gray-800/30 border border-gray-700/40 rounded-2xl p-5 space-y-4">
    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
      {title}
    </h3>
    {children}
  </div>
);

const inputClsModal =
  "w-full bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors";

const ListEditor = ({
  field,
  label,
  placeholder,
  values,
  listInputs,
  setListInputs,
  onAdd,
  onRemove,
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-2">
      {label}
    </label>
    <div className="flex flex-wrap gap-1.5 mb-2">
      {values.map((v, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 bg-green-900/40 text-green-300 text-xs px-2.5 py-1 rounded-full border border-green-800/40"
        >
          {v}
          <button
            type="button"
            onClick={() => onRemove(field, i)}
            className="text-green-500 hover:text-white"
          >
            <X size={11} />
          </button>
        </span>
      ))}
    </div>
    <div className="flex gap-2">
      <input
        value={listInputs[field] || ""}
        onChange={(e) =>
          setListInputs((p) => ({ ...p, [field]: e.target.value }))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd(field);
          }
        }}
        placeholder={placeholder}
        className={inputClsModal}
      />
      <button
        type="button"
        onClick={() => onAdd(field)}
        className="px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl flex-shrink-0 transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  </div>
);

const EditModal = ({ hackathon, adminData, onClose, onSaved }) => {
  /* Pre-fill form from hackathon */
  const toLocal = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    title: hackathon.title || "",
    subTitle: hackathon.subTitle || "",
    description: hackathon.description || "",
    overview: hackathon.overview || "",
    difficulty: hackathon.difficulty || "Beginner",
    refMaterial: hackathon.refMaterial || "",
    aboutUs: hackathon.aboutUs || "",
    startDate: toLocal(hackathon.startDate),
    endDate: toLocal(hackathon.endDate),
    submissionStartDate: toLocal(hackathon.submissionStartDate),
    submissionEndDate: toLocal(hackathon.submissionEndDate),
    techStackUsed: [...(hackathon.techStackUsed || [])],
    category: [...(hackathon.category || [])],
    themes: [...(hackathon.themes || [])],
    problems: [...(hackathon.problems || [])],
    TandCforHackathon: [...(hackathon.TandCforHackathon || [])],
    evaluationCriteria: [...(hackathon.evaluationCriteria || [])],
    projectSubmission: [...(hackathon.projectSubmission || [])],
    FAQs: [...(hackathon.FAQs || [])],
    rewards: [...(hackathon.rewards || [])],
  });

  /* Banner */
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(hackathon.image || "");
  const bannerRef = useRef(null);

  /* Saving */
  const [isSaving, setIsSaving] = useState(false);

  /* Dynamic list helpers */
  const [listInputs, setListInputs] = useState({});
  const [faqInput, setFaqInput] = useState({ question: "", answer: "" });
  const [rewardInput, setRewardInput] = useState({
    description: "",
    amount: "",
  });

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const addToList = (field) => {
    const v = (listInputs[field] || "").trim();
    if (!v || form[field].includes(v)) return;
    set(field, [...form[field], v]);
    setListInputs((p) => ({ ...p, [field]: "" }));
  };
  const removeFromList = (field, idx) =>
    set(
      field,
      form[field].filter((_, i) => i !== idx)
    );

  const addFaq = () => {
    if (!faqInput.question.trim() || !faqInput.answer.trim()) return;
    set("FAQs", [
      ...form.FAQs,
      { question: faqInput.question.trim(), answer: faqInput.answer.trim() },
    ]);
    setFaqInput({ question: "", answer: "" });
  };

  const addReward = () => {
    const amt = Number(rewardInput.amount);
    if (!rewardInput.description.trim() || !amt || amt <= 0) return;
    set("rewards", [
      ...form.rewards,
      { description: rewardInput.description.trim(), amount: amt },
    ]);
    setRewardInput({ description: "", amount: "" });
  };

  const handleBanner = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.type
      )
    ) {
      toast.error("Invalid image format.");
      return;
    }
    if (bannerPreview && bannerPreview.startsWith("blob:"))
      URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  /* Submit */
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    setIsSaving(true);
    try {
      const fd = new FormData();
      const adminId = adminData._id ?? adminData.id;
      fd.append("hackathonId", hackathon._id);
      fd.append("adminId", adminId);

      /* String fields */
      [
        "title",
        "subTitle",
        "description",
        "overview",
        "difficulty",
        "refMaterial",
        "aboutUs",
      ].forEach((f) => {
        fd.append(f, form[f]);
      });

      /* Dates → ISO */
      [
        "startDate",
        "endDate",
        "submissionStartDate",
        "submissionEndDate",
      ].forEach((f) => {
        if (form[f]) {
          const d = new Date(form[f]);
          if (!isNaN(d)) fd.append(f, d.toISOString());
        }
      });

      /* Arrays */
      [
        "techStackUsed",
        "category",
        "themes",
        "problems",
        "TandCforHackathon",
        "evaluationCriteria",
        "projectSubmission",
      ].forEach((f) => {
        fd.append(f, JSON.stringify(form[f]));
      });
      fd.append("FAQs", JSON.stringify(form.FAQs));
      fd.append(
        "rewards",
        JSON.stringify(
          form.rewards.filter((r) => r.description && r.amount > 0)
        )
      );

      /* Banner */
      if (bannerFile) fd.append("image", bannerFile);

      const res = await editHackathon(fd);
      toast.success("Hackathon updated successfully!");
      onSaved(res.data.hackathon);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  /* Prevent body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/60 bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-400/10 border border-green-400/20">
            <Pencil size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">
              Edit Hackathon
            </h2>
            <p className="text-xs text-gray-500 truncate max-w-xs">
              {hackathon.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 text-sm font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-500/25 hover:bg-green-500/40 border border-green-500/40 text-green-200 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Clock size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={14} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Basic Info */}
          <ModalSection title="Basic Information">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Hackathon Title"
                className={inputClsModal}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Subtitle / Tagline
              </label>
              <input
                value={form.subTitle}
                onChange={(e) => set("subTitle", e.target.value)}
                placeholder="Subtitle"
                className={inputClsModal}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Short Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Short description for cards"
                className={inputClsModal + " resize-none"}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Detailed Overview
              </label>
              <textarea
                value={form.overview}
                onChange={(e) => set("overview", e.target.value)}
                rows={5}
                placeholder="Detailed overview"
                className={inputClsModal + " resize-none"}
              />
            </div>

            {/* Banner image */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Banner Image
              </label>
              {bannerPreview ? (
                <div className="relative group w-full h-40 rounded-xl overflow-hidden border border-gray-700">
                  <img
                    src={bannerPreview}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => bannerRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs rounded-lg transition-all"
                    >
                      <ImagePlus size={13} /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBannerFile(null);
                        setBannerPreview("");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-xs rounded-lg transition-all"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                  <input
                    ref={bannerRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files[0] && handleBanner(e.target.files[0])
                    }
                  />
                </div>
              ) : (
                <div
                  onClick={() => bannerRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/40 hover:border-green-500/40 hover:bg-gray-800/60 cursor-pointer transition-all"
                >
                  <UploadCloud size={22} className="text-gray-500" />
                  <p className="text-xs text-gray-400">
                    Click to upload banner · JPEG, PNG, WEBP · Max 5MB
                  </p>
                  <input
                    ref={bannerRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files[0] && handleBanner(e.target.files[0])
                    }
                  />
                </div>
              )}
            </div>
          </ModalSection>

          {/* Timeline */}
          <ModalSection title="Timeline">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Registration Start *", field: "startDate" },
                { label: "Registration End *", field: "endDate" },
                { label: "Submission Start *", field: "submissionStartDate" },
                { label: "Submission End *", field: "submissionEndDate" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    {label}
                  </label>
                  <input
                    type="datetime-local"
                    value={form[field]}
                    onChange={(e) => set(field, e.target.value)}
                    className={inputClsModal}
                  />
                </div>
              ))}
            </div>
          </ModalSection>

          {/* Event Details */}
          <ModalSection title="Event Details">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
                className={inputClsModal}
              >
                {["Beginner", "Intermediate", "Advanced", "Expert"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <ListEditor
              field="techStackUsed"
              label="Tech Stack"
              placeholder="e.g. React"
              values={form.techStackUsed}
              listInputs={listInputs}
              setListInputs={setListInputs}
              onAdd={addToList}
              onRemove={removeFromList}
            />
            <ListEditor
              field="category"
              label="Categories"
              placeholder="e.g. AI"
              values={form.category}
              listInputs={listInputs}
              setListInputs={setListInputs}
              onAdd={addToList}
              onRemove={removeFromList}
            />
            <ListEditor
              field="themes"
              label="Themes"
              placeholder="e.g. Sustainability"
              values={form.themes}
              listInputs={listInputs}
              setListInputs={setListInputs}
              onAdd={addToList}
              onRemove={removeFromList}
            />

            {/* Rewards */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Rewards
              </label>
              <div className="space-y-1.5 mb-3">
                {form.rewards.map((r, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-800/50 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-gray-300">
                      {r.description}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-green-400">
                        ₹{(r.amount || 0).toLocaleString("en-IN")}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            "rewards",
                            form.rewards.filter((_, j) => j !== i)
                          )
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={rewardInput.description}
                  onChange={(e) =>
                    setRewardInput((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Reward description (e.g. 1st Place)"
                  className={inputClsModal}
                />
                <input
                  type="number"
                  value={rewardInput.amount}
                  onChange={(e) =>
                    setRewardInput((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="₹ Amount"
                  className={inputClsModal + " w-32"}
                />
                <button
                  type="button"
                  onClick={addReward}
                  className="px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl flex-shrink-0 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </ModalSection>

          {/* Rules */}
          <ModalSection title="Rules & Guidelines">
            <ListEditor
              field="problems"
              label="Problem Statements"
              placeholder="Add a problem statement"
              values={form.problems}
              listInputs={listInputs}
              setListInputs={setListInputs}
              onAdd={addToList}
              onRemove={removeFromList}
            />
            <ListEditor
              field="TandCforHackathon"
              label="Terms & Conditions"
              placeholder="Add a term"
              values={form.TandCforHackathon}
              listInputs={listInputs}
              setListInputs={setListInputs}
              onAdd={addToList}
              onRemove={removeFromList}
            />
            <ListEditor
              field="evaluationCriteria"
              label="Evaluation Criteria"
              placeholder="Add a criterion"
              values={form.evaluationCriteria}
              listInputs={listInputs}
              setListInputs={setListInputs}
              onAdd={addToList}
              onRemove={removeFromList}
            />
            <ListEditor
              field="projectSubmission"
              label="Project Submission Guidelines"
              placeholder="Add a guideline"
              values={form.projectSubmission}
              listInputs={listInputs}
              setListInputs={setListInputs}
              onAdd={addToList}
              onRemove={removeFromList}
            />
          </ModalSection>

          {/* Additional */}
          <ModalSection title="Additional Content">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Reference Material URL
              </label>
              <input
                value={form.refMaterial}
                onChange={(e) => set("refMaterial", e.target.value)}
                placeholder="https://…"
                className={inputClsModal}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                About the Organiser
              </label>
              <textarea
                value={form.aboutUs}
                onChange={(e) => set("aboutUs", e.target.value)}
                rows={4}
                placeholder="About organiser"
                className={inputClsModal + " resize-none"}
              />
            </div>

            {/* FAQs */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                FAQs
              </label>
              <div className="space-y-2 mb-3">
                {form.FAQs.map((f, i) => (
                  <div
                    key={i}
                    className="bg-gray-800/50 rounded-lg p-3 flex justify-between items-start gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {f.question}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.answer}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "FAQs",
                          form.FAQs.filter((_, j) => j !== i)
                        )
                      }
                      className="text-red-400 hover:text-red-300 flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-gray-700/50 pt-3">
                <input
                  value={faqInput.question}
                  onChange={(e) =>
                    setFaqInput((p) => ({ ...p, question: e.target.value }))
                  }
                  placeholder="Question"
                  className={inputClsModal}
                />
                <textarea
                  value={faqInput.answer}
                  onChange={(e) =>
                    setFaqInput((p) => ({ ...p, answer: e.target.value }))
                  }
                  rows={2}
                  placeholder="Answer"
                  className={inputClsModal + " resize-none"}
                />
                <button
                  type="button"
                  onClick={addFaq}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={15} /> Add FAQ
                </button>
              </div>
            </div>
          </ModalSection>
        </div>
      </div>
    </div>,
    document.body
  );
};

const HackathonCard = ({ hackathon, adminData, onEdited }) => {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);

  const totalPrize =
    hackathon.rewards?.reduce((s, r) => s + (r.amount || 0), 0) ||
    (hackathon.prizeMoney1 || 0) +
      (hackathon.prizeMoney2 || 0) +
      (hackathon.prizeMoney3 || 0);

  return (
    <>
      {showEdit && (
        <EditModal
          hackathon={hackathon}
          adminData={adminData}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => {
            onEdited(updated);
            setShowEdit(false);
          }}
        />
      )}

      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-0.5 bg-gray-900/70 backdrop-blur-sm group">
        {/* Edit button — top-right corner on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowEdit(true);
          }}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5
            bg-gray-900/90 hover:bg-green-500/20 border border-gray-700 hover:border-green-500/40
            text-gray-400 hover:text-green-400 text-xs font-semibold rounded-lg
            opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-200 backdrop-blur-sm"
        >
          <Pencil size={12} /> Edit
        </button>

        <div
          onClick={() => navigate(`/admin/${hackathon._id}/usersubmissions`)}
          className="flex flex-col lg:flex-row cursor-pointer"
        >
          <div className="w-full lg:w-1/3 h-48 lg:h-56 relative flex-shrink-0">
            <img
              src={
                hackathon.image ||
                "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop"
              }
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-transparent lg:hidden" />
          </div>
          <div className="p-4 lg:p-5 flex-1 flex flex-col justify-center">
            <h3 className="text-white font-bold text-xl lg:text-2xl mb-1 leading-snug">
              {hackathon.title}
            </h3>
            {hackathon.subTitle && (
              <p className="text-green-300 text-sm mb-2">
                {hackathon.subTitle}
              </p>
            )}
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {hackathon.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-400 text-sm mb-3">
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-green-400" />
                {hackathon.numParticipants || 0}
              </span>
              {totalPrize > 0 && (
                <span className="flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-400" />₹
                  {totalPrize.toLocaleString("en-IN")}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-green-400" />
                {new Date(hackathon.startDate).toLocaleDateString()}
              </span>
            </div>
            {hackathon.techStackUsed?.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {hackathon.techStackUsed.slice(0, 6).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-xs bg-green-900/50 text-green-300 font-medium border border-green-800/50"
                  >
                    {tech}
                  </span>
                ))}
                {hackathon.techStackUsed.length > 6 && (
                  <span className="text-xs text-gray-500 self-center">
                    +{hackathon.techStackUsed.length - 6} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const HackathonSection = ({
  title,
  hackathons,
  setHackathons,
  viewMoreLink,
  icon: Icon,
  adminData,
}) => {
  const navigate = useNavigate();

  const handleEdited = (updated) => {
    setHackathons((prev) =>
      prev.map((h) => (h._id === updated._id ? updated : h))
    );
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
        {Icon && <Icon size={22} className="text-green-400" />}
        {title}
        <span className="text-sm font-normal text-gray-500 ml-1">
          ({hackathons.length})
        </span>
      </h2>
      {hackathons.length > 0 ? (
        <div className="flex flex-col gap-5">
          {hackathons.slice(0, 3).map((hackathon, index) => {
            const isOverlay = index === 2 && hackathons.length > 3;
            return (
              <div key={hackathon._id} className={isOverlay ? "relative" : ""}>
                <div className={isOverlay ? "pointer-events-none" : ""}>
                  <HackathonCard
                    hackathon={hackathon}
                    adminData={adminData}
                    onEdited={handleEdited}
                  />
                </div>
                {isOverlay && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent rounded-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => navigate(viewMoreLink)}
                        className="bg-gray-800/90 hover:bg-gray-700 text-gray-200 font-semibold py-2.5 px-6 rounded-lg border border-gray-600 hover:border-green-400 hover:text-white transition-all duration-200 flex items-center gap-2 group backdrop-blur-sm cursor-pointer"
                      >
                        View All {hackathons.length}
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 text-gray-500 bg-gray-800/30 rounded-xl px-5 py-4 border border-gray-700/40">
          <AlertCircle size={16} /> No hackathons in this category.
        </div>
      )}
    </div>
  );
};

const PendingHackathonCard = ({
  hackathon: initialHackathon,
  onApprove,
  onReject,
}) => {
  const [hackathon, setHackathon] = useState(initialHackathon);
  const [expanded, setExpanded] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const status = hackathon.approvalStatus || "pending";
  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  const handleApprove = async () => {
    if (isApproving) return;
    if (!isPending && !isRejected) return;
    setIsApproving(true);
    try {
      await onApprove(hackathon._id);
      setHackathon((h) => ({ ...h, approvalStatus: "approved" }));
    } catch {
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectConfirm = async (reason) => {
    setIsRejecting(true);
    try {
      const result = await onReject(hackathon._id, reason);
      setHackathon((h) => ({
        ...h,
        approvalStatus: "rejected",
        rejectionDetails: result?.rejectionDetails || {
          reason,
          rejectedAt: new Date().toISOString(),
        },
      }));
      setShowRejectModal(false);
    } catch {
    } finally {
      setIsRejecting(false);
    }
  };

  const totalPrize =
    hackathon.rewards?.reduce((s, r) => s + (r.amount || 0), 0) ||
    (hackathon.prizeMoney1 || 0) +
      (hackathon.prizeMoney2 || 0) +
      (hackathon.prizeMoney3 || 0);

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  const cardBorder = isRejected
    ? "border-red-500/25 bg-red-950/10"
    : isApproved
    ? "border-green-500/25 bg-green-950/10"
    : expanded
    ? "border-yellow-500/25 bg-gray-900/80"
    : "border-gray-700/50 bg-gray-800/40 hover:border-gray-600";

  return (
    <>
      {showRejectModal && (
        <RejectModal
          hackathon={hackathon}
          onConfirm={handleRejectConfirm}
          onCancel={() => setShowRejectModal(false)}
          isLoading={isRejecting}
        />
      )}

      <div
        className={`rounded-xl border transition-all duration-300 overflow-hidden ${cardBorder}`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700">
            {hackathon.image ? (
              <img
                src={hackathon.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Zap size={18} className="text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-white truncate">{hackathon.title}</p>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-gray-500">
                Submitted{" "}
                {new Date(hackathon.createdAt).toLocaleDateString("en-IN")}
              </span>
              {hackathon.difficulty && (
                <Badge color="blue">{hackathon.difficulty}</Badge>
              )}
              {totalPrize > 0 && (
                <Badge color="amber">
                  ₹{totalPrize.toLocaleString("en-IN")}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isPending && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 italic">
                Expand to review
              </span>
            )}
            {isApproved && (
              <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <CheckCircle size={14} /> Approved
              </span>
            )}
            {isRejected && (
              <span className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <XCircle size={14} /> Rejected
              </span>
            )}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded-lg border border-gray-700 hover:border-green-500/40 text-gray-400 hover:text-green-400 transition-all"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Rejection strip (collapsed) */}
        {isRejected && !expanded && hackathon.rejectionDetails?.reason && (
          <div className="mx-4 mb-3 px-3 py-2.5 bg-red-950/50 border border-red-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle
                size={13}
                className="text-red-400 mt-0.5 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-red-300">
                  <span className="font-semibold">Reason:</span>{" "}
                  {hackathon.rejectionDetails.reason}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {hackathon.rejectionDetails.rejectedAt && (
                    <span className="text-xs text-gray-600">
                      {fmtDate(hackathon.rejectionDetails.rejectedAt)}
                    </span>
                  )}
                  {hackathon.rejectionDetails.rejectedBy?.name && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <User size={10} /> by{" "}
                      {hackathon.rejectionDetails.rejectedBy.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded panel */}
        {expanded && (
          <div className="border-t border-gray-700/50 px-4 pb-5 pt-4 space-y-5">
            {/* Rejection block */}
            {isRejected && hackathon.rejectionDetails && (
              <div className="bg-red-950/40 border border-red-500/25 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle size={13} /> Rejection Details
                </p>
                <div className="bg-red-950/50 rounded-lg p-3 border border-red-500/15">
                  <p className="text-sm text-red-200 leading-relaxed">
                    <span className="font-semibold text-red-300">Reason: </span>
                    {hackathon.rejectionDetails.reason}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {hackathon.rejectionDetails.rejectedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={11} />
                      Rejected on{" "}
                      {fmtDate(hackathon.rejectionDetails.rejectedAt)}
                    </span>
                  )}
                  {hackathon.rejectionDetails.rejectedBy?.name && (
                    <span className="flex items-center gap-1.5">
                      <User size={11} />
                      By{" "}
                      <span className="text-gray-400 font-medium">
                        {hackathon.rejectionDetails.rejectedBy.name}
                      </span>
                      {hackathon.rejectionDetails.rejectedBy.email && (
                        <span className="text-gray-600">
                          ({hackathon.rejectionDetails.rejectedBy.email})
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}

            {hackathon.image && (
              <div className="w-full h-40 rounded-xl overflow-hidden border border-gray-700">
                <img
                  src={hackathon.image}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {hackathon.description && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText size={12} /> Description
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {hackathon.description}
                </p>
              </div>
            )}
            {hackathon.overview && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen size={12} /> Overview
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {hackathon.overview}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 bg-gray-800/40 rounded-xl p-3 border border-gray-700/40">
              <DetailRow
                icon={Calendar}
                label="Reg. Start"
                value={fmtDate(hackathon.startDate)}
              />
              <DetailRow
                icon={Calendar}
                label="Reg. End"
                value={fmtDate(hackathon.endDate)}
              />
              <DetailRow
                icon={Calendar}
                label="Sub. Start"
                value={fmtDate(hackathon.submissionStartDate)}
              />
              <DetailRow
                icon={Calendar}
                label="Sub. End"
                value={fmtDate(hackathon.submissionEndDate)}
              />
              <DetailRow
                icon={Star}
                label="Difficulty"
                value={hackathon.difficulty}
              />
              <DetailRow
                icon={Trophy}
                label="Total Prize"
                value={
                  totalPrize > 0
                    ? `₹${totalPrize.toLocaleString("en-IN")}`
                    : null
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hackathon.techStackUsed?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers size={12} /> Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {hackathon.techStackUsed.map((t, i) => (
                      <Badge key={i} color="blue">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {hackathon.themes?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag size={12} /> Themes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {hackathon.themes.map((t, i) => (
                      <Badge key={i} color="green">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {hackathon.category?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag size={12} /> Categories
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {hackathon.category.map((c, i) => (
                      <Badge key={i} color="amber">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {hackathon.rewards?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Gift size={12} /> Rewards
                </p>
                <div className="space-y-1.5">
                  {hackathon.rewards.map((r, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-800/50 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm text-gray-300">
                        {r.description}
                      </span>
                      <span className="text-sm font-semibold text-green-400">
                        ₹{(r.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {hackathon.problems?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle size={12} /> Problem Statements
                </p>
                <ul className="space-y-1">
                  {hackathon.problems.map((p, i) => (
                    <li key={i} className="text-sm text-gray-400 flex gap-2">
                      <span className="text-green-500 font-mono text-xs mt-0.5">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hackathon.evaluationCriteria?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Star size={12} /> Evaluation Criteria
                </p>
                <ul className="space-y-1">
                  {hackathon.evaluationCriteria.map((c, i) => (
                    <li key={i} className="text-sm text-gray-400 flex gap-2">
                      <span className="text-green-500">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hackathon.TandCforHackathon?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield size={12} /> Terms & Conditions
                </p>
                <ul className="space-y-1">
                  {hackathon.TandCforHackathon.map((t, i) => (
                    <li key={i} className="text-sm text-gray-400 flex gap-2">
                      <span className="text-green-500">•</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hackathon.FAQs?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle size={12} /> FAQs
                </p>
                <div className="space-y-2">
                  {hackathon.FAQs.map((f, i) => (
                    <div key={i} className="bg-gray-800/40 rounded-lg p-3">
                      <p className="text-sm font-semibold text-white">
                        {f.question}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {hackathon.aboutUs && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Info size={12} /> About Organiser
                </p>
                <p className="text-sm text-gray-400">{hackathon.aboutUs}</p>
              </div>
            )}
            {hackathon.refMaterial && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Link2 size={12} /> Reference Material
                </p>
                <a
                  href={hackathon.refMaterial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-400 hover:underline break-all"
                >
                  {hackathon.refMaterial}
                </a>
              </div>
            )}

            {/* Re-approve */}
            {isRejected && (
              <div className="flex justify-end pt-3 border-t border-gray-700/50">
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex items-center gap-2 bg-green-500/25 hover:bg-green-500/45 border border-green-500/40 text-green-200 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isApproving ? (
                    <>
                      <Clock size={15} className="animate-spin" /> Approving…
                    </>
                  ) : (
                    <>
                      <Check size={15} /> Approve Anyway
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Pending actions */}
            {isPending && (
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-700/50">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                >
                  <XCircle size={15} /> Reject with Reason
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex items-center gap-2 bg-green-500/25 hover:bg-green-500/45 border border-green-500/40 text-green-200 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isApproving ? (
                    <>
                      <Clock size={15} className="animate-spin" /> Approving…
                    </>
                  ) : (
                    <>
                      <Check size={15} /> Approve Hackathon
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color = "green",
  description,
}) => {
  const styles = {
    green: {
      border: "border-green-500/25 hover:border-green-400/50",
      iconBg: "bg-green-400/10 border-green-400/20",
      iconColor: "text-green-400",
      valueColor: "text-green-400",
      bar: "bg-green-400/40",
    },
    amber: {
      border: "border-amber-500/25 hover:border-amber-400/50",
      iconBg: "bg-amber-400/10 border-amber-400/20",
      iconColor: "text-amber-400",
      valueColor: "text-amber-400",
      bar: "bg-amber-400/40",
    },
    blue: {
      border: "border-blue-500/25  hover:border-blue-400/50",
      iconBg: "bg-blue-400/10  border-blue-400/20",
      iconColor: "text-blue-400",
      valueColor: "text-blue-400",
      bar: "bg-blue-400/40",
    },
    gray: {
      border: "border-gray-500/25  hover:border-gray-400/50",
      iconBg: "bg-gray-400/10  border-gray-400/20",
      iconColor: "text-gray-400",
      valueColor: "text-gray-400",
      bar: "bg-gray-400/40",
    },
  }[color];
  return (
    <div
      className={`relative bg-gray-900/70 backdrop-blur-sm border ${styles.border} rounded-2xl p-6 transition-all duration-300 overflow-hidden shadow-lg`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${styles.bar} rounded-t-2xl`}
      />
      <div className="flex items-start justify-between mb-5">
        <div className={`p-3.5 rounded-xl border ${styles.iconBg}`}>
          <Icon size={24} className={styles.iconColor} />
        </div>
        <span
          className={`text-5xl font-black tracking-tight leading-none ${styles.valueColor}`}
        >
          {value}
        </span>
      </div>
      <p className="text-white font-semibold text-base">{label}</p>
      {description && (
        <p className="text-gray-500 text-xs mt-1">{description}</p>
      )}
    </div>
  );
};

const AdminProfile = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveHackathons, setLiveHackathons] = useState([]);
  const [expiredHackathons, setExpiredHackathons] = useState([]);
  const [hackathonsLoading, setHackathonsLoading] = useState(true);
  const [pendingHackathons, setPendingHackathons] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getAdminDetails();
        setAdminData(res.data.admin);
      } catch {
        navigate("/adminlogin");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [navigate]);

  useEffect(() => {
    if (!adminData) return;
    const run = async () => {
      try {
        setHackathonsLoading(true);
        const adminId = adminData._id ?? adminData.id;
        const res = await getAdminHackathons(adminId);
        const now = new Date();
        const live = [],
          expired = [];
        res.data.forEach((h) => {
          const start = new Date(h.startDate);
          const subEnd = new Date(h.submissionEndDate);
          if (now >= start && now <= subEnd) live.push(h);
          else if (now > subEnd) expired.push(h);
        });
        setLiveHackathons(live);
        setExpiredHackathons(expired);
      } catch (err) {
        console.error("Error fetching hackathons:", err);
      } finally {
        setHackathonsLoading(false);
      }
    };
    run();
  }, [adminData]);

  useEffect(() => {
    if (!adminData?.controller) {
      setPendingLoading(false);
      return;
    }
    const run = async () => {
      try {
        const res = await getPendingHackathons();
        setPendingHackathons(res.data.pendingHackathonsData || []);
      } catch {
        toast.error("Could not load pending hackathons.");
      } finally {
        setPendingLoading(false);
      }
    };
    run();
  }, [adminData]);

  const handleApprove = async (id) => {
    const adminId = adminData._id ?? adminData.id;
    const res = await approveHackathon({ pendingHackathonId: id, adminId });
    toast.success(res.data.message || "Hackathon approved!");
    if (res.data.success && res.data.hackathon)
      setPendingHackathons((prev) => prev.filter((h) => h._id !== id));
    return res.data;
  };

  const handleReject = async (id, rejectionReason) => {
    try {
      const adminId = adminData._id ?? adminData.id;
      const res = await rejectHackathon({
        pendingHackathonId: id,
        adminId,
        rejectionReason,
      });
      toast.success(res.data.message || "Hackathon rejected successfully.");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed.");
      throw err;
    }
  };

  if (loading || !adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
          <span className="text-gray-400">Loading admin profile…</span>
        </div>
      </div>
    );
  }

  const totalHackathons = liveHackathons.length + expiredHackathons.length;
  const pendingCount = pendingHackathons.filter(
    (h) => (h.approvalStatus || "pending") === "pending"
  ).length;

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">
            Admin Dashboard
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl ZaptronFont font-extrabold -tracking-tight text-green-400 mt-1">
            Administrator
          </h1>
          <p className="text-gray-400 text-base mt-1 max-w-2xl">
            Manage platform operations, monitor hackathons, and oversee
            community growth.
          </p>
        </div>

        {/* Profile + Create */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-green-400/20 transition-all duration-500">
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-green-400/10 border-2 border-green-400/20 rounded-full flex items-center justify-center">
                  <User size={28} className="text-green-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <Shield size={11} className="text-gray-900" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {adminData.name}
                </h2>
                <p className="text-green-400 text-sm font-medium">
                  {adminData.controller ? "Platform Controller" : "Admin"}
                </p>
                <p className="text-gray-500 text-sm">{adminData.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                <Shield size={14} className="text-green-400" /> Access
                Permissions
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Full Access", "User Management", "Event Creation"].map(
                  (p) => (
                    <div
                      key={p}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40 border border-gray-700/50 rounded-lg hover:border-green-400/30 transition-colors"
                    >
                      <CheckCircle size={12} className="text-green-400" />
                      <span className="text-gray-300 text-xs">{p}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/40 rounded-xl p-4 flex items-start">
            <div className="w-full space-y-3">
              <div>
                <h3 className="text-white text-sm font-semibold">
                  Create Hackathon
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Start a new hackathon and invite participants.
                </p>
              </div>
              <button
                onClick={() => navigate("/createHackathon")}
                className="w-full cursor-pointer bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-green-400 font-medium px-3 py-2 rounded-md transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-[1.01] group text-sm"
              >
                <Plus
                  size={16}
                  className="transition-transform duration-300 group-hover:rotate-90"
                />{" "}
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {!hackathonsLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Total Events"
              value={totalHackathons}
              icon={Layers}
              color="blue"
              description="All time created"
            />
            <StatCard
              label="Live Now"
              value={liveHackathons.length}
              icon={Zap}
              color="green"
              description="Registration & submissions open"
            />
            <StatCard
              label="Awaiting Review"
              value={pendingCount}
              icon={Clock}
              color="amber"
              description="Needs your approval"
            />
            <StatCard
              label="Concluded"
              value={expiredHackathons.length}
              icon={BadgeCheck}
              color="gray"
              description="Submission closed"
            />
          </div>
        )}

        {/* Pending Approvals */}
        {adminData.controller && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Clock size={22} className="text-amber-400" />
              Pending Approvals
              {pendingCount > 0 && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Expand any card with <ChevronDown size={12} className="inline" />{" "}
              to review full details. Rejecting requires a written reason.
            </p>
            {pendingLoading ? (
              <div className="flex items-center gap-3 text-gray-500 bg-gray-800/30 rounded-xl px-5 py-4 border border-gray-700/40">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />{" "}
                Loading pending hackathons…
              </div>
            ) : pendingHackathons.length > 0 ? (
              <div className="space-y-3">
                {pendingHackathons.map((h) => (
                  <PendingHackathonCard
                    key={h._id}
                    hackathon={h}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-500 bg-gray-800/30 rounded-xl px-5 py-4 border border-gray-700/40">
                <CheckCircle size={16} className="text-green-500" /> No
                hackathons pending approval.
              </div>
            )}
          </div>
        )}

        {/* Hackathon sections */}
        {hackathonsLoading ? (
          <div className="flex items-center gap-3 text-gray-500 py-8">
            <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />{" "}
            Loading your hackathons…
          </div>
        ) : (
          <>
            <HackathonSection
              title="Live Hackathons"
              hackathons={liveHackathons}
              setHackathons={setLiveHackathons}
              viewMoreLink="/admin/livehackathons"
              icon={Zap}
              adminData={adminData}
            />
            <HackathonSection
              title="Expired Hackathons"
              hackathons={expiredHackathons}
              setHackathons={setExpiredHackathons}
              viewMoreLink="/admin/endedhackathons"
              icon={Calendar}
              adminData={adminData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
