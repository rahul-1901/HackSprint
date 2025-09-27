import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UploadCloud, ArrowLeft } from 'lucide-react';
import { getAdminDetails, createHackathon } from '../backendApis/api';

const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);

const CreateHackathonPage = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [formData, setFormData] = useState({
    title: '', subTitle: '', description: '', overview: '', startDate: '', endDate: '',
    submissionStartDate: '', submissionEndDate: '', prizeMoney: '', difficulty: 'Beginner',
    techStackUsed: '', category: '', themes: '', refMaterial: '', aboutUs: '',
    problems: '', TandCforHackathon: '', evaluationCriteria: '', FAQs: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminData) { toast.error("Admin details not found."); return; }
    setIsSubmitting(true);

    const submissionData = new FormData();
    
    // Append simple key-value pairs
    const simpleFields = ['title', 'subTitle', 'description', 'overview', 'startDate', 'endDate', 'submissionStartDate', 'submissionEndDate', 'prizeMoney', 'difficulty', 'refMaterial', 'aboutUs'];
    simpleFields.forEach(field => {
        if(formData[field]) submissionData.append(field, formData[field]);
    });

    // Process and stringify fields that are arrays of strings
    const processSimpleArray = (str) => str.split(',').map(item => item.trim()).filter(Boolean);
    const processTextareaArray = (str) => str.split('\n').map(item => item.trim()).filter(Boolean);

    submissionData.append('techStackUsed', JSON.stringify(processSimpleArray(formData.techStackUsed)));
    submissionData.append('category', JSON.stringify(processSimpleArray(formData.category)));
    submissionData.append('themes', JSON.stringify(processSimpleArray(formData.themes)));
    submissionData.append('problems', JSON.stringify(processTextareaArray(formData.problems)));
    submissionData.append('TandCforHackathon', JSON.stringify(processTextareaArray(formData.TandCforHackathon)));
    submissionData.append('evaluationCriteria', JSON.stringify(processTextareaArray(formData.evaluationCriteria)));

    // KEY CHANGE: Process FAQs into a simple array of strings to match your schema
    // The format "Question|Answer" will be preserved as a single string in the array.
    const faqsArray = formData.FAQs.split('\n').map(line => line.trim()).filter(Boolean);
    submissionData.append('FAQs', JSON.stringify(faqsArray));
    
    submissionData.append('adminId', adminData.id);
    if (imageFile) {
      submissionData.append('image', imageFile);
    }
    
    try {
      await createHackathon(submissionData);
      toast.success("Hackathon submitted for approval!");
      navigate('/Hacksprintkaadminprofile');
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
          <Link to="/Hacksprintkaadminprofile" className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 group">
             <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
             Back to Dashboard
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">Create a New Hackathon</h1>
          <p className="mt-2 text-gray-400">Fill in the details below to set up your event.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
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
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
             <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="number" name="prizeMoney" placeholder="Prize Money ($) *" value={formData.prizeMoney} onChange={handleChange} required className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
                </select>
                <input type="text" name="techStackUsed" placeholder="Tech Stack (comma-separated)" value={formData.techStackUsed} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
                <input type="text" name="category" placeholder="Categories (comma-separated)" value={formData.category} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
                <textarea name="themes" placeholder="Themes (comma-separated)" value={formData.themes} onChange={handleChange} rows="2" className="md:col-span-2 w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
             </div>
          </div>
          
          {/* Rules & Criteria Section */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Rules & Other Details</h2>
            <div className="space-y-4">
              <textarea name="problems" placeholder="Problem Statements (enter each on a new line)" value={formData.problems} onChange={handleChange} rows="4" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
              <textarea name="TandCforHackathon" placeholder="Terms & Conditions (enter each on a new line)" value={formData.TandCforHackathon} onChange={handleChange} rows="4" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
              <textarea name="evaluationCriteria" placeholder="Evaluation Criteria (enter each on a new line)" value={formData.evaluationCriteria} onChange={handleChange} rows="4" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
              <textarea name="projectSubmission" placeholder="Project Submission Guidelines (enter each on a new line)" value={formData.projectSubmission} onChange={handleChange} rows="4" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
            </div>
          </div>

          {/* Additional Content Section */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Additional Content</h2>
            <div className="space-y-4">
               <input type="text" name="refMaterial" placeholder="Reference Material URL" value={formData.refMaterial} onChange={handleChange} className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white" />
               <textarea name="aboutUs" placeholder="About the Organizer" value={formData.aboutUs} onChange={handleChange} rows="4" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
               <textarea name="FAQs" placeholder="FAQs (format: Question|Answer, each on a new line)" value={formData.FAQs} onChange={handleChange} rows="5" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white"></textarea>
            </div>
          </div>

          {/* Timeline Section */}
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

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathonPage;