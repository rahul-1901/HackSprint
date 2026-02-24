import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UploadCloud, ArrowLeft, Plus, X, Images } from 'lucide-react';
import { getAdminDetails, createHackathon } from '../backendApis/api';
import axios from 'axios';

const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);

const DynamicListInput = ({ label, placeholder, values, onUpdate }) => {
  const [currentValue, setCurrentValue] = useState('');

  const handleAdd = () => {
    if (currentValue && !values.includes(currentValue)) {
      onUpdate([...values, currentValue]);
      setCurrentValue('');
    }
  };

  const handleRemove = (itemToRemove) => {
    onUpdate(values.filter(item => item !== itemToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((item, index) => (
          <div key={index} className="flex items-center gap-2 bg-green-900/50 text-green-300 text-sm px-3 py-1 rounded-full">
            <span>{item}</span>
            <button type="button" onClick={() => handleRemove(item)} className="text-green-400 hover:text-white">
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
          className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"
        />
        <button type="button" onClick={handleAdd} className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-2 rounded-lg flex-shrink-0">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

const DynamicFaqInput = ({ values, onUpdate }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAdd = () => {
    if (question && answer) {
      onUpdate([...values, { question, answer }]);
      setQuestion('');
      setAnswer('');
    }
  };

  const handleRemove = (indexToRemove) => {
    onUpdate(values.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">FAQs</label>
      <div className="space-y-2 mb-3">
        {values.map((faq, index) => (
          <div key={index} className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="font-semibold text-white">{faq.question}</p>
              <p className="text-gray-400 text-sm mt-1">{faq.answer}</p>
            </div>
            <button type="button" onClick={() => handleRemove(index)} className="text-red-400 hover:text-red-300 flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-gray-700 pt-3">
        <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
        <textarea placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows="2" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
        <button type="button" onClick={handleAdd} className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
          <Plus size={16} /> Add FAQ
        </button>
      </div>
    </div>
  );
};


const CreateHackathonPage = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [formData, setFormData] = useState({
    title: '', subTitle: '', description: '', overview: '', startDate: '', endDate: '',
    submissionStartDate: '', submissionEndDate: '',
    prizeMoney1: '', prizeMoney2: '', prizeMoney3: '',
    difficulty: 'Beginner',
    techStackUsed: [], category: [], themes: [], refMaterial: '', aboutUs: '',
    problems: [], TandCforHackathon: [], evaluationCriteria: [], projectSubmission: [],
    FAQs: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getAdminDetails();
        setAdminData(response.data.admin);
      } catch (error) {
        toast.error("You must be logged in to create a hackathon.");
        navigate('/adminlogin');
      }
    };
    fetchAdminData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate total number of images (max 10)
    if (files.length + galleryFiles.length > 10) {
      toast.error('You can upload a maximum of 10 gallery images.');
      return;
    }

    const validFiles = [];
    const validPreviews = [];

    files.forEach(file => {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Image ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image file.`);
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    // Update state
    setGalleryFiles([...galleryFiles, ...validFiles]);
    setGalleryPreviews([...galleryPreviews, ...validPreviews]);
  };

  const removeGalleryImage = (index) => {
    // Cleanup preview URL
    if (galleryPreviews[index]) {
      URL.revokeObjectURL(galleryPreviews[index]);
    }

    // Remove from both arrays
    const newFiles = galleryFiles.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);

    setGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  const uploadGalleryImages = async (hackathonId) => {
    if (galleryFiles.length === 0) return;
    
    try {
      for (let i = 0; i < galleryFiles.length; i++) {
        const formData = new FormData();
        formData.append('image', galleryFiles[i]);
        formData.append('caption', '');

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}/gallery`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
          }
        );
      }
      console.log('Gallery images uploaded successfully');
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast.warning('Hackathon created but some gallery images failed to upload.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminData) { toast.error("Admin details not found."); return; }
    setIsSubmitting(true);

    const submissionData = new FormData();

    const simpleFields = [
      'title', 'subTitle', 'description', 'overview', 'startDate', 'endDate',
      'submissionStartDate', 'submissionEndDate',
      'prizeMoney1', 'prizeMoney2', 'prizeMoney3',
      'difficulty', 'refMaterial', 'aboutUs'
    ];

    simpleFields.forEach(field => {
      if (formData[field]) submissionData.append(field, formData[field]);
    });

    const arrayFields = ['techStackUsed', 'category', 'themes', 'problems', 'TandCforHackathon', 'evaluationCriteria', 'projectSubmission'];
    arrayFields.forEach(field => {
      submissionData.append(field, JSON.stringify(formData[field]));
    });

    const faqsStringArray = formData.FAQs.map(faq => `${faq.question}|${faq.answer}`);
    submissionData.append('FAQs', JSON.stringify(faqsStringArray));

    submissionData.append('adminId', adminData.id);
    if (imageFile) {
      submissionData.append('image', imageFile);
    }

    try {
      const response = await createHackathon(submissionData);
      toast.success("Hackathon submitted for approval!");
      
      // If there are gallery images and we got a hackathon ID back, upload them
      if (galleryFiles.length > 0 && response.data?.hackathon?._id) {
        await uploadGalleryImages(response.data.hackathon._id);
      }

      console.log('Hackathon created successfully:', response.data);
      
      // navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create hackathon.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            <div className="space-y-4">
              <input type="text" name="title" placeholder="Hackathon Title *" value={formData.title} onChange={handleChange} required className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
              <input type="text" name="subTitle" placeholder="Subtitle / Tagline" value={formData.subTitle} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
              <textarea name="description" placeholder="Short Description (for cards) *" value={formData.description} onChange={handleChange} rows="3" required className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
              <textarea name="overview" placeholder="Detailed Overview" value={formData.overview} onChange={handleChange} rows="5" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
              <div className="mt-2 flex items-center gap-4">
                <span className="h-24 w-40 rounded-lg overflow-hidden bg-gray-800/60 flex items-center justify-center">
                  {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" /> : <UploadCloud className="h-8 w-8 text-gray-500" />}
                </span>
                <label htmlFor="image-upload" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Upload Image</label>
                <input id="image-upload" name="image" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
              </div>

              {/* Gallery Images Upload */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Images className="h-5 w-5 text-purple-400" />
                  <label className="text-sm font-medium text-gray-300">
                    Gallery Images (Optional - Max 10)
                  </label>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Upload images to showcase in the hackathon gallery.
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <label htmlFor="gallery-upload" className={`cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors ${galleryFiles.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span className="flex items-center gap-2">
                      <Images size={16} />
                      Select Images
                    </span>
                  </label>
                  <input 
                    id="gallery-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/jpeg,image/png,image/gif,image/webp" 
                    multiple
                    onChange={handleGalleryUpload}
                    disabled={galleryFiles.length >= 10}
                  />
                  {galleryFiles.length > 0 && (
                    <span className="text-sm text-gray-400">
                      {galleryFiles.length}/10 images selected
                    </span>
                  )}
                </div>

                {/* Gallery Previews */}
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center rounded-b-lg">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prize Money ($)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="number" name="prizeMoney1" placeholder="1st Prize *" value={formData.prizeMoney1} onChange={handleChange} required className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
                  <input type="number" name="prizeMoney2" placeholder="2nd Prize" value={formData.prizeMoney2} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
                  <input type="number" name="prizeMoney3" placeholder="3rd Prize" value={formData.prizeMoney3} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
                </div>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
                </select>
              </div>

              <DynamicListInput label="Tech Stack" placeholder="e.g., React" values={formData.techStackUsed} onUpdate={(newVal) => setFormData(p => ({ ...p, techStackUsed: newVal }))} />
              <DynamicListInput label="Categories" placeholder="e.g., AI" values={formData.category} onUpdate={(newVal) => setFormData(p => ({ ...p, category: newVal }))} />
              <DynamicListInput label="Themes" placeholder="e.g., Sustainability" values={formData.themes} onUpdate={(newVal) => setFormData(p => ({ ...p, themes: newVal }))} />
            </div>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Rules & Other Details</h2>
            <div className="space-y-6">
              <DynamicListInput label="Problem Statements" placeholder="Add a problem statement" values={formData.problems} onUpdate={(newVal) => setFormData(p => ({ ...p, problems: newVal }))} />
              <DynamicListInput label="Terms & Conditions" placeholder="Add a term/condition" values={formData.TandCforHackathon} onUpdate={(newVal) => setFormData(p => ({ ...p, TandCforHackathon: newVal }))} />
              <DynamicListInput label="Evaluation Criteria" placeholder="Add a criterion" values={formData.evaluationCriteria} onUpdate={(newVal) => setFormData(p => ({ ...p, evaluationCriteria: newVal }))} />
              <DynamicListInput label="Project Submission Guidelines" placeholder="Add a guideline" values={formData.projectSubmission} onUpdate={(newVal) => setFormData(p => ({ ...p, projectSubmission: newVal }))} />
            </div>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Additional Content</h2>
            <div className="space-y-6">
              <input type="text" name="refMaterial" placeholder="Reference Material URL" value={formData.refMaterial} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
              <textarea name="aboutUs" placeholder="About the Organizer" value={formData.aboutUs} onChange={handleChange} rows="4" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
              <DynamicFaqInput values={formData.FAQs} onUpdate={(newVal) => setFormData(p => ({ ...p, FAQs: newVal }))} />
            </div>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Registration Start Date *</label>
                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Registration End Date *</label>
                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Submission Start Date *</label>
                <input type="datetime-local" name="submissionStartDate" value={formData.submissionStartDate} onChange={handleChange} required className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Submission End Date *</label>
                <input type="datetime-local" name="submissionEndDate" value={formData.submissionEndDate} onChange={handleChange} required className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathonPage;