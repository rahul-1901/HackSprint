import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  Github,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Video,
  ClipboardList,
  Users,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoginForm from "./LoginForm";

// ─── Submission Card ───────────────────────────────────────────────────────────
const SubmissionCard = ({
  submission,
  isLiked,
  onLike,
  rank,
  onOpenSubmission,
  canVote,
}) => {
  const [expanded, setExpanded] = useState(false);

  const teamName =
    submission.team?.name || submission.participant?.name || "Anonymous";
  const isTeam = !!submission.team;

  const hasAssets =
    submission.repoUrl?.length > 0 ||
    submission.docs?.length > 0 ||
    submission.images?.length > 0 ||
    submission.videos?.length > 0;

  const medalColors = {
    1: "bg-amber-400/20 text-amber-300 border-amber-400/40",
    2: "bg-gray-400/20 text-gray-300 border-gray-400/40",
    3: "bg-orange-700/20 text-orange-400 border-orange-700/40",
  };
  const rankLabel = rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`;

  return (
    <div className="bg-gray-800/50 border border-gray-700/60 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/40">
        <div className="flex items-start gap-4">
          {/* Rank badge */}
          <div
            className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-bold ${
              medalColors[rank] ||
              "bg-gray-700/40 text-gray-400 border-gray-600/40"
            }`}
          >
            {rankLabel}
          </div>

          {/* Identity */}
          <div>
            <div className="flex items-center gap-2">
              {isTeam ? (
                <Users className="w-4 h-4 text-emerald-400/70 shrink-0" />
              ) : (
                <User className="w-4 h-4 text-emerald-400/70 shrink-0" />
              )}
              <h3 className="font-semibold text-white text-lg leading-tight">
                {teamName}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isTeam ? "Team Submission" : "Individual Submission"}
            </p>
            <p className="text-lg font-bold text-emerald-400 leading-none mt-2">
              {submission.voteCount || 0}{" "}
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                {submission.voteCount === 1 ? "vote" : "votes"}
              </span>
            </p>
          </div>
        </div>

        {/* Right side: like button only */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (!localStorage.getItem("token")) {
                toast.info("Login to karlo", {autoClose: 1300});
                return;
              }

              if (isLiked) {
                onLike(submission._id);
                return;
              }

              if (!canVote) {
                toast.info("Etni jaldi kya hai..pehle submission khol ke dekh lo!", {
                  autoClose: 1300,
                });
                return;
              }

              onLike(submission._id);
            }}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border ${
              isLiked
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-inner"
                : "bg-gray-700/40 text-gray-400 border-gray-600/50 hover:bg-gray-700 hover:text-white hover:border-gray-500"
            }`}
          >
            <ThumbsUp
              className={`w-4 h-4 transition-transform ${
                isLiked ? "fill-current scale-110" : ""
              }`}
            />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>
        </div>
      </div>

      {/* Expandable assets section */}
      {hasAssets && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-3 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              {/* Asset type pills */}
              <div className="flex gap-1.5">
                {submission.repoUrl?.length > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    URL
                  </span>
                )}
                {submission.docs?.length > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    DOCS
                  </span>
                )}
                {submission.images?.length > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    IMAGES
                  </span>
                )}
                {submission.videos?.length > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    VIDEO
                  </span>
                )}
              </div>
              <span className="text-gray-500 text-xs">
                View submission assets
              </span>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 pb-6 space-y-5 border-t border-gray-700/40 pt-5">
              {/* Repository */}
              {submission.repoUrl?.length > 0 && (
                <AssetSection
                  icon={ClipboardList}
                  label="Submission"
                  accentClass="text-blue-400"
                >
                  <div className="flex flex-wrap gap-2">
                    {submission.repoUrl.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onOpenSubmission(submission._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/40 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-200 text-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {submission.repoUrl.length > 1
                          ? `Submission ${i + 1}`
                          : "View Submission"}
                      </a>
                    ))}
                  </div>
                </AssetSection>
              )}

              {/* Docs */}
              {submission.docs?.length > 0 && (
                <AssetSection
                  icon={FileText}
                  label="Documentation"
                  accentClass="text-violet-400"
                >
                  <div className="flex flex-wrap gap-2">
                    {submission.docs.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onOpenSubmission(submission._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-violet-500/5 hover:bg-violet-500/10 border border-violet-500/20 hover:border-violet-400/40 rounded-lg text-violet-400 hover:text-violet-300 transition-all duration-200 text-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {doc.original_filename || `Document ${i + 1}`}
                      </a>
                    ))}
                  </div>
                </AssetSection>
              )}

              {/* Images */}
              {submission.images?.length > 0 && (
                <AssetSection
                  icon={ImageIcon}
                  label={`Images (${submission.images.length})`}
                  accentClass="text-amber-400"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {submission.images.map((image, i) => (
                      <a
                        key={i}
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onOpenSubmission(submission._id)}
                        className="block rounded-lg overflow-hidden ring-1 ring-gray-700 hover:ring-amber-400/40 transition-all duration-200"
                      >
                        <img
                          src={image.url}
                          alt={`Screenshot ${i + 1}`}
                          className="w-full h-28 object-cover hover:opacity-80 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </AssetSection>
              )}

              {/* Videos */}
              {submission.videos?.length > 0 && (
                <AssetSection
                  icon={Video}
                  label="Videos"
                  accentClass="text-pink-400"
                >
                  <div className="flex flex-wrap gap-2">
                    {submission.videos.map((video, i) => (
                      <a
                        key={i}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/20 hover:border-pink-400/40 rounded-lg text-pink-400 hover:text-pink-300 transition-all duration-200 text-sm"
                      >
                        <Video className="w-3.5 h-3.5" />
                        {video.original_filename || `Video ${i + 1}`}
                      </a>
                    ))}
                  </div>
                </AssetSection>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Small helper for asset sections
const AssetSection = ({ icon: Icon, label, accentClass, children }) => (
  <div>
    <h4
      className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3 ${accentClass}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </h4>
    {children}
  </div>
);

// ─── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-700 text-gray-400 hover:border-emerald-500/40 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronDown className="w-3.5 h-3.5 rotate-90" />
        Prev
      </button>

      {/* Page numbers */}
      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 py-2 text-gray-600 text-sm select-none"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium border transition-all duration-200 ${
              page === currentPage
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                : "border-gray-700 text-gray-400 hover:border-emerald-500/30 hover:text-emerald-400"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-700 text-gray-400 hover:border-emerald-500/40 hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
      </button>
    </div>
  );
};

const PAGE_SIZE = 5;

// ─── Main Upvote Component ─────────────────────────────────────────────────────
const Upvote = () => {
  const { id: hackathonId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [likedSubmissions, setLikedSubmissions] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [openedSubmissions, setOpenedSubmissions] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchSubmissions();
    if (token) fetchUserVotes();
  }, [hackathonId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/votes/hackathon/${hackathonId}`
      );
      if (!response.ok) throw new Error("Failed to fetch submissions");
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
        { headers: { Authorization: `Bearer ${token}` } }
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
          body: JSON.stringify({ submissionId, hackathonId }),
        }
      );
      if (!response.ok) throw new Error("Failed to toggle vote");
      const data = await response.json();

      setLikedSubmissions((prev) => {
        const next = new Set(prev);
        data.voted ? next.add(submissionId) : next.delete(submissionId);
        return next;
      });
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
      // data.voted ? toast.success("Liked!") : toast.info("Like removed");
    } catch (error) {
      console.error("Error toggling vote:", error);
      toast.error("Failed to update vote. Please try again.");
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsLoggedIn(true);
    fetchUserVotes();
    toast.success("Login successful! You can now like submissions.");
  };

  // Sort by vote count descending for ranking
  const sortedSubmissions = [...submissions].sort(
    (a, b) => (b.voteCount || 0) - (a.voteCount || 0)
  );

  const totalPages = Math.ceil(sortedSubmissions.length / PAGE_SIZE);
  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-gray-700 border-t-emerald-400 animate-spin" />
        <p className="text-gray-500 text-sm">Loading submissions…</p>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mb-2">
          <FileText className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-gray-300 font-medium">No submissions yet</p>
        <p className="text-gray-500 text-sm">
          Check back once the hackathon is underway.
        </p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Community Submissions
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {submissions.length}{" "}
            {submissions.length === 1 ? "submission" : "submissions"} ·{" "}
            {!isLoggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                Log in to vote
              </button>
            ) : (
              "Vote for your favourites"
            )}
          </p>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400/60" />
            Liked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-600" />
            Not voted
          </span>
        </div>
      </div>

      {/* Page info */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">
              {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, sortedSubmissions.length)}
            </span>{" "}
            of{" "}
            <span className="text-gray-300 font-medium">
              {sortedSubmissions.length}
            </span>{" "}
            submissions
          </p>
          <p className="text-xs text-gray-500">
            Page{" "}
            <span className="text-gray-300 font-medium">{currentPage}</span> of{" "}
            <span className="text-gray-300 font-medium">{totalPages}</span>
          </p>
        </div>
      )}

      {/* Submission list */}
      <div className="space-y-4">
        {paginatedSubmissions.map((submission, i) => (
          <SubmissionCard
            key={submission._id}
            submission={submission}
            canVote={openedSubmissions.has(submission._id)}
            onOpenSubmission={(id) => {
              setOpenedSubmissions((prev) => new Set(prev).add(id));
            }}
            isLiked={likedSubmissions.has(submission._id)}
            onLike={handleLike}
            rank={(currentPage - 1) * PAGE_SIZE + i + 1}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
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
