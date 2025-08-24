import { useState, useEffect } from "react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Calendar, Users, Trophy, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../backendApis/api";
import LoginForm from "./LoginForm"; // Adjust the import path as needed

export const HeroSection = ({
  title,
  subTitle,
  isActive,
  startDate,
  endDate,
  participantCount,
  prizeMoney,
  imageUrl = "/assets/hackathon-banner.png",
  hackathonId,
}) => {
  const [imageError, setImageError] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setUserData(res.data.userData);
        setIsVerified(res.data.userData?.isVerified || false);
      } catch (err) {
        setUserData(null);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = () => {
    if (isVerified) {
      navigate(`/hackathon/RegistrationForm/${hackathonId}`);
    } else {
      // Show the login modal instead of redirecting
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (data) => {
    // Close the modal and update the verification status
    setShowLoginModal(false);
    setIsVerified(true);
    setUserData(data);
    // Optionally show a success message or auto-redirect to registration
    // navigate(`/hackathon/RegistrationForm/${hackathonId}`);
  };

  const formatDateRange = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const startYear = startDateObj.getFullYear();
    const endYear = endDateObj.getFullYear();
    const monthDayOptions = { month: 'long', day: 'numeric' };

    if (startYear === endYear) {
      const startStr = startDateObj.toLocaleDateString('en-US', monthDayOptions);
      const endStr = endDateObj.toLocaleDateString('en-US', { ...monthDayOptions, year: 'numeric' });
      return `${startStr} – ${endStr}`;
    } else {
      const fullOptions = { ...monthDayOptions, year: 'numeric' };
      const startStr = startDateObj.toLocaleDateString('en-US', fullOptions);
      const endStr = endDateObj.toLocaleDateString('en-US', fullOptions);
      return `${startStr} – ${endStr}`;
    }
  };

  const getDaysRemaining = () => {
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const StatCard = ({ value, label, icon: Icon }) => (
    <div className="bg-gray-900/70 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 hover:border-green-400/30 transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center group-hover:bg-green-400/20 transition-colors duration-300 border border-green-500/20">
          <Icon className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );

  const fallbackImage = `https://via.placeholder.com/1200x400/0a0f18/22c55e?text=${encodeURIComponent(title)}`;

  return (
    <>
      <div className="border-b border-green-500/20">
        <div className="w-full h-48 md:h-64 bg-gray-900">
          <img
            src={imageError ? fallbackImage : imageUrl}
            alt="Hackathon Banner"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge
              className={`${
                isActive
                  ? "bg-green-400/10 text-green-300 border-green-400/20"
                  : "bg-gray-800 text-gray-400 border-gray-700"
              } px-3 py-1 text-sm font-medium border`}
            >
              {isActive ? "Active" : "Ended"}
            </Badge>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Calendar className="w-4 h-4 text-green-400" />
              <span>{formatDateRange(startDate, endDate)}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">{subTitle}</p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto text-center lg:text-left">
              {isActive &&
                (loading ? (
                  <Button disabled size="lg" className="bg-gray-500/50 text-white font-bold w-auto">
                    Loading...
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegister}
                    className="cursor-pointer group w-auto bg-green-500 text-gray-900 font-bold shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all duration-300 hover:shadow-green-400/40 transform hover:scale-105 px-6 py-2.5 text-base"
                  >
                    <span className="flex items-center gap-2">
                      Register Now
                      <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <StatCard value={participantCount.toLocaleString()} label="Participants" icon={Users} />
            <StatCard value={`$${prizeMoney?.toLocaleString()}`} label="Prize Pool" icon={Trophy} />
            <StatCard value={isActive ? `${getDaysRemaining()} Days` : "Ended"} label="Time Left" icon={Clock} />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 max-w-md w-full mx-4">
            {/* Login Form */}
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              showTitle={true}
              showSignupLink={true}
              showForgotPassword={true}
              showGoogleLogin={true}
              redirectTo="#" // Prevent navigation since we handle it in onLoginSuccess
              containerClassName="bg-gray-900/95 backdrop-blur-sm border border-green-500/20 text-white shadow-[0_0_25px_#5fff6050] p-6 sm:p-10 rounded-xl w-full"
            />
          </div>
        </div>
      )}
    </>
  );
};