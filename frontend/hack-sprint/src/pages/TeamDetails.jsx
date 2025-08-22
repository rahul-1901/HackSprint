import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Crown, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Check, 
  X, 
  Copy,
  User,
  Settings,
  Clock,
  Shield,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '../components/Button';

// Consistent grid background from other pages
const GridBackground = () => (
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: "30px 30px",
      }}
    />
  </div>
);

const TeamDetails = () => {
  const { hackathonId, teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [copiedItem, setCopiedItem] = useState(null);
  
  // Dummy data - replace with actual API calls
  const [teamData, setTeamData] = useState({
    id: "team_12345",
    name: "Code Warriors",
    hackathonName: "Forge the Future",
    created: "2025-08-20T10:30:00Z",
    inviteCode: "HCK-TRB-2025",
    inviteLink: "https://example.com/join/HCK-TRB-2025",
    status: "active",
    maxMembers: 4,
    leader: {
      id: "user_001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0123",
      city: "San Francisco",
      state: "CA",
      experience: "3-5",
      workEmail: "john.doe@company.com",
      joinedAt: "2025-08-20T10:30:00Z"
    },
    members: [
      {
        id: "user_002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1-555-0124",
        city: "San Francisco",
        state: "CA",
        experience: "1-3",
        workEmail: "jane.smith@startup.com",
        status: "accepted",
        joinedAt: "2025-08-20T14:22:00Z"
      },
      {
        id: "user_003",
        name: "Mike Johnson",
        email: "mike.j@example.com",
        phone: "+1-555-0125",
        city: "Oakland",
        state: "CA",
        experience: "0-1",
        workEmail: "",
        status: "accepted",
        joinedAt: "2025-08-21T09:15:00Z"
      }
    ],
    pendingRequests: [
      {
        id: "req_001",
        user: {
          id: "user_004",
          name: "Sarah Wilson",
          email: "sarah.wilson@example.com",
          phone: "+1-555-0126",
          city: "Berkeley",
          state: "CA",
          experience: "5+",
          workEmail: "s.wilson@techcorp.com"
        },
        requestedAt: "2025-08-22T08:30:00Z",
        message: "Hi! I'm a senior developer with expertise in React and Node.js. Would love to join your team!"
      },
      {
        id: "req_002", 
        user: {
          id: "user_005",
          name: "Alex Chen",
          email: "alex.chen@example.com",
          phone: "+1-555-0127",
          city: "Palo Alto",
          state: "CA", 
          experience: "1-3",
          workEmail: "alex.chen@innovate.com"
        },
        requestedAt: "2025-08-22T10:15:00Z",
        message: "Looking for a team to work on innovative solutions. I have experience in UI/UX and frontend development."
      }
    ]
  });

  useEffect(() => {
    // Simulate API call
    const fetchTeamData = async () => {
      try {
        // Replace with actual API call
        // const response = await getTeamDetails(hackathonId, teamId);
        // setTeamData(response.data);
        
        // Simulate loading delay
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [hackathonId, teamId]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      setLoading(true);
      // Replace with actual API call
      // await respondToJoinRequest(hackathonId, teamId, requestId, action);
      
      // Update local state for demo
      setTeamData(prev => {
        const request = prev.pendingRequests.find(req => req.id === requestId);
        if (action === 'accept' && request) {
          return {
            ...prev,
            members: [...prev.members, {
              ...request.user,
              status: 'accepted',
              joinedAt: new Date().toISOString()
            }],
            pendingRequests: prev.pendingRequests.filter(req => req.id !== requestId)
          };
        } else {
          return {
            ...prev,
            pendingRequests: prev.pendingRequests.filter(req => req.id !== requestId)
          };
        }
      });
      
      console.log(`${action} request ${requestId}`);
      setLoading(false);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MemberCard = ({ member, isLeader = false }) => (
    <div className="bg-gray-800/50 border border-green-500/20 rounded-lg p-4 hover:border-green-400/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-400/10 rounded-full flex items-center justify-center border border-green-500/20">
            {isLeader ? <Crown className="w-5 h-5 text-green-400" /> : <User className="w-5 h-5 text-green-400" />}
          </div>
          <div>
            <h3 className="text-white font-semibold">{member.name}</h3>
            <p className="text-xs text-gray-400">
              {isLeader ? 'Team Leader' : 'Member'} • Joined {formatDate(member.joinedAt).split(',')[0]}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Mail className="w-4 h-4 text-green-400" />
          <span>{member.email}</span>
        </div>
        {member.phone && (
          <div className="flex items-center gap-2 text-gray-300">
            <Phone className="w-4 h-4 text-green-400" />
            <span>{member.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin className="w-4 h-4 text-green-400" />
          <span>{member.city}, {member.state}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Shield className="w-4 h-4 text-green-400" />
          <span>{member.experience} years experience</span>
        </div>
        {member.workEmail && (
          <div className="flex items-center gap-2 text-gray-300">
            <Mail className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300">{member.workEmail}</span>
          </div>
        )}
      </div>
    </div>
  );

  const PendingRequestCard = ({ request }) => (
    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4 hover:border-yellow-400/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-full flex items-center justify-center border border-yellow-500/20">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{request.user.name}</h3>
            <p className="text-xs text-gray-400">
              Requested • {formatDate(request.requestedAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleRequestAction(request.id, 'accept')}
            className="p-2 bg-green-500/10 text-green-300 hover:bg-green-500/20 border border-green-500/20"
            disabled={loading}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleRequestAction(request.id, 'reject')}
            className="p-2 bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/20"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {request.message && (
        <div className="mb-3 p-3 bg-gray-700/30 rounded border border-gray-600/20">
          <p className="text-gray-300 text-sm italic">"{request.message}"</p>
        </div>
      )}
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Mail className="w-4 h-4 text-green-400" />
          <span>{request.user.email}</span>
        </div>
        {request.user.phone && (
          <div className="flex items-center gap-2 text-gray-300">
            <Phone className="w-4 h-4 text-green-400" />
            <span>{request.user.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin className="w-4 h-4 text-green-400" />
          <span>{request.user.city}, {request.user.state}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Shield className="w-4 h-4 text-green-400" />
          <span>{request.user.experience} years experience</span>
        </div>
        {request.user.workEmail && (
          <div className="flex items-center gap-2 text-gray-300">
            <Mail className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300">{request.user.workEmail}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading team details...</p>
        </div>
      </div>
    );
  }

  const currentMembers = [teamData.leader, ...teamData.members];
  const spotsRemaining = teamData.maxMembers - currentMembers.length;

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <GridBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
            <Button 
              onClick={() => navigate(`/hackathon/${hackathonId}`)}
              className="text-green-400 hover:text-green-300 bg-transparent p-0 font-normal"
            >
              {teamData.hackathonName}
            </Button>
            <span className="text-gray-500">→</span>
            <span className="text-gray-300">Team Management</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{teamData.name}</h1>
              <p className="text-gray-400">
                Created on {formatDate(teamData.created)} • {currentMembers.length}/{teamData.maxMembers} members
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(`/hackathon/${hackathonId}`)}
                className="bg-gray-700 text-gray-300 hover:bg-gray-600 px-4 py-2"
              >
                Back to Hackathon
              </Button>
              <Button
                className="bg-green-500 text-gray-900 hover:bg-green-400 px-4 py-2 font-semibold"
              >
                <Settings className="w-4 h-4 mr-2" />
                Team Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{currentMembers.length}/{teamData.maxMembers}</div>
                <div className="text-sm text-gray-400">Team Members</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{teamData.pendingRequests.length}</div>
                <div className="text-sm text-gray-400">Pending Requests</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{spotsRemaining}</div>
                <div className="text-sm text-gray-400">Spots Remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Section */}
        {spotsRemaining > 0 && (
          <div className="bg-gray-800/30 border border-green-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-green-400" />
              Invite Team Members
            </h2>
            <p className="text-gray-400 mb-4">Share these details with potential team members to let them join your team.</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Invite Code</label>
                <div className="flex items-center gap-2 p-3 bg-gray-700/50 border border-green-500/20 rounded-lg">
                  <span className="flex-1 font-mono text-green-300">{teamData.inviteCode}</span>
                  <Button 
                    onClick={() => handleCopy(teamData.inviteCode, 'code')} 
                    className="p-2 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                  >
                    {copiedItem === 'code' ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Invite Link</label>
                <div className="flex items-center gap-2 p-3 bg-gray-700/50 border border-green-500/20 rounded-lg">
                  <span className="flex-1 font-mono text-green-300 truncate">{teamData.inviteLink}</span>
                  <Button 
                    onClick={() => handleCopy(teamData.inviteLink, 'link')} 
                    className="p-2 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                  >
                    {copiedItem === 'link' ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {/* Pending Requests */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-yellow-400" />
              Join Requests ({teamData.pendingRequests.length})
            </h2>
            
            {teamData.pendingRequests.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamData.pendingRequests.map((request) => (
                  <PendingRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <div className="border border-gray-600/50 rounded-lg p-8 text-center">
                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Pending Requests</h3>
                <p className="text-gray-500">Join requests from other participants will appear here.</p>
              </div>
            )}
          </div>

          {/* Current Team Members */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-400" />
              Team Members ({currentMembers.length})
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MemberCard member={teamData.leader} isLeader={true} />
              {teamData.members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
              
              {spotsRemaining > 0 && (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center flex flex-col justify-center">
                  <div className="text-gray-400 mb-2">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    {spotsRemaining} spot{spotsRemaining > 1 ? 's' : ''} remaining
                  </div>
                  <p className="text-sm text-gray-500">Share your invite code or link to recruit team members</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;