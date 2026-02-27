import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UploadCloud, ArrowLeft, Plus, X, Images, ImagePlus, Trash2 } from 'lucide-react';
import { getAdminDetails, createHackathon } from '../backendApis/api';
import axios from 'axios';

/* ================= BACKGROUND ================= */
const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);

/* ================= IMAGE DROP ZONE ================= */
const ImageDropZone = ({ preview, onFileSelect, onClear, label = "Upload Image", accept = "image/*" }) => {
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
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-green-400 bg-green-400/10'
              : 'border-gray-600 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/60'
          }`}
        >
          <UploadCloud className={`w-8 h-8 transition-colors ${isDragging ? 'text-green-400' : 'text-gray-500'}`} />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-300">{label}</p>
            <p className="text-xs text-gray-500 mt-1">Drag & drop or click to browse</p>
            <p className="text-xs text-gray-600 mt-0.5">JPEG, PNG, WEBP · Max 5MB</p>
          </div>
          <input ref={inputRef} type="file" className="sr-only" accept={accept} onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])} />
        </div>
      ) : (
        <div className="relative group w-full h-40 rounded-xl overflow-hidden border border-gray-700">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
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
          <input ref={inputRef} type="file" className="sr-only" accept={accept} onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])} />
        </div>
      )}
    </div>
  );
};

/* ================= GALLERY UPLOAD ================= */
const GalleryUpload = ({ items, onAdd, onRemove }) => {
  const inputRef = React.useRef(null);
  const MAX = 10;

  const handleFiles = (files) => {
    const remaining = MAX - items.length;
    if (remaining <= 0) { toast.error('Maximum 10 gallery images allowed.'); return; }

    const toAdd = [];
    Array.from(files).slice(0, remaining).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB limit.`); return; }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) { toast.error(`${file.name} is not a valid image.`); return; }
      toAdd.push({ file, url: URL.createObjectURL(file) });
    });

    if (toAdd.length) onAdd(toAdd);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Images className="w-4 h-4 text-purple-400" />
          <label className="text-sm font-medium text-gray-300">Gallery Images</label>
          <span className="text-xs text-gray-500">(optional · max {MAX})</span>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
          items.length >= MAX
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-gray-700/50 text-gray-400 border-gray-600/30'
        }`}>
          {items.length}/{MAX}
        </span>
      </div>

      {items.length < MAX && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/40 hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer transition-all duration-200 mb-3"
        >
          <Images className="w-5 h-5 text-gray-500" />
          <p className="text-xs text-gray-400">Click or drag images here · {MAX - items.length} remaining</p>
          <input ref={inputRef} type="file" className="sr-only" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={(e) => handleFiles(e.target.files)} />
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {items.map((item, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={item.url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-700" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5 rounded-b-lg">
                #{i + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= DYNAMIC LIST INPUT ================= */
const DynamicListInput = ({ label, placeholder, values, onUpdate }) => {
  const [currentValue, setCurrentValue] = useState('');

  const handleAdd = () => {
    if (currentValue.trim() && !values.includes(currentValue.trim())) {
      onUpdate([...values, currentValue.trim()]);
      setCurrentValue('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((item, index) => (
          <div key={index} className="flex items-center gap-2 bg-green-900/50 text-green-300 text-sm px-3 py-1 rounded-full">
            <span>{item}</span>
            <button type="button" onClick={() => onUpdate(values.filter((_, i) => i !== index))} className="text-green-400 hover:text-white">
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
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
        />
        <button type="button" onClick={handleAdd} className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-2 rounded-lg flex-shrink-0">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

/* ================= DYNAMIC FAQ INPUT ================= */
const DynamicFaqInput = ({ values, onUpdate }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAdd = () => {
    if (question.trim() && answer.trim()) {
      onUpdate([...values, { question: question.trim(), answer: answer.trim() }]);
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">FAQs</label>
      <div className="space-y-2 mb-3">
        {values.map((faq, index) => (
          <div key={index} className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{faq.question}</p>
              <p className="text-gray-400 text-sm mt-1">{faq.answer}</p>
            </div>
            <button type="button" onClick={() => onUpdate(values.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-300 flex-shrink-0">
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
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (description.trim() && amount && Number(amount) > 0) {
      onUpdate([...values, { description: description.trim(), amount: Number(amount) }]);
      setDescription('');
      setAmount('');
    }
  };

  const totalPrize = values.reduce((sum, reward) => sum + reward.amount, 0);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Rewards</label>
      <div className="space-y-2 mb-3">
        {values.map((reward, index) => (
          <div key={index} className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{reward.description}</p>
              <p className="text-green-400 text-sm mt-1">₹{reward.amount.toLocaleString('en-IN')}</p>
            </div>
            <button type="button" onClick={() => onUpdate(values.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-300 flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      {values.length > 0 && (
        <div className="bg-green-900/20 border border-green-500/30 p-2 rounded-lg mb-3">
          <p className="text-green-400 text-sm font-semibold">Total Prize Pool: ₹{totalPrize.toLocaleString('en-IN')}</p>
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

/* ================= MAIN PAGE ================= */
const CreateHackathonPage = () => {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  const [galleryItems, setGalleryItems] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    description: '',
    overview: '',
    startDate: '',
    endDate: '',
    submissionStartDate: '',
    submissionEndDate: '',
    rewards: [],
    prizeMoney1: '',
    prizeMoney2: '',
    prizeMoney3: '',
    difficulty: 'Beginner',
    techStackUsed: [],
    category: [],
    themes: [],
    problems: [],
    TandCforHackathon: [],
    evaluationCriteria: [],
    projectSubmission: [],
    FAQs: [],
    refMaterial: '',
    aboutUs: '',
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      galleryItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  // Fetch admin
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminDetails();
        setAdminData(res.data.admin);
      } catch {
        toast.error("You must be logged in to create a hackathon.");
        navigate('/adminlogin');
      }
    };
    fetchAdmin();
  }, [navigate]);

  /* ── Handlers ── */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBannerSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB.'); return; }
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) { toast.error('Invalid image format.'); return; }
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleBannerClear = () => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(null);
    setBannerPreview('');
  };

  const handleGalleryAdd = (newItems) => {
    setGalleryItems((prev) => [...prev, ...newItems]);
  };

  const handleGalleryRemove = (index) => {
    setGalleryItems((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  /* ── Gallery upload (after hackathon created) ── */
  const uploadGalleryImages = async (hackathonId) => {
    if (galleryItems.length === 0) return;
    try {
      for (const item of galleryItems) {
        const fd = new FormData();
        fd.append('image', item.file);
        fd.append('caption', '');
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}/gallery`,
          fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
          }
        );
      }
    } catch {
      toast.warning('Hackathon created but some gallery images failed to upload.');
    }
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminData) { toast.error("Admin details not found."); return; }

    setIsSubmitting(true);

    try {
      const fd = new FormData();

      // Simple string/number fields
      const simpleFields = [
        'title', 'subTitle', 'description', 'overview',
        'startDate', 'endDate', 'submissionStartDate', 'submissionEndDate',
        'prizeMoney1', 'prizeMoney2', 'prizeMoney3',
        'difficulty', 'refMaterial', 'aboutUs',
      ];
      simpleFields.forEach((field) => {
        if (formData[field] !== '' && formData[field] !== undefined) {
          fd.append(field, formData[field]);
        }
      });

      // Array fields — JSON stringified
      const arrayFields = [
        'techStackUsed', 'category', 'themes', 'problems',
        'TandCforHackathon', 'evaluationCriteria', 'projectSubmission',
      ];
      arrayFields.forEach((field) => {
        fd.append(field, JSON.stringify(formData[field] || []));
      });

      // FAQs — keep as objects (correct format)
      fd.append('FAQs', JSON.stringify(formData.FAQs || []));

      // Rewards — new flexible system
      fd.append('rewards', JSON.stringify(formData.rewards || []));

      // Admin ID
      fd.append('adminId', adminData.id);

      // Banner image
      if (bannerFile) fd.append('image', bannerFile);

      const res = await createHackathon(fd);

      toast.success("Hackathon submitted for approval!");

      // Upload gallery images if any
      if (galleryItems.length > 0 && res.data?.hackathon?._id) {
        await uploadGalleryImages(res.data.hackathon._id);
      }

      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create hackathon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors";

  /* ── Render ── */
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <GridBackground />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <header className="my-12">
          <Link to="/admin" className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">Create a New Hackathon</h1>
          <p className="mt-2 text-gray-400">Fill in the details below to set up your event.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Basic Information ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            <div className="space-y-4">
              <input type="text" name="title" placeholder="Hackathon Title *" value={formData.title} onChange={handleChange} required className={inputClass} />
              <input type="text" name="subTitle" placeholder="Subtitle / Tagline" value={formData.subTitle} onChange={handleChange} className={inputClass} />
              <textarea name="description" placeholder="Short Description (for cards) *" value={formData.description} onChange={handleChange} rows="3" required className={inputClass + " resize-none"} />
              <textarea name="overview" placeholder="Detailed Overview" value={formData.overview} onChange={handleChange} rows="5" className={inputClass + " resize-none"} />

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Banner Image</label>
                <ImageDropZone
                  preview={bannerPreview}
                  onFileSelect={handleBannerSelect}
                  onClear={handleBannerClear}
                  label="Upload Banner Image"
                />
              </div>

              {/* Gallery Images */}
              <div className="pt-2 border-t border-gray-700/50">
                <GalleryUpload
                  items={galleryItems}
                  onAdd={handleGalleryAdd}
                  onRemove={handleGalleryRemove}
                />
              </div>
            </div>
          </div>

          {/* ── Event Details ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
            <div className="space-y-6">
              <DynamicRewardInput 
                values={formData.rewards} 
                onUpdate={(v) => setFormData((p) => ({ ...p, rewards: v }))} 
              />
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputClass}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
              <DynamicListInput label="Tech Stack" placeholder="e.g., React" values={formData.techStackUsed} onUpdate={(v) => setFormData((p) => ({ ...p, techStackUsed: v }))} />
              <DynamicListInput label="Categories" placeholder="e.g., AI" values={formData.category} onUpdate={(v) => setFormData((p) => ({ ...p, category: v }))} />
              <DynamicListInput label="Themes" placeholder="e.g., Sustainability" values={formData.themes} onUpdate={(v) => setFormData((p) => ({ ...p, themes: v }))} />
            </div>
          </div>

          {/* ── Rules & Other Details ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Rules & Other Details</h2>
            <div className="space-y-6">
              <DynamicListInput label="Problem Statements" placeholder="Add a problem statement" values={formData.problems} onUpdate={(v) => setFormData((p) => ({ ...p, problems: v }))} />
              <DynamicListInput label="Terms & Conditions" placeholder="Add a term/condition" values={formData.TandCforHackathon} onUpdate={(v) => setFormData((p) => ({ ...p, TandCforHackathon: v }))} />
              <DynamicListInput label="Evaluation Criteria" placeholder="Add a criterion" values={formData.evaluationCriteria} onUpdate={(v) => setFormData((p) => ({ ...p, evaluationCriteria: v }))} />
              <DynamicListInput label="Project Submission Guidelines" placeholder="Add a guideline" values={formData.projectSubmission} onUpdate={(v) => setFormData((p) => ({ ...p, projectSubmission: v }))} />
            </div>
          </div>

          {/* ── Additional Content ── */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Additional Content</h2>
            <div className="space-y-6">
              <input type="text" name="refMaterial" placeholder="Reference Material URL" value={formData.refMaterial} onChange={handleChange} className={inputClass} />
              <textarea name="aboutUs" placeholder="About the Organizer" value={formData.aboutUs} onChange={handleChange} rows="4" className={inputClass + " resize-none"} />
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
                { label: 'Registration Start Date *', name: 'startDate', required: true },
                { label: 'Registration End Date *', name: 'endDate', required: true },
                { label: 'Submission Start Date *', name: 'submissionStartDate', required: true },
                { label: 'Submission End Date *', name: 'submissionEndDate', required: true },
              ].map(({ label, name, required }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                  <input type="datetime-local" name={name} value={formData[name]} onChange={handleChange} required={required} className={inputClass} />
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
              ) : 'Submit for Approval'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateHackathonPage;