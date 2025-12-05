import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Square, Code, Calendar, Users, Trophy } from 'lucide-react';
import { getAdminDetails, getAdminHackathons } from '../backendApis/api'; // Import API functions

// --- BACKGROUND COMPONENTS (No changes) ---
const GridBackground = () => ( <div className="absolute inset-0 opacity-10 pointer-events-none"><div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} /></div> );
const FloatingParticles = () => ( <div className="absolute inset-0 overflow-hidden pointer-events-none">{[...Array(20)].map((_, i) => ( <div key={i} className="absolute w-1 h-1 bg-red-400 rounded-full opacity-30 animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }} /> ))}</div> );

// --- HACKATHON CARD (No changes) ---
const HackathonCard = ({ hackathon }) => {
    // ... (Your existing HackathonCard component code)
    return (
        <div className="border border-red-500/20 bg-white/5 p-4 rounded-xl hover:border-red-400 transition-colors duration-300">
            <h3 className="text-white font-bold text-lg">{hackathon.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2 mt-1">{hackathon.description}</p>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const EndedHackathonsPage = () => {
  const navigate = useNavigate();
  const [endedHackathons, setEndedHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  // 1. Fetch admin details first
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

  // 2. Fetch hackathons and filter them once admin data is available
  useEffect(() => {
    if (adminData) {
      const fetchAndFilterHackathons = async () => {
        try {
          const response = await getAdminHackathons(adminData.id);
          const allHackathons = response.data;
          const now = new Date();

          const filtered = allHackathons.filter(h => {
            const submissionEndDate = new Date(h.submissionEndDate);
            return now > submissionEndDate;
          });

          setEndedHackathons(filtered);
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
      <FloatingParticles />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="text-center my-12 sm:my-16">
          <h1 className="flex items-center justify-center gap-x-4 text-4xl sm:text-5xl md:text-6xl text-white font-extrabold leading-tight">
            <span>Ended Hackathons</span>
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">A look back at our completed events and their amazing projects.</p>
        </header>
        <main>
          {loading ? (
            <p className="text-center text-gray-400">Loading hackathons...</p>
          ) : endedHackathons.length > 0 ? (
            <div className="flex flex-col gap-8">
              {endedHackathons.map((hackathon) => (
                <Link key={hackathon._id} to={`/admin/${hackathon._id}/usersubmissions`}>
                  <HackathonCard hackathon={hackathon} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No ended hackathons found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default EndedHackathonsPage;