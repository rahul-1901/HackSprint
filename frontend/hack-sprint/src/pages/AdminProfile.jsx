import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Plus, Check, X, User, Shield, Clock, CheckCircle, Trophy 
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
    <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-2xl" style={{ animation: "morph 8s ease-in-out infinite" }}/>
    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-600/3 rounded-full blur-3xl" style={{ animation: "morph 8s ease-in-out infinite 4s" }}/>
  </div>
);

const HackathonCard = ({ hackathon }) => (
  <div className="border border-green-500/20 bg-white/5 p-4 rounded-xl hover:border-green-400 transition-colors duration-300 h-full">
    <h3 className="text-white font-bold text-lg">{hackathon.title}</h3>
    <p className="text-gray-400 text-sm line-clamp-2 mt-1">{hackathon.description}</p>
  </div>
);

// Helper component for the pending hackathon list
const PendingHackathonCard = ({ hackathon, onApprove, onReject }) => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
    <div>
      <p className="font-bold text-white">{hackathon.title}</p>
      <p className="text-sm text-gray-400">Submitted: {new Date(hackathon.createdAt).toLocaleDateString()}</p>
    </div>
    <div className="flex-shrink-0 flex gap-2">
      <button 
        onClick={() => onApprove(hackathon._id)}
        className="bg-green-500/20 hover:bg-green-500/40 text-green-300 font-bold p-2 rounded-full transition-colors"
        title="Approve"
      >
        <Check size={20} />
      </button>
      <button 
        onClick={() => onReject(hackathon._id)}
        className="bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold p-2 rounded-full transition-colors"
        title="Reject"
      >
        <X size={20} />
      </button>
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
  
  // Effect to fetch admin details
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

  // Effect to fetch admin's own segregated hackathons
  useEffect(() => {
    if (adminData) {
      const fetchAndSegregateHackathons = async () => {
        try {
          setHackathonsLoading(true);
          const response = await getAdminHackathons(adminData.id);
          const allHackathons = response.data;
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

  // Effect to fetch pending hackathons IF admin is a controller
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

  // Handlers for approve/reject actions
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
  
  const HackathonSection = ({ title, hackathons }) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">{title}</h2>
      {hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map(hackathon => (
            <Link key={hackathon._id} to={`/Hacksprintkaadminprofile/${hackathon._id}/usersubmissions`}>
              <HackathonCard hackathon={hackathon} />
            </Link>
          ))}
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
          <div className="flex items-center mb-4"><div className="w-px h-8 bg-green-400"></div><span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">ADMIN DASHBOARD</span><div className="w-px h-8 bg-green-400"></div></div>
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold -tracking-tight text-green-400">Administrator Profile</h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl">Manage platform operations, monitor hackathons, and oversee community growth.</p>
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
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-green-400 text-sm font-medium">ACTIVE</span></div>
                  {adminData.lastLogin && <p className="text-gray-400 text-sm">Last seen: {new Date(adminData.lastLogin).toLocaleTimeString()}</p>}
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
                <button 
                  onClick={() => navigate('/createHackathon')} 
                  className="w-full bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 text-green-400 font-semibold px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 group"
                >
                    <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                    Create New Hackathon
                </button>
            </div>
          </div>
        </div>
        
        {/* Conditionally render the Pending Hackathons section */}
        {adminData.controller && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Clock /> Pending Approvals
            </h2>
            {pendingLoading ? (
              <p className="text-gray-400">Loading pending hackathons...</p>
            ) : pendingHackathons.length > 0 ? (
              <div className="space-y-4">
                {pendingHackathons.map(hackathon => (
                  <PendingHackathonCard 
                    key={hackathon._id} 
                    hackathon={hackathon}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No hackathons are currently pending approval.</p>
            )}
          </div>
        )}
        
        {/* Regular Hackathon sections */}
        {hackathonsLoading ? (
          <p className="text-gray-400 text-lg">Loading your hackathons...</p>
        ) : (
          <>
            <HackathonSection title="Live Hackathons" hackathons={liveHackathons} />
            <HackathonSection title="Recently Started" hackathons={recentlyStartedHackathons} />
            <HackathonSection title="Expired Hackathons" hackathons={expiredHackathons} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;