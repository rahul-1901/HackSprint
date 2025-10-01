import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Plus, Check, X, User, Shield, Clock, CheckCircle, Trophy, ArrowRight, Users, Calendar, DollarSign
} from 'lucide-react';
import {
  getAdminDetails,
  getAdminHackathons,
  getPendingHackathons,
  approveHackathon,
  rejectHackathon
} from '../backendApis/api';

// --- HELPER & BACKGROUND COMPONENTS ---
const GridBackground = () => (
  <div className="absolute inset-0 opacity-5">
    <div
      className="absolute inset-0"
      style={{ backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
    />
    <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-2xl" style={{ animation: "morph 8s ease-in-out infinite" }} />
    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-600/3 rounded-full blur-3xl" style={{ animation: "morph 8s ease-in-out infinite 4s" }} />
  </div>
);

const HackathonCard = ({ hackathon }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate(`/admin/${hackathon._id}/usersubmissions`)
      }
      className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-gray-900/70 backdrop-blur-sm"
    >
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
          <h3 className="text-white font-bold text-xl lg:text-2xl mb-2 leading-snug">
            {hackathon.title}
          </h3>
          <p className="text-green-300 text-base mb-2">{hackathon.subTitle}</p>
          <p className="text-gray-400 text-base line-clamp-2 lg:line-clamp-1 mb-3">
            {hackathon.description}
          </p>

          {/* Participants, Prize, Date */}
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

          {/* Tech Stack */}
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

const PendingHackathonCard = ({ hackathon, onApprove, onReject }) => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
    <div>
      <p className="font-bold text-white">{hackathon.title}</p>
      <p className="text-sm text-gray-400">Submitted: {new Date(hackathon.createdAt).toLocaleDateString()}</p>
    </div>
    <div className="flex-shrink-0 flex gap-2">
      <button onClick={() => onApprove(hackathon._id)} className="bg-green-500/20 hover:bg-green-500/40 text-green-300 font-bold p-2 rounded-full transition-colors" title="Approve"><Check size={20} /></button>
      <button onClick={() => onReject(hackathon._id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold p-2 rounded-full transition-colors" title="Reject"><X size={20} /></button>
    </div>
  </div>
);

const AdminProfile = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveHackathons, setLiveHackathons] = useState([]);
  const [recentlyStartedHackathons, setRecentlyStartedHackathons] = useState([]);
  const [expiredHackathons, setExpiredHackathons] = useState([]);
  const [hackathonsLoading, setHackathonsLoading] = useState(true);
  const [pendingHackathons, setPendingHackathons] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getAdminDetails();
        setAdminData(response.data.admin);
      } catch (error) {
        console.error("Failed to fetch admin details:", error);
        navigate('/adminlogin');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [navigate]);

  useEffect(() => {
    if (adminData) {
      const fetchAndSegregateHackathons = async () => {
        try {
          setHackathonsLoading(true);
          const response = await getAdminHackathons(adminData.id);
          const allHackathons = response.data;
          console.log(allHackathons);
          const now = new Date();
          const live = [], recent = [], expired = [];

          allHackathons.forEach(hackathon => {
            const startDate = new Date(hackathon.startDate);
            const submissionStartDate = new Date(hackathon.submissionStartDate);
            const submissionEndDate = new Date(hackathon.submissionEndDate);

            if (now >= submissionStartDate && now <= submissionEndDate) live.push(hackathon);
            else if (now > submissionEndDate) expired.push(hackathon);
            else if (now >= startDate && now < submissionStartDate) recent.push(hackathon);
          });

          setLiveHackathons(live);
          setRecentlyStartedHackathons(recent);
          setExpiredHackathons(expired);
        } catch (error) {
          console.error("Error fetching or segregating hackathons:", error);
        } finally {
          setHackathonsLoading(false);
        }
      };
      fetchAndSegregateHackathons();
    }
  }, [adminData]);

  useEffect(() => {
    if (adminData && adminData.controller) {
      const fetchPending = async () => {
        try {
          setPendingLoading(true);
          const response = await getPendingHackathons();
          setPendingHackathons(response.data.pendingHackathonsData || []);
        } catch (error) {
          console.error("Failed to fetch pending hackathons:", error);
          toast.error("Could not load pending hackathons.");
        } finally {
          setPendingLoading(false);
        }
      };
      fetchPending();
    }
  }, [adminData]);

  const handleApprove = async (pendingId) => {
    try {
      await approveHackathon({ pendingHackathonId: pendingId, adminId: adminData.id });
      toast.success("Hackathon approved!");
      setPendingHackathons(prev => prev.filter(h => h._id !== pendingId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed.");
    }
  };

  const handleReject = async (pendingId) => {
    try {
      await rejectHackathon({ pendingHackathonId: pendingId, adminId: adminData.id });
      toast.warn("Hackathon rejected.");
      setPendingHackathons(prev => prev.filter(h => h._id !== pendingId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed.");
    }
  };

  if (loading || !adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h2>Loading Admin Profile...</h2>
      </div>
    );
  }

  const HackathonSection = ({ title, hackathons, viewMoreLink }) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        {title}
      </h2>
      {hackathons.length > 0 ? (
        <div className="flex flex-col gap-6">
          {hackathons.slice(0, 3).map((hackathon, index) => {
            const isViewMoreCard = index === 2 && hackathons.length > 3;

            if (isViewMoreCard) {
              return (
                <div key={hackathon._id} className="relative">
                  {/* Make card non-clickable */}
                  <div className="pointer-events-none">
                    <HackathonCard hackathon={hackathon} />
                  </div>

                  {/* Fade overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent rounded-2xl" />

                  {/* View More button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => navigate(viewMoreLink)}
                      className="bg-gray-800/80 cursor-pointer hover:bg-gray-700/80 text-gray-200 font-semibold py-3 px-6 rounded-lg border border-gray-600 backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group hover:border-green-400 hover:text-white"
                    >
                      View More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            }

            return <HackathonCard key={hackathon._id} hackathon={hackathon} />;
          })}
        </div>
      ) : (
        <p className="text-gray-400">No hackathons in this category.</p>
      )}
    </div>
  );



  const permissions = ["Full Access", "User Management", "Event Creation"];

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center mb-1 -ml-3 md:-ml-2"><span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">ADMIN DASHBOARD</span></div>
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl ZaptronFont font-extrabold -tracking-tight text-green-400">Administrator Profile</h1>
          <p className="text-gray-400 text-lg ml-1 mt-0 md:-mt-4 max-w-2xl">Manage platform operations, monitor hackathons, and oversee community growth.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-green-400/30 transition-all duration-500">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-400/10 border-2 border-green-400/20 rounded-full flex items-center justify-center"><User className="w-10 h-10 text-green-400" /></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"><Shield className="w-4 h-4 text-gray-900" /></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{adminData.name}</h2>
                  <p className="text-green-400 font-medium mb-1">{adminData.controller ? 'Platform Administrator' : 'Admin'}</p>
                  <p className="text-gray-400 text-sm">{adminData.email}</p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" />Access Permissions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {permissions.map((permission) => (<div key={permission} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-green-400/30 transition-colors duration-300"><CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /><span className="text-gray-300 text-sm">{permission}</span></div>))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-green-400/30 transition-all duration-500 flex items-center justify-center">
              <button onClick={() => navigate('/createHackathon')} className="w-full cursor-pointer bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-green-400 font-semibold px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 group">
                <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                Create New Hackathon
              </button>
            </div>
          </div>
        </div>

        {adminData.controller && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><Clock /> Pending Approvals</h2>
            {pendingLoading ? (<p className="text-gray-400">Loading pending hackathons...</p>) : pendingHackathons.length > 0 ? (
              <div className="space-y-4">
                {pendingHackathons.map(hackathon => (<PendingHackathonCard key={hackathon._id} hackathon={hackathon} onApprove={handleApprove} onReject={handleReject} />))}
              </div>
            ) : (<p className="text-gray-400">No hackathons are currently pending approval.</p>)}
          </div>
        )}

        {hackathonsLoading ? (
          <p className="text-gray-400 text-lg">Loading your hackathons...</p>
        ) : (
          <>
            <HackathonSection title="Live Hackathons" hackathons={liveHackathons} viewMoreLink="/admin/livehackathons" />
            <HackathonSection title="Recently Started" hackathons={recentlyStartedHackathons} viewMoreLink="/admin/recentlystarted" />
            <HackathonSection title="Expired Hackathons" hackathons={expiredHackathons} viewMoreLink="/admin/endedhackathons" />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
