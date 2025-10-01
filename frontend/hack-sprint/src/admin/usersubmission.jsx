import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, AlertTriangle, Star, GitFork, FileText, Image, Video, Save } from 'lucide-react';
import { getAdminDetails, getAdminHackathonDetail, updateSubmissionPoints } from '../backendApis/api';
import { toast } from 'react-toastify';

const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);

const UserSubmissionDetailPage = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submitter, setSubmitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  const [points, setPoints] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Fetch admin details
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getAdminDetails();
        setAdminData(response.data.admin);
      } catch (error) {
        navigate('/adminlogin');
      }
    };
    fetchAdminData();
  }, [navigate]);

  // 2. Fetch all hackathon data
  useEffect(() => {
    if (adminData && slug && id) {
      const fetchData = async () => {
        try {
          const response = await getAdminHackathonDetail({ adminId: adminData.id, hackathonId: slug });
          const { hackathon, participantsWithoutTeam, teams } = response.data;

          setHackathon(hackathon);

          let foundTeam = teams.find(t => t._id.toString() === id);
          if (foundTeam && foundTeam.submission) {
            setSubmitter(foundTeam);
            setSubmission(foundTeam.submission);
            setPoints(foundTeam.submission.hackathonPoints || 0);
          } else {
            let participant = participantsWithoutTeam.find(p => p.user._id.toString() === id);
            if (participant && participant.submission) {
              setSubmitter(participant.user);
              setSubmission(participant.submission);
              setPoints(participant.submission.hackathonPoints || 0);
            }
          }
        } catch (error) {
          console.error("Failed to fetch submission details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [adminData, slug, id]);

  // Handler function to update points
  const handlePointsUpdate = async (e) => {
    e.preventDefault();
    if (!adminData || !submission) return;

    setIsUpdating(true);
    try {
      const response = await updateSubmissionPoints({
        adminId: adminData.id,
        submissionId: submission._id,
        points: Number(points),
      });

      if (response.data.success) {
        setSubmission(response.data.submission);
        toast.success("Points updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update points.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <GridBackground />
        <p>Loading Submission...</p>
      </div>
    );
  }

  if (!hackathon || !submitter || !submission) {
    return (
      <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <GridBackground />
        <div className="text-center bg-gray-900/80 backdrop-blur-sm border border-red-500/50 rounded-2xl p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 text-3xl font-bold text-white">Submission Not Found</h1>
          <p className="mt-2 text-gray-400">The participant has not submitted or the submission could not be found.</p>
          <Link
            to={`/hackathon/${slug}/usersubmissions`}
            className="mt-6 inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30"
          >
            <ArrowLeft size={16} />
            Return to Participants List
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(submission.submittedAt).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <header className="my-12">
          <Link
            to={`/admin/${slug}/usersubmissions`}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Participants List
          </Link>
          <p className="text-sm font-semibold tracking-wide text-green-400 uppercase">{hackathon.title}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl ZaptronFont -tracking-tight text-green-400 font-extrabold leading-tight">
            Submission by {submitter.name}
          </h1>
          <div className="mt-4 text-gray-400 space-y-1">
            <p className="text-lg">
              {submitter.email ? `(${submitter.email})` : '(Team Submission)'}
            </p>
            <p className="text-sm">Submitted On {formattedDate}</p>
          </div>
        </header>

        <main className="space-y-8">
          {/* --- Main Links --- */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Project Links</h2>
            <div className="space-y-4">
              {submission.repoUrl && (
                <a href={submission.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors">
                  <Github className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">GitHub Repository</p>
                    <p className="text-sm text-gray-400 break-all">{submission.repoUrl}</p>
                  </div>
                </a>
              )}
              {submission.docs?.length > 0 && (
                <a href={submission.docs[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors">
                  <FileText className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Documentation</p>
                    <p className="text-sm text-gray-400 break-all">{submission.docs[0]}</p>
                  </div>
                </a>
              )}
            </div>
          </div>



          {/* --- Project Media --- */}
          {(submission.images?.length > 0 || submission.videos?.length > 0) && (
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Project Media</h2>
              {submission.images?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2"><Image size={18} /> Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {submission.images.map((imageUrl, index) => (
                      <a key={index} href={imageUrl} target="_blank" rel="noopener noreferrer">
                        <img src={imageUrl} alt={`Submission screenshot ${index + 1}`} className="rounded-lg object-cover aspect-video hover:opacity-80 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {submission.videos?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2"><Video size={18} /> Videos</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {submission.videos.map((videoUrl, index) => (
                      <li key={index}>
                        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline break-all">{videoUrl}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* --- Admin Evaluation Section --- */}
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Admin Evaluation</h3>
            <form onSubmit={handlePointsUpdate} className="space-y-4">
              <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-400 mb-1">
                  Award Points
                </label>
                <input
                  type="number"
                  id="points"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-2 text-white text-2xl font-bold text-center"
                  min="0"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full flex cursor-pointer items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white/90 font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isUpdating ? 'Saving...' : 'Save Points'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserSubmissionDetailPage;