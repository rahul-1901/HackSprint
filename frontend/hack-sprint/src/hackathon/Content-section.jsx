import React from "react";
import { useState, useEffect } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Clock, Code, Users, ChevronDown, ChevronUp } from "lucide-react";
import ChatInterface from "../components/Chat/ChatInterface";
import Upvote from "./Upvote";
import Gallery from "./Gallery";


export const ContentSection = ({ activeSection, hackathon }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      weekday: "short", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true
    });

  const SectionCard = ({ children, className = "" }) => (
    <div
      className={`bg-gray-900/70 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-400/30 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );

  const SectionHeader = ({ children }) => (
    <h3 className="text-3xl font-bold text-white mb-6">{children}</h3>
  );

  // Component for sections with standard text content
  const SimpleContentSection = ({ title, content }) => (
    <div>
      <SectionHeader>{title}</SectionHeader>
      <SectionCard>
        <div className="text-gray-300 whitespace-pre-line leading-relaxed prose max-w-none">
          {content || `No ${title.toLowerCase()} information provided.`}
        </div>
      </SectionCard>
    </div>
  );

  const SimpleContentSectionRef = ({ title, content }) => (
    <div>
      <SectionHeader>{title}</SectionHeader>
      <SectionCard>
        <div className="text-gray-300 whitespace-pre-line leading-relaxed prose max-w-none">
          {content ? (
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {content}
            </a>
          ) : (
            `No ${title.toLowerCase()} information provided.`
          )}
        </div>
      </SectionCard>
    </div>
  );

  // NEW: Component specifically for sections with array content to display as a list
  const ListContentSection = ({ title, content }) => {
    const isContentAvailable = Array.isArray(content) && content.length > 0;
    return (
      <div>
        <SectionHeader>{title}</SectionHeader>
        <SectionCard>
          {isContentAvailable ? (
            <ul className="list-disc list-inside space-y-3 text-gray-300 prose max-w-none">
              {content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              {`No ${title.toLowerCase()} information provided.`}
            </p>
          )}
        </SectionCard>
      </div>
    );
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <SectionCard>
              <h4 className="text-xl font-bold text-white mb-4">Description</h4>
              <p className="text-gray-300 leading-relaxed prose max-w-none">{hackathon.description}</p>
            </SectionCard>
            <SectionCard>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" /> Event Timeline
              </h4>

              <div className="relative pl-6 space-y-8 border-l-2 border-green-500/20">
                <div className="relative">
                  <div>
                    <div className="font-bold text-white">Registration Opens</div>
                    <div className="text-gray-400 text-sm">{formatDateTime(hackathon.startDate)}</div>
                  </div>
                </div>

                <div className="relative">
                  <div>
                    <div className="font-bold text-white">Registration Closes</div>
                    <div className="text-gray-400 text-sm">{formatDateTime(hackathon.endDate)}</div>
                  </div>
                </div>

                <div className="relative">
                  <div>
                    <div className="font-bold text-white">Submission Opens</div>
                    <div className="text-gray-400 text-sm">{formatDateTime(hackathon.submissionStartDate)}</div>
                  </div>
                </div>

                <div className="relative">
                  <div>
                    <div className="font-bold text-white">Submission Deadline</div>
                    <div className="text-gray-400 text-sm">{formatDateTime(hackathon.submissionEndDate)}</div>
                  </div>
                </div>
              </div>
            </SectionCard>
            <div className="grid md:grid-cols-2 gap-6">
              <SectionCard>
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-400" /> Difficulty
                </h4>
                <Badge className="bg-green-500/20 text-green-300 font-medium border-green-500/30 border">
                  {hackathon.difficulty}
                </Badge>
              </SectionCard>
              <SectionCard>
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" /> Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hackathon.category?.map((cat, i) => (
                    <Badge key={i} className="bg-green-500/20 text-green-300 font-medium border-green-500/30 border">{cat}</Badge>
                  ))}
                </div>
              </SectionCard>
            </div>
            <SectionCard>
              <h4 className="text-xl font-bold text-white mb-4">Recommended Tech Stack</h4>
              <div className="flex flex-wrap gap-3">
                {hackathon.techStackUsed?.map((tech, i) => (
                  <span key={i} className="bg-gray-800 text-gray-300 border border-green-500/20 px-3 py-1.5 rounded-lg text-sm hover:bg-green-500/10 hover:text-white transition-colors duration-200">
                    {tech}
                  </span>
                ))}
              </div>
            </SectionCard>
          </div>
        );

      // --- UPDATED to use ListContentSection for array data ---
      case "themes":
        return <ListContentSection title="Themes" content={hackathon.themes} />;
      case "submission-guide":
        return <ListContentSection title="Submission Guide" content={hackathon.projectSubmission} />;
      case "judging":
        return <ListContentSection title="Judging Criteria" content={hackathon.evaluationCriteria} />;
      case "rules":
        return <ListContentSection title="Rules & Guidelines" content={hackathon.TandCforHackathon} />;

      // --- These sections still use SimpleContentSection for string data ---
      case "prizes":
        const totalPrize = (hackathon.prizeMoney1 || 0) +
          (hackathon.prizeMoney2 || 0) +
          (hackathon.prizeMoney3 || 0);

        const prizeContent = totalPrize > 0 ? (
          <div className="space-y-2 text-gray-300">
            <p>
              The total prize pool for this event is
              <span className="ml-1 text-green-400 font-semibold">
                ₹{totalPrize.toLocaleString("en-IN")}
              </span>.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium text-white">1st Prize:</span>{" "}
                ₹{(hackathon.prizeMoney1 || 0).toLocaleString("en-IN")}
              </li>
              <li>
                <span className="font-medium text-white">2nd Prize:</span>{" "}
                ₹{(hackathon.prizeMoney2 || 0).toLocaleString("en-IN")}
              </li>
              <li>
                <span className="font-medium text-white">3rd Prize:</span>{" "}
                ₹{(hackathon.prizeMoney3 || 0).toLocaleString("en-IN")}
              </li>
            </ul>
          </div>
        ) : null;

        return <SimpleContentSection title="Prizes" content={prizeContent} />;
      case "about":
        return <SimpleContentSection title="About" content={hackathon.aboutUs} />;
      case "refMaterial":
        return <SimpleContentSectionRef title="Reference Material" content={hackathon.refMaterial} />;

      case "faqs":
        const rawFaqs = hackathon.FAQs || [];
        const faqs = [];
        for (let i = 0; i < rawFaqs.length; i += 2) {
          if (rawFaqs[i + 1]) {
            faqs.push({
              question: rawFaqs[i],
              answer: rawFaqs[i + 1]
            });
          }
        }
        return (
          <div>
            <SectionHeader>Frequently Asked Questions</SectionHeader>
            <div className="space-y-4">
              {faqs.length > 0 ? (
                faqs.map((faq, idx) => {
                  const isExpanded = expandedFAQ === idx;
                  return (
                    <div key={idx} className="border border-green-500/20 rounded-lg bg-gray-900/70 overflow-hidden transition-all duration-300">
                      <button
                        onClick={() => toggleFAQ(idx)}
                        className="w-full p-5 text-left flex items-center justify-between group hover:bg-green-500/5 cursor-pointer"
                      >
                        <p className="font-semibold text-lg text-white pr-4">{faq.question}</p>
                        <div className="text-green-400 flex-shrink-0 transition-transform duration-300">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-green-500/20 animate-fade-in">
                          <p className="text-gray-300 leading-relaxed pt-4 prose max-w-none">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <SectionCard><p className="text-gray-400">No FAQs provided for this event.</p></SectionCard>
              )}
            </div>
          </div>
        );

      case "discussion":
        return (
          <div>
            {/* <SectionHeader>Community Discussion</SectionHeader> */}
            <ChatInterface hackathonId={hackathon._id} />
          </div>
        );

      case "upvote":
        return (
          <div>
            <Upvote />
          </div>
        );

      case "gallery":
        return (
          <div>
            <SectionHeader>Event Gallery</SectionHeader>
            <Gallery />
          </div>
        );

      case "results":
        return <ResultsSection hackathonId={hackathon._id} />;

      default:
        return (
          <div className="text-center py-12">
            <p className="text-white font-bold">Section not found.</p>
          </div>
        );
    }
  };

  const ResultsSection = ({ hackathonId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}/results`
        );
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError("Results not announced yet or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [hackathonId]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-gray-800/50 border border-gray-700/40 overflow-hidden relative">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>
      ))}
    </div>
  );

  // ── Error / Empty ──────────────────────────────────────────────────────────
  if (error || results.length === 0) return (
    <SectionCard>
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-gray-400 font-medium">
          {error || "No results announced yet."}
        </p>
        <p className="text-gray-600 text-sm">Check back once judging is complete.</p>
      </div>
    </SectionCard>
  );

  // Podium config
  const podium = [
    {
      rank: 1,
      label: "1st Place",
      emoji: "🥇",
      ring: "ring-amber-400/40",
      bg: "from-amber-500/10 to-amber-600/5",
      border: "border-amber-500/30",
      pointColor: "text-amber-400",
      badgeBg: "bg-amber-400/15 text-amber-300 border-amber-400/30",
      barColor: "bg-amber-400",
      glow: "shadow-amber-500/10",
    },
    {
      rank: 2,
      label: "2nd Place",
      emoji: "🥈",
      ring: "ring-slate-400/30",
      bg: "from-slate-500/8 to-slate-600/4",
      border: "border-slate-500/25",
      pointColor: "text-slate-300",
      badgeBg: "bg-slate-400/15 text-slate-300 border-slate-400/30",
      barColor: "bg-slate-400",
      glow: "shadow-slate-500/10",
    },
    {
      rank: 3,
      label: "3rd Place",
      emoji: "🥉",
      ring: "ring-orange-700/30",
      bg: "from-orange-700/8 to-orange-800/4",
      border: "border-orange-700/25",
      pointColor: "text-orange-400",
      badgeBg: "bg-orange-700/15 text-orange-300 border-orange-700/30",
      barColor: "bg-orange-600",
      glow: "shadow-orange-700/10",
    },
  ];

  const maxPoints = Math.max(...results.map((r) => r.hackathonPoints || 0), 1);

  return (
    <div>
      {/* Shimmer keyframe (injected once) */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
          animation: shimmer 1.6s infinite;
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .result-row { animation: countUp 0.4s ease both; }
      `}</style>

      <SectionHeader>Hackathon Results</SectionHeader>

      {/* ── Top 3 podium cards (only if ≥1 result) ─────────────────────── */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {results.slice(0, 3).map((submission, index) => {
            const p = podium[index];
            const name = submission.team
              ? submission.team.name
              : submission.participant?.name || "Unknown";
            const isTeam = !!submission.team;

            return (
              <div
                key={submission._id}
                className={`relative group rounded-2xl border bg-gradient-to-br ${p.bg} ${p.border} p-5 flex flex-col gap-3 hover:shadow-xl ${p.glow} transition-all duration-300 hover:-translate-y-0.5`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Rank badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${p.badgeBg}`}>
                    {p.label}
                  </span>
                  <span className="text-2xl">{p.emoji}</span>
                </div>

                {/* Name */}
                <div>
                  <h4 className="font-bold text-white text-base leading-tight">{name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isTeam ? "Team" : "Individual"}
                  </p>
                </div>

                {/* Points + bar */}
                <div>
                  <div className="flex items-end justify-between mb-1.5">
                    <span className={`text-2xl font-black tabular-nums ${p.pointColor}`}>
                      {submission.hackathonPoints}
                    </span>
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">pts</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-gray-700/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.barColor} transition-all duration-700`}
                      style={{ width: `${(submission.hackathonPoints / maxPoints) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Remaining results as a ranked list ─────────────────────────── */}
      {results.length > 3 && (
        <div className="bg-gray-800/30 border border-gray-700/40 rounded-2xl overflow-hidden divide-y divide-gray-700/30">
          {/* Table header */}
          <div className="grid grid-cols-[2rem_1fr_auto] gap-4 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            <span>#</span>
            <span>Participant</span>
            <span>Score</span>
          </div>

          {results.slice(3).map((submission, i) => {
            const rank = i + 4;
            const name = submission.team
              ? submission.team.name
              : submission.participant?.name || "Unknown";
            const isTeam = !!submission.team;

            return (
              <div
                key={submission._id}
                className="result-row grid grid-cols-[2rem_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-gray-700/20 transition-colors duration-150"
                style={{ animationDelay: `${(i + 3) * 60}ms` }}
              >
                {/* Rank */}
                <span className="text-sm font-mono text-gray-500 tabular-nums">
                  {String(rank).padStart(2, "0")}
                </span>

                {/* Identity */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-700/60 border border-gray-600/40 flex items-center justify-center shrink-0 text-xs font-bold text-gray-400">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-200 truncate">{name}</p>
                    <p className="text-[11px] text-gray-600">
                      {isTeam ? "Team" : "Individual"}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <span className="text-sm font-bold text-green-400 tabular-nums">
                    {submission.hackathonPoints}
                  </span>
                  <span className="text-[10px] text-gray-600 ml-1">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-[11px] text-gray-600 mt-4 tracking-wide">
        Final standings · Ranked by judge score
      </p>
    </div>
  );
};

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">{renderContent()}</div>
    </main>
  );
};