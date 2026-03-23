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
  Search,
  X,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PAGE_SIZE = 5;

const MEDALS = {
  1: {
    emoji: "🥇",
    cls: "bg-[rgba(255,196,0,0.12)] text-[#ffd700] border-[rgba(255,196,0,0.3)]",
  },
  2: {
    emoji: "🥈",
    cls: "bg-[rgba(192,192,192,0.1)] text-[#c0c0c0] border-[rgba(192,192,192,0.3)]",
  },
  3: {
    emoji: "🥉",
    cls: "bg-[rgba(205,127,50,0.1)] text-[#cd7f32] border-[rgba(205,127,50,0.3)]",
  },
};

const AssetPill = ({ color, label }) => {
  const c = {
    blue: "bg-[rgba(96,200,255,0.07)] text-[rgba(96,200,255,0.75)] border-[rgba(96,200,255,0.2)]",
    violet:
      "bg-[rgba(167,139,250,0.07)] text-[rgba(167,139,250,0.75)] border-[rgba(167,139,250,0.2)]",
    amber:
      "bg-[rgba(255,184,77,0.07)] text-[rgba(255,184,77,0.75)] border-[rgba(255,184,77,0.2)]",
    pink: "bg-[rgba(255,100,150,0.07)] text-[rgba(255,100,150,0.75)] border-[rgba(255,100,150,0.2)]",
  }[color];
  return (
    <span
      className={`font-[family-name:'JetBrains_Mono',monospace] text-[0.5rem] tracking-[0.1em] uppercase px-1.5 py-[2px] rounded-[2px] border ${c}`}
    >
      {label}
    </span>
  );
};

const AssetGroup = ({ icon: Icon, label, color, children }) => {
  const c = {
    blue: "text-[rgba(96,200,255,0.7)]",
    violet: "text-[rgba(167,139,250,0.7)]",
    amber: "text-[rgba(255,184,77,0.7)]",
    pink: "text-[rgba(255,100,150,0.7)]",
  }[color];
  return (
    <div>
      <div
        className={`font-[family-name:'JetBrains_Mono',monospace] flex items-center gap-1.5 text-[0.55rem] tracking-[0.14em] uppercase mb-2.5 ${c}`}
      >
        <Icon size={11} />
        {label}
      </div>
      {children}
    </div>
  );
};

const SubmissionCard = ({
  submission,
  isLiked,
  onLike,
  rank,
  isVotingClosed,
  onOpenSubmission,
  canVote,
}) => {
  const [expanded, setExpanded] = useState(false);
  const name =
    submission.team?.name || submission.participant?.name || "Anonymous";
  const isTeam = !!submission.team;
  const medal = MEDALS[rank];

  const hasAssets =
    submission.repoUrl?.length > 0 ||
    submission.docs?.length > 0 ||
    submission.images?.length > 0 ||
    submission.videos?.length > 0;

  const handleVote = () => {
    if (isVotingClosed) {
      toast.info("Voting period has ended.");
      return;
    }
    if (!localStorage.getItem("token")) {
      toast.info("Login to karlo", { autoClose: 1300 });
      return;
    }
    if (!isLiked && !canVote) {
      toast.info("Pehle submission khol ke dekh lo!", { autoClose: 1300 });
      return;
    }
    onLike(submission._id);
  };

  return (
    <div className="relative bg-[rgba(10,12,10,0.88)] border border-[rgba(95,255,96,0.1)] rounded-[4px] overflow-hidden hover:border-[rgba(95,255,96,0.28)] transition-all">
      <span className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t-2 border-l-2 border-[rgba(95,255,96,0.35)]" />
      <span className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b-2 border-r-2 border-[rgba(95,255,96,0.35)]" />

      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(95,255,96,0.07)]">
        <div className="flex items-start gap-3">
          <div
            className={`font-[family-name:'JetBrains_Mono',monospace] w-9 h-9 rounded-[3px] border flex items-center justify-center text-sm flex-shrink-0 ${
              medal?.cls ||
              "bg-[rgba(95,255,96,0.05)] text-[rgba(95,255,96,0.45)] border-[rgba(95,255,96,0.15)]"
            }`}
          >
            {medal ? medal.emoji : `#${rank}`}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              {isTeam ? (
                <Users
                  size={12}
                  className="text-[rgba(95,255,96,0.45)] flex-shrink-0"
                />
              ) : (
                <User
                  size={12}
                  className="text-[rgba(95,255,96,0.45)] flex-shrink-0"
                />
              )}
              <h3 className="font-[family-name:'Syne',sans-serif] font-extrabold text-white text-base tracking-tight">
                {name}
              </h3>
            </div>
            <p className="font-[family-name:'JetBrains_Mono',monospace] text-[0.55rem] tracking-[0.07em] text-[rgba(180,220,180,0.35)]">
              {isTeam ? "Team Submission" : "Individual Submission"}
            </p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="font-[family-name:'Syne',sans-serif] font-extrabold text-[#5fff60] text-base">
                {submission.voteCount || 0}
              </span>
              <span className="font-[family-name:'JetBrains_Mono',monospace] text-[0.5rem] tracking-[0.1em] uppercase text-[rgba(95,255,96,0.35)]">
                {submission.voteCount === 1 ? "vote" : "votes"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleVote}
          disabled={isVotingClosed}
          className={`
            font-[family-name:'JetBrains_Mono',monospace]
            inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.08em] uppercase
            px-3 py-2 rounded-[3px] border transition-all duration-150
            ${
              isVotingClosed
                ? "bg-transparent border-[rgba(95,255,96,0.07)] text-[rgba(95,255,96,0.2)] cursor-not-allowed"
                : isLiked
                ? "bg-[rgba(95,255,96,0.12)] border-[rgba(95,255,96,0.35)] text-[#5fff60] cursor-pointer"
                : "bg-transparent border-[rgba(95,255,96,0.15)] text-[rgba(95,255,96,0.5)] cursor-pointer hover:bg-[rgba(95,255,96,0.08)] hover:border-[rgba(95,255,96,0.3)] hover:text-[#5fff60]"
            }
          `}
        >
          <ThumbsUp size={12} className={isLiked ? "fill-current" : ""} />
          {isLiked ? "Liked" : "Like"}
        </button>
      </div>

      {hasAssets && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 cursor-pointer group hover:bg-[rgba(95,255,96,0.03)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {submission.repoUrl?.length > 0 && (
                  <AssetPill color="blue" label="URL" />
                )}
                {submission.docs?.length > 0 && (
                  <AssetPill color="violet" label="Docs" />
                )}
                {submission.images?.length > 0 && (
                  <AssetPill color="amber" label="Images" />
                )}
                {submission.videos?.length > 0 && (
                  <AssetPill color="pink" label="Video" />
                )}
              </div>
              <span className="font-[family-name:'JetBrains_Mono',monospace] text-[0.58rem] text-[rgba(180,220,180,0.3)] tracking-[0.04em]">
                View assets
              </span>
            </div>
            {expanded ? (
              <ChevronUp
                size={13}
                className="text-[rgba(95,255,96,0.4)] group-hover:text-[#5fff60] transition-colors"
              />
            ) : (
              <ChevronDown
                size={13}
                className="text-[rgba(95,255,96,0.4)] group-hover:text-[#5fff60] transition-colors"
              />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-5 pb-5 pt-4 flex flex-col gap-4 border-t border-[rgba(95,255,96,0.07)]">
              {submission.repoUrl?.length > 0 && (
                <AssetGroup
                  icon={ClipboardList}
                  label="Submission"
                  color="blue"
                >
                  <div className="flex flex-wrap gap-2">
                    {submission.repoUrl.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onOpenSubmission(submission._id)}
                        className="font-[family-name:'JetBrains_Mono',monospace] inline-flex items-center gap-1.5 text-[0.62rem] tracking-[0.04em] px-3 py-1.5 bg-[rgba(96,200,255,0.06)] hover:bg-[rgba(96,200,255,0.12)] border border-[rgba(96,200,255,0.2)] hover:border-[rgba(96,200,255,0.38)] rounded-[2px] text-[rgba(96,200,255,0.7)] hover:text-[rgba(96,200,255,1)] transition-all"
                      >
                        <ExternalLink size={11} />
                        {submission.repoUrl.length > 1
                          ? `Submission ${i + 1}`
                          : "View Submission"}
                      </a>
                    ))}
                  </div>
                </AssetGroup>
              )}

              {submission.docs?.length > 0 && (
                <AssetGroup
                  icon={FileText}
                  label="Documentation"
                  color="violet"
                >
                  <div className="flex flex-wrap gap-2">
                    {submission.docs.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onOpenSubmission(submission._id)}
                        className="font-[family-name:'JetBrains_Mono',monospace] inline-flex items-center gap-1.5 text-[0.62rem] tracking-[0.04em] px-3 py-1.5 bg-[rgba(167,139,250,0.06)] hover:bg-[rgba(167,139,250,0.12)] border border-[rgba(167,139,250,0.2)] hover:border-[rgba(167,139,250,0.38)] rounded-[2px] text-[rgba(167,139,250,0.7)] hover:text-[rgba(167,139,250,1)] transition-all"
                      >
                        <FileText size={11} />
                        {doc.original_filename || `Document ${i + 1}`}
                      </a>
                    ))}
                  </div>
                </AssetGroup>
              )}

              {submission.images?.length > 0 && (
                <AssetGroup
                  icon={ImageIcon}
                  label={`Images (${submission.images.length})`}
                  color="amber"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {submission.images.map((img, i) => (
                      <a
                        key={i}
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onOpenSubmission(submission._id)}
                        className="block rounded-[2px] overflow-hidden border border-[rgba(255,184,77,0.15)] hover:border-[rgba(255,184,77,0.38)] transition-all"
                      >
                        <img
                          src={img.url}
                          alt={`Screenshot ${i + 1}`}
                          className="w-full h-24 object-cover hover:opacity-80 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </AssetGroup>
              )}

              {submission.videos?.length > 0 && (
                <AssetGroup icon={Video} label="Videos" color="pink">
                  <div className="flex flex-wrap gap-2">
                    {submission.videos.map((vid, i) => (
                      <a
                        key={i}
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-[family-name:'JetBrains_Mono',monospace] inline-flex items-center gap-1.5 text-[0.62rem] tracking-[0.04em] px-3 py-1.5 bg-[rgba(255,100,150,0.06)] hover:bg-[rgba(255,100,150,0.12)] border border-[rgba(255,100,150,0.2)] hover:border-[rgba(255,100,150,0.38)] rounded-[2px] text-[rgba(255,100,150,0.7)] hover:text-[rgba(255,100,150,1)] transition-all"
                      >
                        <Video size={11} />
                        {vid.original_filename || `Video ${i + 1}`}
                      </a>
                    ))}
                  </div>
                </AssetGroup>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const btnBase =
    "font-[family-name:'JetBrains_Mono',monospace] text-[0.6rem] tracking-[0.06em] uppercase border rounded-[3px] transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} flex items-center gap-1 px-3 py-2 border-[rgba(95,255,96,0.15)] text-[rgba(95,255,96,0.45)] hover:border-[rgba(95,255,96,0.35)] hover:text-[#5fff60]`}
      >
        <ChevronDown size={11} className="rotate-90" /> Prev
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`e-${i}`}
            className="font-[family-name:'JetBrains_Mono',monospace] text-[0.6rem] text-[rgba(95,255,96,0.25)] px-1"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} w-8 h-8 flex items-center justify-center
              ${
                page === currentPage
                  ? "bg-[rgba(95,255,96,0.12)] border-[rgba(95,255,96,0.35)] text-[#5fff60]"
                  : "border-[rgba(95,255,96,0.12)] text-[rgba(95,255,96,0.4)] hover:border-[rgba(95,255,96,0.28)] hover:text-[#5fff60]"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} flex items-center gap-1 px-3 py-2 border-[rgba(95,255,96,0.15)] text-[rgba(95,255,96,0.45)] hover:border-[rgba(95,255,96,0.35)] hover:text-[#5fff60]`}
      >
        Next <ChevronDown size={11} className="-rotate-90" />
      </button>
    </div>
  );
};

const Upvote = () => {
  const { id: hackathonId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likedSubmissions, setLikedSubmissions] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [openedSubmissions, setOpenedSubmissions] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isVotingClosed, setIsVotingClosed] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    fetchSubmissions();
    if (localStorage.getItem("token")) fetchUserVotes();
  }, [hackathonId]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (data?.votingDate && new Date() > new Date(data.votingDate))
          setIsVotingClosed(true);
      })
      .catch(console.error);
  }, [hackathonId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const r = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/votes/hackathon/${hackathonId}`
      );
      if (!r.ok) throw new Error();
      const data = await r.json();
      setSubmissions(data.submissions || []);
    } catch {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const r = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/votes/user/${hackathonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (r.ok) {
        const d = await r.json();
        setLikedSubmissions(new Set(d.votedSubmissions || []));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (submissionId) => {
    if (!isLoggedIn) {
      toast.info("Please log in to vote.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const r = await fetch(
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
      if (!r.ok) throw new Error();
      const data = await r.json();
      setLikedSubmissions((prev) => {
        const n = new Set(prev);
        data.voted ? n.add(submissionId) : n.delete(submissionId);
        return n;
      });
      setSubmissions((prev) =>
        prev.map((s) =>
          s._id === submissionId
            ? {
                ...s,
                voteCount: data.voted
                  ? (s.voteCount || 0) + 1
                  : Math.max((s.voteCount || 0) - 1, 0),
              }
            : s
        )
      );
    } catch {
      toast.error("Failed to update vote.");
    }
  };

  const sorted = [...submissions]
    .filter((s) =>
      (s.team?.name || s.participant?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[rgba(95,255,96,0.15)] border-t-[#5fff60] animate-spin" />
        <p className="font-[family-name:'JetBrains_Mono',monospace] text-[0.62rem] tracking-[0.08em] uppercase text-[rgba(180,220,180,0.35)]">
          Loading submissions…
        </p>
      </div>
    );

  if (submissions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="relative w-12 h-12 rounded-[3px] bg-[rgba(95,255,96,0.05)] border border-[rgba(95,255,96,0.12)] flex items-center justify-center">
          <span className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t-2 border-l-2 border-[rgba(95,255,96,0.3)]" />
          <FileText size={20} className="text-[rgba(95,255,96,0.2)]" />
        </div>
        <p className="font-[family-name:'Syne',sans-serif] font-extrabold text-white text-sm tracking-tight">
          No submissions yet
        </p>
        <p className="font-[family-name:'JetBrains_Mono',monospace] text-[0.62rem] text-[rgba(180,220,180,0.35)]">
          Check back once the hackathon is underway.
        </p>
      </div>
    );

  return (
    <>
      <div className="font-[family-name:'JetBrains_Mono',monospace]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="font-[family-name:'Syne',sans-serif] font-extrabold text-white text-2xl tracking-tight">
              Community Submissions
            </h2>
            <p className="font-[family-name:'JetBrains_Mono',monospace] text-[0.62rem] text-[rgba(180,220,180,0.4)] mt-1 tracking-[0.04em]">
              {submissions.length}{" "}
              {submissions.length === 1 ? "submission" : "submissions"} ·{" "}
              {!isLoggedIn ? (
                <button
                  onClick={() => navigate("/account/login")}
                  className="text-[#5fff60] hover:text-[#7fff80] underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Log in to vote
                </button>
              ) : (
                "Vote for your favourites"
              )}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[0.55rem] tracking-[0.08em] uppercase text-[rgba(180,220,180,0.3)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5fff60]" />
              Liked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgba(95,255,96,0.2)]" />
              Not voted
            </span>
          </div>
        </div>

        {isVotingClosed && (
          <div className="mb-5 relative bg-[rgba(255,60,60,0.06)] border border-[rgba(255,60,60,0.25)] rounded-[4px] px-5 py-4 flex items-center justify-between">
            <span className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t-2 border-l-2 border-[rgba(255,60,60,0.4)]" />
            <div>
              <p className="font-[family-name:'Syne',sans-serif] font-extrabold text-[#ff9090] text-sm">
                Voting has ended
              </p>
              <p className="font-[family-name:'JetBrains_Mono',monospace] text-[0.6rem] text-[rgba(255,150,150,0.45)] mt-0.5">
                The community voting period is now closed.
              </p>
            </div>
            <span className="font-[family-name:'JetBrains_Mono',monospace] text-[0.55rem] tracking-[0.1em] uppercase px-2 py-1 rounded-[2px] bg-[rgba(255,60,60,0.1)] border border-[rgba(255,60,60,0.25)] text-[rgba(255,100,100,0.7)]">
              Closed
            </span>
          </div>
        )}

        <div className="mb-5">
          <div className="relative max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(95,255,96,0.35)] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by team or name…"
              className="font-[family-name:'JetBrains_Mono',monospace] w-full pl-9 pr-9 py-2 text-[0.65rem] tracking-[0.03em] bg-[rgba(10,12,10,0.7)] border border-[rgba(95,255,96,0.12)] rounded-[3px] text-[#e8ffe8] placeholder-[rgba(95,255,96,0.22)] focus:outline-none focus:border-[rgba(95,255,96,0.38)] focus:shadow-[0_0_0_2px_rgba(95,255,96,0.05)] transition-all [color-scheme:dark]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(95,255,96,0.35)] hover:text-[#5fff60] transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="font-[family-name:'JetBrains_Mono',monospace] text-[0.58rem] text-[rgba(180,220,180,0.35)] mt-1.5">
              <span className="text-[#5fff60]">{sorted.length}</span>{" "}
              {sorted.length === 1 ? "result" : "results"} for "{searchQuery}"
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mb-4">
            <p className="font-[family-name:'JetBrains_Mono',monospace] text-[0.58rem] text-[rgba(180,220,180,0.35)]">
              Showing{" "}
              <span className="text-[rgba(180,220,180,0.65)]">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, sorted.length)}
              </span>{" "}
              of{" "}
              <span className="text-[rgba(180,220,180,0.65)]">
                {sorted.length}
              </span>
            </p>
            <p className="font-[family-name:'JetBrains_Mono',monospace] text-[0.58rem] text-[rgba(180,220,180,0.35)]">
              Page{" "}
              <span className="text-[rgba(180,220,180,0.65)]">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="text-[rgba(180,220,180,0.65)]">
                {totalPages}
              </span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {paginated.map((sub, i) => (
            <SubmissionCard
              key={sub._id}
              submission={sub}
              isVotingClosed={isVotingClosed}
              canVote={openedSubmissions.has(sub._id)}
              onOpenSubmission={(id) =>
                setOpenedSubmissions((prev) => new Set(prev).add(id))
              }
              isLiked={likedSubmissions.has(sub._id)}
              onLike={handleLike}
              rank={(currentPage - 1) * PAGE_SIZE + i + 1}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default Upvote;
