import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Code, Calendar, Users, Trophy, DollarSign } from 'lucide-react';
import { getAdminDetails, getAdminHackathons } from '../backendApis/api';

// --- BACKGROUND COMPONENTS ---
const GridBackground = () => (
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }}
    />
  </div>
);

const HackathonCard = ({ hackathon }) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-gray-900/70 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="w-full lg:w-1/3 h-48 lg:h-64 relative">
          <img
            src={
              hackathon.image ||
              "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop"
            }
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent lg:from-transparent lg:to-transparent"></div>
        </div>

        {/* Text */}
        <div className="p-4 lg:p-5 flex-1 flex flex-col justify-center">
          <h3 className="text-white font-bold text-xl lg:text-2xl mb-2 leading-snug">{hackathon.title}</h3>
          <p className="text-green-300 text-base mb-2">{hackathon.subTitle}</p>
          <p className="text-gray-400 text-base line-clamp-2 lg:line-clamp-1 mb-3">{hackathon.description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-400 text-base mb-3">
            <span className="flex items-center gap-1.5">
              <Users size={16} className="text-green-400" /> {hackathon.numParticipants || 0}
            </span>
            <span className="flex items-center">
              <Trophy size={14} className="text-gray-500" />
              <span className="ml-1 text-gray-400">
                ₹{(
                  (hackathon.prizeMoney1 || 0) +
                  (hackathon.prizeMoney2 || 0) +
                  (hackathon.prizeMoney3 || 0)
                ).toLocaleString("en-IN")}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={16} className="text-green-400" /> {new Date(hackathon.startDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
            {hackathon.techStackUsed.map((tech, index) => (
              <span
                key={index}
                className="flex-shrink-0 px-2.5 py-1 rounded-full text-sm bg-green-900/50 text-green-300 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentlyStartedPage = () => {
  const navigate = useNavigate();
  const [recentlyStartedHackathons, setRecentlyStartedHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getAdminDetails();
        setAdminData(response.data.admin);
      } catch (error) {
        console.error("Auth error, redirecting to login", error);
        navigate('/adminlogin');
      }
    };
    fetchAdminData();
  }, [navigate]);

  useEffect(() => {
    if (adminData) {
      const fetchAndFilterHackathons = async () => {
        try {
          const response = await getAdminHackathons(adminData.id);
          const allHackathons = response.data;
          const now = new Date();

          const filtered = allHackathons.filter(h => {
            const startDate = new Date(h.startDate);
            const submissionStartDate = new Date(h.submissionStartDate);
            return now >= startDate && now < submissionStartDate;
          });

          setRecentlyStartedHackathons(filtered);
        } catch (error) {
          console.error("Failed to fetch hackathons:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAndFilterHackathons();
    }
  }, [adminData]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="text-center my-12 sm:my-16">
          <h1 className="flex items-center ZaptronFont -tracking-tight text-green-400 justify-center gap-x-4 text-5xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
            <span>Recently Started</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Catch the momentum! These hackathons have just kicked off.
          </p>
        </header>
        <main>
          {loading ? (
            <p className="text-center text-gray-400">Loading hackathons...</p>
          ) : recentlyStartedHackathons.length > 0 ? (
            <div className="flex flex-col gap-8">
              {recentlyStartedHackathons.map(hackathon => (
                <Link
                  key={hackathon._id}
                  to={`/admin/${hackathon._id}/usersubmissions`}
                >
                  <HackathonCard hackathon={hackathon} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No recently started hackathons found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecentlyStartedPage;
