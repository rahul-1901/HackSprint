import { useState, useEffect } from "react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../backendApis/api";
import LoginForm from "./LoginForm";
import SubmissionForm from "./SubmissionForm";

export const HeroSection = ({
  title,
  subTitle,
  isActive,
  startDate,
  endDate,
  participantCount = 0,
  prizeMoney1 = 0,
  prizeMoney2 = 0,
  prizeMoney3 = 0,
  imageUrl = "/assets/hackathon-banner.png",
  hackathonId,
  submissionStartDate,
  submissionEndDate
}) => {
  const [imageError, setImageError] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [registrationInfo, setRegistrationInfo] = useState(false);
  const [leaderButton, setLeaderButton] = useState(false);
  const [leaderValue, setLeaderValue] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [teamData, setTeamData] = useState(null);

  const navigate = useNavigate();

  const isWithinRegistrationPeriod = () => {
    const now = new Date();
    return (
      startDate &&
      endDate &&
      now >= new Date(startDate) &&
      now <= new Date(endDate)
    );
  };

  useEffect(() => {
    const fetchTeamData = async (teamId, currentUserId) => {
      try {
        if (!teamId) return; // <-- safeguard

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/team/${teamId}`
        );
        if (!res.ok) throw new Error("Failed to fetch team");
        const data = await res.json();
        const team = data.team;

        console.log(team)
        setTeamData(team)

        if (team?.hackathon?._id && String(team.hackathon._id) === String(hackathonId)) {
          const member = team.members?.some(
            (m) => String(m._id) === String(currentUserId)
          );
          setIsTeamMember(member || false);
        } else {
          setIsTeamMember(false);
        }
      } catch (err) {
        console.error("Team fetch error:", err.message);
        setIsTeamMember(false);
      }
    };

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await getDashboard();
        const fetchedUserData = res.data.userData;
        // console.log(fetchedUserData)
        setUserData(fetchedUserData);
        setIsVerified(fetchedUserData?.isVerified || false);

        const registered = Array.isArray(fetchedUserData.registeredHackathons)
          ? fetchedUserData.registeredHackathons.some(
            (id) => String(id) === String(hackathonId)
          )
          : false;
        setRegistrationInfo(registered);

        const leader = fetchedUserData.leaderOfHackathons?.some(
          (id) => String(id) === String(hackathonId)
        );
        setIsLeader(leader || false);
        setLeaderButton(leader || false);

        // ✅ Always send teamId here
        if (fetchedUserData?.team) {
          await fetchTeamData(fetchedUserData.team, fetchedUserData._id);
        } else {
          setIsTeamMember(false);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
        setUserData(null);
        setIsVerified(false);
        setRegistrationInfo(false);
        setIsLeader(false);
        setIsTeamMember(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
    fetchUserData();
  }, [hackathonId]);

  // useEffect(() => {
  //   console.log("Team Data Updated:", teamData?.code);
  // }, [teamData]);

  useEffect(() => {
    if (teamData?.code) {
      setLeaderValue(teamData.code);
    } else {
      setLeaderValue(localStorage.getItem("teamDetails_code"))
    }
  }, [teamData])


  const handleRegister = () => {
    if (isVerified) navigate(`/hackathon/RegistrationForm/${hackathonId}`);
    else setShowLoginModal(true);
  };

  const handleLeader = () => {
    navigate(`/hackathon/${hackathonId}/team/${leaderValue}`);
  };

  const handleSubmit = () => {
    setShowSubmissionModal(true);
  };

  const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const opt = { month: "long", day: "numeric" };
    if (s.getFullYear() === e.getFullYear()) {
      return `${s.toLocaleDateString("en-US", opt)} – ${e.toLocaleDateString(
        "en-US",
        { ...opt, year: "numeric" }
      )}`;
    }
    return `${s.toLocaleDateString("en-US", {
      ...opt,
      year: "numeric",
    })} – ${e.toLocaleDateString("en-US", { ...opt, year: "numeric" })}`;
  };

  const getDaysRemaining = () => {
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const StatCard = ({ value, label, icon: Icon }) => (
    <div className="bg-gray-900/70 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 hover:border-green-400/30 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center border border-green-500/20">
          <Icon className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );

  const PrizeStatCard = ({ prize1, prize2, prize3, icon: Icon }) => (
    <div className="bg-gray-900/70 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 hover:border-green-400/30 transition-all">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center border border-green-500/20">
          <Icon className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Prize Pool</h3>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-6 text-sm text-gray-400">
        <span>1st: ₹{prize1.toLocaleString("en-IN")}</span>
        <span>2nd: ₹{prize2.toLocaleString("en-IN")}</span>
        <span>3rd: ₹{prize3.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );

  const renderActionButton = () => {
    const baseClasses = "px-6 py-2.5 w-full sm:w-auto flex justify-center sm:justify-start items-center gap-2";

    if (loading || !userData) {
      return (
        <Link to="/account/login">
          <Button className={`bg-gray-700 cursor-pointer text-gray-400 ${baseClasses}`}>
            Login
          </Button>
        </Link>
      );
    }
    if (!isActive) return null;

    if (!registrationInfo) {
      if (isWithinRegistrationPeriod()) {
        return (
          <Button
            onClick={handleRegister}
            className={`bg-green-500 cursor-pointer text-gray-900 ${baseClasses}`}
          >
            Register Now <ChevronRight className="w-5 h-5" />
          </Button>
        );
      }
      return (
        <Button disabled className={`bg-gray-700 cursor-pointer text-gray-400 ${baseClasses}`}>
          Registration Closed
        </Button>
      );
    }

    if (isLeader) {
      return (
        <Button
          onClick={handleSubmit}
          className={`bg-green-500 cursor-pointer text-gray-900 ${baseClasses}`}
        >
          Submit <ChevronRight className="w-5 h-5" />
        </Button>
      );
    }

    if (isTeamMember) {
      return (
        <Button disabled className={`bg-gray-700 cursor-pointer text-gray-400 ${baseClasses}`}>
          Submit (Leader Only)
        </Button>
      );
    }

    // Individual
    return (
      <Button
        onClick={handleSubmit}
        className={`bg-green-500 cursor-pointer text-gray-900 ${baseClasses}`}
      >
        Submit <ChevronRight className="w-5 h-5" />
      </Button>
    );
  };


  const fallbackImage = `https://via.placeholder.com/1200x400/0a0f18/22c55e?text=${encodeURIComponent(
    title
  )}`;

  return (
    <>
      <div className="border-b border-green-500/20">
        <div className="w-full h-full bg-gray-900">
          <img
            src={imageError ? fallbackImage : imageUrl}
            alt="Hackathon Banner"
            className="w-full h-100 object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          {/* top badges */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge
              className={`${isActive
                ? "bg-green-400/10 text-green-300 border-green-400/20"
                : "bg-gray-800 text-gray-400 border-gray-700"
                } px-3 py-1 text-sm font-medium border`}
            >
              {isActive ? "Active" : "Ended"}
            </Badge>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span>
                  <span className="font-medium text-white">Registration:</span>{" "}
                  {formatDateRange(startDate, endDate)}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <Calendar className="w-4 h-4 text-green-400" />
                <span>
                  <span className="font-medium text-white">Submission:</span>{" "}
                  {formatDateRange(submissionStartDate, submissionEndDate)}
                </span>
              </div>
            </div>
          </div>

          {/* title + buttons */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {title}
              </h1>
              <p className="text-lg text-gray-400">{subTitle}</p>

              {/* Role display */}
              {userData && registrationInfo && (
                <p className="text-sm text-green-300 mt-2">
                  Role:{" "}
                  {isLeader
                    ? "Leader"
                    : isTeamMember
                      ? "Team Member"
                      : "Individual"}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 w-full sm:w-auto text-center sm:text-left">
              {leaderButton && (
                <Button
                  onClick={handleLeader}
                  className="bg-green-500 flex cursor-pointer justify-center sm:justify-start text-gray-900 px-6 py-2.5 w-full sm:w-auto"
                >
                  Leader Dashboard <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              {renderActionButton()}
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <StatCard
              value={participantCount.toLocaleString()}
              label="Participants"
              icon={Users}
            />
            <PrizeStatCard
              prize1={prizeMoney1}
              prize2={prizeMoney2}
              prize3={prizeMoney3}
              icon={Trophy}
            />
            <StatCard
              value={isActive ? `${getDaysRemaining()} Days` : "Ended"}
              label="Time Left"
              icon={Clock}
            />
          </div>
        </div>
      </div>

      {/* modals */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative z-10 max-w-md w-full mx-4">
            <LoginForm onLoginSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      {showSubmissionModal && (
        <SubmissionForm
          isOpen={showSubmissionModal}
          onClose={() => setShowSubmissionModal(false)}
        />
      )}
    </>
  );
};
