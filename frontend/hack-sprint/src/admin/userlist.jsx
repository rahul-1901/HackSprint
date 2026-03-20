import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Shield,
  Images,
  Trophy,
  X,
} from "lucide-react";
import { getAdminDetails, getAdminHackathonDetail } from "../backendApis/api";
import axios from "axios";
import AdminGalleryManager from "./AdminGalleryManager";

const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);

const FilterButtons = ({ value, onChange }) => (
  <div className="flex gap-2 mb-4">
    {["all", "submitted", "not_submitted"].map((type) => (
      <button
        key={type}
        onClick={() => onChange(type)}
        className={`px-3 py-1.5 rounded-lg text-sm capitalize transition cursor-pointer ${
          value === type
            ? "bg-green-500 text-black font-semibold"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        {type.replace("_", " ")}
      </button>
    ))}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center p-8 text-gray-500">
    <Users size={48} className="mx-auto mb-4 opacity-40" />
    <p>{message}</p>
  </div>
);

const SubmissionBadge = ({ submitted }) =>
  submitted ? (
    <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
      <CheckCircle size={16} /> Submitted
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-sm">
      <XCircle size={16} /> Not Submitted
    </span>
  );

const HackathonUsersPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [individualParticipants, setIndividualParticipants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [result, setResult] = useState(null);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [activeTab, setActiveTab] = useState("participants");
  const [teamFilter, setTeamFilter] = useState("all");
  const [participantFilter, setParticipantFilter] = useState("all");

  const hasTeamSubmitted = (team) => !!team.submission;
  const hasUserSubmitted = (participant) => !!participant.submission;

  const filteredTeams = teams.filter((team) => {
    const submitted = hasTeamSubmitted(team);
    if (teamFilter === "submitted") return submitted;
    if (teamFilter === "not_submitted") return !submitted;
    return true;
  });

  const filteredParticipants = individualParticipants.filter((p) => {
    const submitted = hasUserSubmitted(p);
    if (participantFilter === "submitted") return submitted;
    if (participantFilter === "not_submitted") return !submitted;
    return true;
  });

  const navigateToSubmission = (hasSubmitted, path) => {
    if (hasSubmitted) navigate(path);
  };

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios(
          `${import.meta.env.VITE_API_BASE_URL}/api/submit/hackathon/${slug}`
        );
        setResult(response.data);
      } catch {
        // silent
      }
    };
    fetchResult();
  }, [slug]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getAdminDetails();
        setAdminData(response.data.admin);
      } catch (error) {
        console.error("Auth error, redirecting...", error);
        navigate("/adminlogin");
      }
    };
    fetchAdminData();
  }, [navigate]);

  useEffect(() => {
    if (!adminData || !slug) return;
    const fetchHackathonData = async () => {
      try {
        const response = await getAdminHackathonDetail({
          adminId: adminData.id,
          hackathonId: slug,
        });
        const { hackathon, participantsWithoutTeam, teams } = response.data;
        setHackathon(hackathon);
        setIndividualParticipants(participantsWithoutTeam);
        setTeams(teams);
      } catch (error) {
        console.error("Failed to fetch hackathon details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathonData();
  }, [adminData, slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading participants...</p>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Hackathon Not Found</h1>
          <Link to="/admin" className="text-green-400 hover:underline">
            Go back to the dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden mb-15">
      <GridBackground />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="my-5">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 group w-fit"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <p className="text-green-400 text-sm font-semibold tracking-wide uppercase">
            Hackathon Management
          </p>
          <h1 className="text-4xl sm:text-5xl ZaptronFont -tracking-tight text-green-400 md:text-6xl font-extrabold leading-tight mt-2">
            {hackathon.title}
          </h1>

          {/* Tabs */}
          <div className="flex gap-3 mt-6 mb-4 flex-wrap">
            <button
              onClick={() => setActiveTab("participants")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "participants"
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700"
              }`}
            >
              <Users className="w-5 h-5" />
              Participants
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700"
              }`}
            >
              <Images className="w-5 h-5" />
              Gallery
            </button>
          </div>

          {activeTab === "participants" && (
            <button
              onClick={() => setShowScoreboard(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition"
            >
              <Trophy className="w-4 h-4" />
              View Results
            </button>
          )}
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {activeTab === "participants" ? (
            <>
              {/* Teams Section */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-3">
                  <Shield size={28} />
                  Teams ({teams.length})
                </h2>

                <FilterButtons value={teamFilter} onChange={setTeamFilter} />

                <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-800 sticky top-0 z-10">
                        <tr>
                          <th className="p-4 font-semibold text-gray-300">
                            Team Name
                          </th>
                          <th className="p-4 font-semibold text-gray-300">
                            Members
                          </th>
                          <th className="p-4 font-semibold text-gray-300 text-center">
                            Submission Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredTeams.map((team) => {
                          const submitted = hasTeamSubmitted(team);
                          return (
                            <tr
                              key={team._id}
                              onClick={() =>
                                navigateToSubmission(
                                  submitted,
                                  `/hackathon/${slug}/submission/${team._id}`
                                )
                              }
                              className={`transition-colors ${
                                submitted
                                  ? "hover:bg-gray-800/40 cursor-pointer"
                                  : ""
                              }`}
                            >
                              <td className="p-4 font-medium text-white">
                                {team.name}
                              </td>
                              <td className="p-4 text-gray-400">
                                {team.leader && (
                                  <div className="flex items-center gap-2">
                                    <Shield
                                      size={14}
                                      className="text-yellow-400"
                                    />
                                    {team.leader.name} (Leader)
                                  </div>
                                )}
                                {team.members.map((member) => (
                                  <div key={member._id} className="ml-6">
                                    {member.name}
                                  </div>
                                ))}
                              </td>
                              <td className="p-4 text-center">
                                <SubmissionBadge submitted={submitted} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {filteredTeams.length === 0 && (
                      <EmptyState message="No teams match this filter." />
                    )}
                  </div>
                </div>
              </div>

              {/* Individual Participants Section */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-3">
                  <Users size={28} />
                  Individual Participants ({individualParticipants.length})
                </h2>

                <FilterButtons
                  value={participantFilter}
                  onChange={setParticipantFilter}
                />

                <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-800 sticky top-0 z-10">
                        <tr>
                          <th className="p-4 font-semibold text-gray-300">
                            Name
                          </th>
                          <th className="p-4 font-semibold text-gray-300">
                            Email
                          </th>
                          <th className="p-4 font-semibold text-gray-300 text-center">
                            Submission Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredParticipants.map((participant) => {
                          const submitted = hasUserSubmitted(participant);
                          return (
                            <tr
                              key={participant._id}
                              onClick={() =>
                                navigateToSubmission(
                                  submitted,
                                  `/hackathon/${slug}/submission/${participant.user?._id}`
                                )
                              }
                              className={`transition-colors ${
                                submitted
                                  ? "hover:bg-gray-800/40 cursor-pointer"
                                  : ""
                              }`}
                            >
                              <td className="p-4 font-medium text-white">
                                {participant.user?.name || "N/A"}
                              </td>
                              <td className="p-4 text-gray-400">
                                {participant.user?.email || "N/A"}
                              </td>
                              <td className="p-4 text-center">
                                <SubmissionBadge submitted={submitted} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {filteredParticipants.length === 0 && (
                      <EmptyState message="No participants match this filter." />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
              <AdminGalleryManager hackathonId={slug} />
            </div>
          )}
        </main>
      </div>

      {/* Scoreboard Modal */}
      {showScoreboard && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5"
          onClick={(e) =>
            e.target === e.currentTarget && setShowScoreboard(false)
          }
        >
          <div className="bg-gray-800 text-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative border border-gray-700">
            <button
              onClick={() => setShowScoreboard(false)}
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-green-400">Scoreboard</h2>
            </div>

            {result?.totalSubmissions > 0 ? (
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {result.submissions?.map((sub, idx) => {
                  const name =
                    sub.team?.name || sub.participant?.name || "Unknown";
                  const points = sub.hackathonPoints || 0;

                  const rankStyles = {
                    0: {
                      rank: "text-yellow-400",
                      bg: "bg-yellow-500/10 border border-yellow-400/30",
                    },
                    1: {
                      rank: "text-gray-300",
                      bg: "bg-gray-400/10 border border-gray-300/20",
                    },
                    2: {
                      rank: "text-orange-400",
                      bg: "bg-orange-500/10 border border-orange-400/20",
                    },
                  };

                  const style = rankStyles[idx] || {
                    rank: "text-gray-400",
                    bg: "bg-gray-700/50",
                  };

                  return (
                    <li
                      key={sub._id || idx}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-gray-600/40 ${style.bg}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-sm w-6 ${style.rank}`}>
                          #{idx + 1}
                        </span>
                        <span className="text-sm md:text-base font-medium">
                          {name}
                        </span>
                      </div>
                      <span className="text-green-400 font-semibold text-sm md:text-base">
                        {points} pts
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No submissions yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonUsersPage;
