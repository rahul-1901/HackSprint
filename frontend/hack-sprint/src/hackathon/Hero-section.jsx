import { useState, useEffect } from "react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Calendar, Users, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../backendApis/api";

export const HeroSection = ({
  title,
  subTitle,
  isActive,
  startDate,
  endDate,
  participantCount,
  prizeMoney,
  onRegister,
  imageUrl = "../assets/hackathon-banner.png",
  hackathonId = "hackathon_001"
}) => {
  const [imageError, setImageError] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
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
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!userData) {
        navigate("/account/login");
      }
    }
  }, [loading, userData, navigate]);

  const handleRegister = () => {
    if(isVerified) {
      navigate("/hackathon/RegistrationForm");
    } else {
      navigate("/account/login");
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getDaysRemaining = () => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const renderRegistrationButton = () => {
    if (!isActive) return null;

    if (loading) {
      return (
        <Button
          disabled
          size="lg"
          className="cursor-pointer bg-gray-500/50 text-white font-bold px-6 py-2.5 cursor-not-allowed"
        >
          Loading...
        </Button>
      );
    }
    
    return (
        <Button
          onClick={() => { handleRegister() }}
          size="lg"
          className="cursor-pointer bg-green-500 text-white font-bold px-6 py-2.5 rounded-md shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all duration-300 hover:scale-[1.02]"
        >
          Register Now
        </Button>
      );
  };

  const fallbackImage = "https://via.placeholder.com/1200x300/1a1a2e/ffffff?text=Hackathon+Banner";

  return (
    <>
      <div className="w-full">
        <div className="relative border border-green-500 shadow-2xl">
          <img
            src={imageError ? fallbackImage : imageUrl}
            alt="Hackathon Banner"
            className="w-full h-48 md:h-64 object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
      </div>
      
      <div className="relative bg-900/80 overflow-hidden px-4 md:px-8 py-6">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-hero-primary/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-hero-secondary/10 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={`${
                  isActive
                    ? "bg-hero-primary/20 text-hero-primary border-hero-primary/30 shadow-lg shadow-hero-primary/20"
                    : "bg-surface text-text-secondary border-border-subtle cursor-pointer"
                } px-3 py-1 text-sm border border-green-500`}
              >
                {isActive ? "Active" : "Ended"}
              </Badge>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(startDate)} — {formatDate(endDate)}
                </span>
              </div>
              {isActive && (
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{getDaysRemaining()} days left</span>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1 leading-tight">
                  {title}
                </h1>
                <p className="text-base md:text-lg text-white font-bold leading-relaxed">
                  {subTitle}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                 {renderRegistrationButton()}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface/60 backdrop-blur-sm border border-green-500 rounded-lg p-3 hover:bg-surface-hover transition-all duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-hero-primary/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-hero-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {participantCount}
                    </div>
                    <div className="text-xs text-white font-bold">Participants</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface/60 backdrop-blur-sm border border-green-500 rounded-lg p-3 hover:bg-surface-hover transition-all duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-hero-secondary/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-hero-secondary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">
                      ${prizeMoney?.toLocaleString()}
                    </div>
                    <div className="text-xs text-white font-bold">Prize Pool</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface/60 backdrop-blur-sm border border-green-500 rounded-lg p-3 hover:bg-surface-hover transition-all duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-hero-primary/20 to-hero-secondary/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-hero-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {isActive ? `${getDaysRemaining()}d` : "Ended"}
                    </div>
                    <div className="text-xs text-white font-bold">Time Left</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};