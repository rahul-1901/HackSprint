import React, { useState, useEffect } from "react";
import { ThumbsUp, Github, ExternalLink, FileText, Image as ImageIcon, Video } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoginForm from "./LoginForm";

const Upvote = () => {
  const { id: hackathonId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [likedSubmissions, setLikedSubmissions] = useState(new Set());

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Fetch submissions for this hackathon
    fetchSubmissions();
    
    // Fetch user's votes if logged in
    if (token) {
      fetchUserVotes();
    }
  }, [hackathonId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      // Fetch submissions with vote counts
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/votes/hackathon/${hackathonId}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }
      
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/votes/user/${hackathonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setLikedSubmissions(new Set(data.votedSubmissions || []));
      }
    } catch (error) {
      console.error("Error fetching user votes:", error);
    }
  };

  const handleLike = async (submissionId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/votes/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            submissionId,
            hackathonId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle vote");
      }

      const data = await response.json();

      setLikedSubmissions((prev) => {
        const newLikes = new Set(prev);
        if (data.voted) {
          newLikes.add(submissionId);
          toast.success("Liked!");
        } else {
          newLikes.delete(submissionId);
          toast.info("Like removed");
        }
        return newLikes;
      });

      // Update vote count in submissions
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === submissionId
            ? {
                ...sub,
                voteCount: data.voted
                  ? (sub.voteCount || 0) + 1
                  : Math.max((sub.voteCount || 0) - 1, 0),
              }
            : sub
        )
      );
    } catch (error) {
      console.error("Error toggling vote:", error);
      toast.error("Failed to update vote. Please try again.");
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsLoggedIn(true);
    fetchUserVotes(); // Fetch user's votes after successful login
    toast.success("Login successful! You can now like submissions.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-400 text-lg">No submissions yet for this hackathon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Community Submissions</h2>
        <p className="text-gray-400">
          Vote for your favorite projects! {!isLoggedIn && "Login to like submissions."}
        </p>
      </div>

      {submissions.map((submission) => {
        const teamName = submission.team?.name || submission.participant?.name || "Anonymous";
        const isLiked = likedSubmissions.has(submission._id);

        return (
          <div
            key={submission._id}
            className="bg-gray-800/50 border border-green-500/20 rounded-lg p-6 hover:border-green-400/30 transition-all duration-300"
          >
            {/* Team/User Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{teamName}</h3>
                <p className="text-sm text-gray-400">
                  {submission.team ? "Team Submission" : "Individual Submission"}
                </p>
                {/* Vote Count */}
                <p className="text-sm text-green-400 mt-1">
                  {submission.voteCount || 0} {submission.voteCount === 1 ? 'vote' : 'votes'}
                </p>
              </div>
              
              {/* Like Button */}
              <button
                onClick={() => handleLike(submission._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isLiked
                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                    : "bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{isLiked ? "Liked" : "Like"}</span>
              </button>
            </div>

            {/* Repository URLs */}
            {submission.repoUrl && submission.repoUrl.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Repository
                </h4>
                <div className="space-y-2 space-x-2">
                  {submission.repoUrl.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 hover:border-blue-400/50 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {submission.repoUrl.length > 1 ? `Repository url ${index + 1}` : 'View Repository'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Documentation */}
            {submission.docs && submission.docs.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documentation
                </h4>
                <div className="flex flex-wrap gap-2">
                  {submission.docs.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 hover:border-blue-400/50 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-200"
                    >
                      <FileText className="w-3 h-3" />
                      <span className="text-sm font-medium">
                        {doc.original_filename || `Document ${index + 1}`}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {submission.images && submission.images.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Images ({submission.images.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {submission.images.map((image, index) => (
                    <a
                      key={index}
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={image.url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {submission.videos && submission.videos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Videos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {submission.videos.map((video, index) => (
                    <a
                      key={index}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 hover:border-purple-400/50 rounded-lg text-purple-400 hover:text-purple-300 transition-all duration-200"
                    >
                      <Video className="w-3 h-3" />
                      <span className="text-sm font-medium">
                        {video.original_filename || `Video ${index + 1}`}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative z-10 max-w-md w-full mx-4">
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              redirectTo="#"
              showTitle={true}
              showSignupLink={true}
              showForgotPassword={false}
              showGoogleLogin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Upvote;
