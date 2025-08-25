import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { getDashboard } from "../backendApis/api";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronRight, User, Users, Plus, Link as LinkIcon, Copy, Check } from "lucide-react";

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

const FormRow = ({ label, required, children }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

// Base styles for all form inputs
const baseInputStyles = "w-full bg-gray-800/50 border border-green-500/20 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors duration-300";

// Styles for standard text inputs, with read-only state
const inputStyles = `${baseInputStyles} read-only:opacity-60 read-only:cursor-not-allowed`;

// Custom styles for select dropdowns to provide a themed appearance and correct cursor behavior
const selectStyles = `${baseInputStyles} cursor-pointer appearance-none bg-no-repeat bg-right pr-8 bg-[url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%2322c55e" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>')] [&:invalid]:text-gray-500`;

// Modal to display team code and link after creation
const TeamInfoModal = ({ details, onClose }) => {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'code') {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } else {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative z-10 w-full max-w-md mx-auto bg-gray-900 border border-green-500/30 rounded-xl p-8 shadow-2xl shadow-green-500/20 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Team Created Successfully!</h2>
                <p className="text-gray-400 mb-6">Share the following code or link with your teammates to have them join.</p>
                
                <div className="space-y-4 mb-8">
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Invite Code</label>
                        <div className="flex items-center gap-2">
                            <p className="flex-1 text-lg font-mono tracking-widest bg-gray-800/60 border border-green-500/20 rounded-md p-2.5 text-green-300">{details.code}</p>
                            <Button onClick={() => handleCopy(details.code, 'code')} className="p-2.5 bg-gray-700 hover:bg-gray-600 transition">
                                {copiedCode ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                            </Button>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Invite Link</label>
                        <div className="flex items-center gap-2">
                            <p className="flex-1 text-sm truncate bg-gray-800/60 border border-green-500/20 rounded-md p-2.5 text-green-300">{details.link}</p>
                            <Button onClick={() => handleCopy(details.link, 'link')} className="p-2.5 bg-gray-700 hover:bg-gray-600 transition">
                                {copiedLink ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                            </Button>
                        </div>
                    </div>
                </div>

                <Button onClick={onClose} className="group w-full bg-green-500 text-gray-900 font-bold shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all duration-300 transform hover:scale-105 px-8 py-3 text-base">
                    <span className="flex items-center justify-center gap-2">
                        Proceed to Team Page
                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export const RegistrationForm = ({ onSubmit = () => {} }) => {
  const { id: hackathonId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState("individual");
  const [teamOption, setTeamOption] = useState("create"); // 'create' or 'join'
  
  // State for the team info modal
  const [showTeamInfo, setShowTeamInfo] = useState(false);
  const [teamDetails, setTeamDetails] = useState({ code: '', link: '', id: '' });

  const [individualForm, setIndividualForm] = useState({
    fullName: "",
    email: "",
    city: "",
    state: "",
    contactNumber: "",
    experience: "",
    workEmail: "",
    gender: "",
  });

  const [teamForm, setTeamForm] = useState({
    teamName: "",
    teamLead: "",
    teamLeadEmail: "",
    contactNumber: "",
    experience: "",
    workEmail: "",
    city: "",
    state: "",
    gender: "",
  });

  const [joinTeamForm, setJoinTeamForm] = useState({
      code: "",
      link: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        const user = res.data.userData;
        setUserData(user);

        if (user) {
          setIndividualForm((prev) => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
          }));
          setTeamForm((prev) => ({
            ...prev,
            teamLead: user.name || "",
            teamLeadEmail: user.email || "",
          }));
        }
      } catch (err) {
        setUserData(null);
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload, url;
      if (type === "individual") {
        payload = {
          userId: userData?._id,
          name: individualForm.fullName,
          contactNumber: individualForm.contactNumber,
          email: individualForm.email,
          city: individualForm.city,
          state: individualForm.state,
          yearsOfExperience: individualForm.experience,
          workEmailAddress: individualForm.workEmail,
          gender: individualForm.gender,
        };
        url = `${import.meta.env.VITE_API_BASE_URL}/api/register/${hackathonId}`;
        const response = await axios.post(url, payload);
        
        // Assuming success on non-error response, as backend might not send `success` key
        toast.success(response.data.message || "Registration successful!");
        onSubmit(individualForm);
        navigate(`/hackathon/${hackathonId}`);
        
      } else if (type === "team-create") {
        payload = {
          name: teamForm.teamName,
          leader: userData?._id,
          leaderName: teamForm.teamLead,
          leaderEmail: teamForm.teamLeadEmail,
          hackathon: hackathonId,
          contactNumber: teamForm.contactNumber,
          workEmailAddress: teamForm.workEmail,
          yearsOfExperience: teamForm.experience,
          city: teamForm.city,
          state: teamForm.state,
          gender: teamForm.gender,
        };
        url = `${import.meta.env.VITE_API_BASE_URL}/api/team/create`;
        
        const response = await axios.post(url, payload);
        
        // On success, show modal with team info instead of navigating directly
        if (response.data && response.data.team) {
            toast.success(response.data.message || "Team created successfully!");
            onSubmit(teamForm);
            
            const teamData = {
                code: response.data.secretCode,
                link: response.data.team.secretLink,
                id: response.data.team._id
            };
            
            // Store secret code in localStorage for persistence
            // Note: In Claude.ai artifacts, localStorage is not supported
            // For your own environment, uncomment the lines below:
            // localStorage.setItem('teamSecretCode', response.data.secretCode);
            // localStorage.setItem('teamData', JSON.stringify(teamData));
            // localStorage.setItem('hackathonId', hackathonId);
            
            setTeamDetails(teamData);
            setShowTeamInfo(true); // Show the modal
        } else {
             toast.error(response.data.message || "Team creation failed");
        }
        
      } else if (type === "team-join") {
        let code = joinTeamForm.code;
        if (!code && joinTeamForm.link) {
          const linkMatch = joinTeamForm.link.match(/\/join\/([^\/\?]+)/);
          if (linkMatch) {
            code = linkMatch[1];
          }
        }
        
        payload = {
          userId: userData?._id,
          code: code
        };
        url = `${import.meta.env.VITE_API_BASE_URL}/api/team/join`;
        payload.hackathon = hackathonId;
        
        const response = await axios.post(url, payload);
        
        // Store joined team info in localStorage
        // Note: In Claude.ai artifacts, localStorage is not supported
        // For your own environment, uncomment the lines below:
        // if (response.data && response.data.team) {
        //   localStorage.setItem('joinedTeamCode', code);
        //   localStorage.setItem('joinedTeamData', JSON.stringify(response.data.team));
        //   localStorage.setItem('hackathonId', hackathonId);
        // }
        
        // Assuming success on non-error response
        toast.success(response.data.message || "Join request sent successfully!");
        onSubmit(joinTeamForm);
        navigate(`/hackathon/${hackathonId}`);
      }
      
    } catch (err) {
      console.error(`${type} registration error:`, err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex items-center justify-center relative">
      <GridBackground />
      {showTeamInfo && (
          <TeamInfoModal
              details={teamDetails}
              onClose={() => {
                  setShowTeamInfo(false);

                  // *** FIX APPLIED HERE ***
                  // Navigate to the team page and pass the details in the state object.
                  // This allows the TeamDetails component to read it from location.state
                  // and save it to localStorage.
                  navigate(`/hackathon/${hackathonId}/team/${teamDetails.code}`, {
                    state: {
                      secretCode: teamDetails.code
                    }
                  });

              }}
          />
      )}
      <div className="relative z-10 w-full max-w-4xl mx-auto bg-gray-900/80 backdrop-blur-md border border-green-500/20 rounded-xl p-6 md:p-10 shadow-2xl shadow-green-500/10">
        
        <div className="text-center mb-8 border-b border-green-500/20 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Hackathon Registration</h1>
          <p className="text-md text-gray-400 mt-2">Forge the Future: Ends on Sep 07, 2025</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            className={`px-6 py-2.5 font-bold rounded-lg transition-all duration-300 flex items-center gap-2 ${formType === "individual" ? "bg-green-500 text-gray-900 shadow-lg shadow-green-500/20" : "bg-transparent text-green-300 border border-green-500/50 hover:bg-green-500/10"}`}
            onClick={() => setFormType("individual")}
          >
            <User size={16} /> Individual
          </Button>
          <Button
            className={`px-6 py-2.5 font-bold rounded-lg transition-all duration-300 flex items-center gap-2 ${formType === "team" ? "bg-green-500 text-gray-900 shadow-lg shadow-green-500/20" : "bg-transparent text-green-300 border border-green-500/50 hover:bg-green-500/10"}`}
            onClick={() => setFormType("team")}
          >
            <Users size={16} /> Team
          </Button>
        </div>

        {formType === "individual" && (
          <form onSubmit={(e) => handleSubmit(e, "individual")}>
            <div className="grid md:grid-cols-2 gap-x-6">
              <FormRow label="Full Name" required>
                <input type="text" name="fullName" value={individualForm.fullName} onChange={(e) => handleChange(e, setIndividualForm)} className={inputStyles} required readOnly={!!userData?.name} />
              </FormRow>
              <FormRow label="Email" required>
                <input type="email" name="email" value={individualForm.email} onChange={(e) => handleChange(e, setIndividualForm)} className={inputStyles} required readOnly={!!userData?.email} />
              </FormRow>
              <FormRow label="City" required>
                <input type="text" name="city" value={individualForm.city} onChange={(e) => handleChange(e, setIndividualForm)} className={inputStyles} required />
              </FormRow>
              <FormRow label="State" required>
                <input type="text" name="state" value={individualForm.state} onChange={(e) => handleChange(e, setIndividualForm)} className={inputStyles} required />
              </FormRow>
              <FormRow label="Contact Number" required>
                <input type="tel" name="contactNumber" value={individualForm.contactNumber} onChange={(e) => handleChange(e, setIndividualForm)} className={inputStyles} required />
              </FormRow>
               <FormRow label="Gender" required>
                <select name="gender" value={individualForm.gender} onChange={(e) => handleChange(e, setIndividualForm)} className={selectStyles} required>
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormRow>
              <FormRow label="Years of Work Experience" required>
                <select name="experience" value={individualForm.experience} onChange={(e) => handleChange(e, setIndividualForm)} className={selectStyles} required>
                  <option value="" disabled>Select Experience</option>
                  <option value="0-1">0-1 Years</option>
                  <option value="1-3">1-3 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5+">5+ Years</option>
                </select>
              </FormRow>
               <FormRow label="Work Email Address (Optional)">
                <input type="email" name="workEmail" value={individualForm.workEmail} onChange={(e) => handleChange(e, setIndividualForm)} className={inputStyles} />
              </FormRow>
            </div>
            <div className="mt-8 text-center">
              <Button type="submit" className="group w-full md:w-auto bg-green-500 text-gray-900 font-bold shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all duration-300 hover:shadow-green-400/40 transform hover:scale-105 px-8 py-3 text-base" disabled={loading}>
                <span className="flex items-center justify-center gap-2">
                  {loading ? "Submitting..." : "Submit Registration"}
                  {!loading && <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
                </span>
              </Button>
            </div>
          </form>
        )}

        {formType === "team" && (
          <div>
            <div className="flex justify-center gap-2 mb-8 p-1 bg-gray-800/50 border border-green-500/20 rounded-lg">
                <Button
                    className={`flex-1 px-4 py-2 text-sm font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${teamOption === "create" ? "bg-green-500 text-gray-900 shadow-md shadow-green-500/10" : "bg-transparent text-gray-300 hover:bg-green-500/10"}`}
                    onClick={() => setTeamOption("create")}
                >
                    <Plus size={16} /> Create Team
                </Button>
                <Button
                    className={`flex-1 px-4 py-2 text-sm font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${teamOption === "join" ? "bg-green-500 text-gray-900 shadow-md shadow-green-500/10" : "bg-transparent text-gray-300 hover:bg-green-500/10"}`}
                    onClick={() => setTeamOption("join")}
                >
                    <LinkIcon size={16} /> Join with Code/Link
                </Button>
            </div>

            {teamOption === 'create' && (
                <form onSubmit={(e) => handleSubmit(e, "team-create")}>
                    <div className="grid md:grid-cols-2 gap-x-6">
                        <FormRow label="Team Name" required>
                            <input type="text" name="teamName" value={teamForm.teamName} onChange={(e) => handleChange(e, setTeamForm)} className={inputStyles} required />
                        </FormRow>
                        <FormRow label="Team Lead Name" required>
                            <input type="text" name="teamLead" value={teamForm.teamLead} onChange={(e) => handleChange(e, setTeamForm)} className={inputStyles} required readOnly={!!userData?.name} />
                        </FormRow>
                        <FormRow label="Team Lead Email" required>
                            <input type="email" name="teamLeadEmail" value={teamForm.teamLeadEmail} onChange={(e) => handleChange(e, setTeamForm)} className={inputStyles} required readOnly={!!userData?.email} />
                        </FormRow>
                        <FormRow label="Contact Number" required>
                            <input type="tel" name="contactNumber" value={teamForm.contactNumber} onChange={(e) => handleChange(e, setTeamForm)} className={inputStyles} required />
                        </FormRow>
                         <FormRow label="Gender" required>
                            <select name="gender" value={teamForm.gender} onChange={(e) => handleChange(e, setTeamForm)} className={selectStyles} required>
                                <option value="" disabled>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </FormRow>
                         <FormRow label="City" required>
                            <input type="text" name="city" value={teamForm.city} onChange={(e) => handleChange(e, setTeamForm)} className={inputStyles} required />
                        </FormRow>
                        <FormRow label="State" required>
                            <input type="text" name="state" value={teamForm.state} onChange={(e) => handleChange(e, setTeamForm)} className={inputStyles} required />
                        </FormRow>
                        <FormRow label="Years of Work Experience" required>
                            <select name="experience" value={teamForm.experience} onChange={(e) => handleChange(e, setTeamForm)} className={selectStyles} required>
                                <option value="" disabled>Select Experience</option>
                                <option value="0-1">0-1 Years</option>
                                <option value="1-3">1-3 Years</option>
                                <option value="3-5">3-5 Years</option>
                                <option value="5+">5+ Years</option>
                            </select>
                        </FormRow>
                        <FormRow label="Work Email Address (Optional)">
                            <input type="email" name="workEmail" value={teamForm.workEmail} onChange={(e) => handleChange(e, setTeamForm)} className={inputStyles} />
                        </FormRow>
                    </div>
                    <div className="mt-8 text-center">
                        <Button type="submit" className="group w-full md:w-auto bg-green-500 text-gray-900 font-bold shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all duration-300 hover:shadow-green-400/40 transform hover:scale-105 px-8 py-3 text-base" disabled={loading}>
                            <span className="flex items-center justify-center gap-2">
                            {loading ? "Creating..." : "Create Team & Register"}
                            {!loading && <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
                            </span>
                        </Button>
                    </div>
                </form>
            )}

            {teamOption === 'join' && (
                <form onSubmit={(e) => handleSubmit(e, "team-join")}>
                    <div className="max-w-md mx-auto">
                        <FormRow label="Team Invite Code">
                            <input 
                                type="text" 
                                name="code" 
                                placeholder="Enter team code (e.g., ABC123XY)" 
                                value={joinTeamForm.code} 
                                onChange={(e) => handleChange(e, setJoinTeamForm)} 
                                className={inputStyles} 
                            />
                        </FormRow>
                        <p className="text-center text-gray-400 my-4">OR</p>
                        <FormRow label="Team Invite Link">
                            <input type="url" name="link" placeholder="Paste team invite link" value={joinTeamForm.link} onChange={(e) => handleChange(e, setJoinTeamForm)} className={inputStyles} />
                        </FormRow>
                    </div>
                     <div className="mt-8 text-center">
                        <Button 
                            type="submit" 
                            className="group w-full md:w-auto bg-green-500 text-gray-900 font-bold shadow-lg shadow-green-500/20 hover:bg-green-400 transition-all duration-300 hover:shadow-green-400/40 transform hover:scale-105 px-8 py-3 text-base" 
                            disabled={loading || (!joinTeamForm.code && !joinTeamForm.link)}
                        >
                            <span className="flex items-center justify-center gap-2">
                            {loading ? "Joining..." : "Join Team & Register"}
                            {!loading && <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
                            </span>
                        </Button>
                    </div>
                </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
