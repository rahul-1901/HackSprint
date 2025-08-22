import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "./Button";
import { getDashboard } from "../backendApis/api";
import axios from "axios";

const FormRow = ({ label, required, children }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-white mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

export const RegistrationForm = ({ onBack, onSubmit = () => {} }) => {
  const { id: hackathonId } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState("individual");

  console.log('hackathonId in RegistrationForm:', hackathonId);

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
    members: "",
    experience: "",
    workEmail: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setUserData(res.data.userData);
        setIsVerified(res.data.userData?.isVerified || false);

        setIndividualForm((prev) => ({
          ...prev,
          fullName: res.data.userData?.name || "",
          email: res.data.userData?.email || "",
        }));
        setTeamForm((prev) => ({
          ...prev,
          teamLead: res.data.userData?.name || "",
          teamLeadEmail: res.data.userData?.email || "",
        }));
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

  const handleIndividualChange = (e) => {
    const { name, value } = e.target;
    setIndividualForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = userData?._id;
      const payload = {
        userId,
        name: individualForm.fullName,
        contactNumber: individualForm.contactNumber,
        email: individualForm.email,
        city: individualForm.city,
        state: individualForm.state,
        yearsOfExperience: individualForm.experience,
        workEmailAddress: individualForm.workEmail,
        gender: individualForm.gender,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register/${hackathonId}`,
        payload
      );
      onSubmit(individualForm);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      const leaderId = userData?._id;
      const payload = {
        teamName: teamForm.teamName,
        leaderId,
        workEmailAddress: teamForm.workEmail,
        yearsOfExperience: teamForm.experience,
        leadEmail: teamForm.teamLeadEmail,
        leadName: teamForm.teamLead,
        teamMembers: teamForm.members,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register/${hackathonId}/team`,
        payload
      );
      onSubmit(teamForm);
    } catch (err) {
      console.error("Team registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#101622] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto bg-surface/60 backdrop-blur-sm border border-green-500 rounded-xl p-6 md:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-green-500/20 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Forge the Future</h1>
            <p className="text-sm text-white">ENDS ON: SEP 07, 2025, 11:59 PM IST (ASIA/KOLKATA)</p>
          </div>
        </div>

        <div className="flex gap-6 mb-8">
          <Button
            className={`px-6 py-2 font-bold rounded ${formType === "individual" ? "bg-green-500 text-white" : " cursor-pointer bg-surface text-green-500 border border-green-500"}`}
            onClick={() => setFormType("individual")}
          >
            Individual Registration
          </Button>
          <Button
            className={`px-6 py-2 font-bold rounded ${formType === "team" ? "bg-green-500 text-white" : "cursor-pointer bg-surface text-green-500 border border-green-500"}`}
            onClick={() => setFormType("team")}
          >
            Team Registration
          </Button>
        </div>

        {formType === "individual" && (
          <form onSubmit={handleIndividualSubmit}>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-green-500/20 pb-2">INDIVIDUAL REGISTRATION</h3>
            <FormRow label="Full Name" required>
              <input 
                type="text" 
                name="fullName" 
                value={individualForm.fullName} 
                onChange={handleIndividualChange} 
                className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white read-only:opacity-70 read-only:cursor-not-allowed" 
                required 
                readOnly={userData?.name ? true : false}
              />
            </FormRow>
            <FormRow label="Email" required>
              <input 
                type="email" 
                name="email" 
                value={individualForm.email} 
                onChange={handleIndividualChange} 
                className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white read-only:opacity-70 read-only:cursor-not-allowed" 
                required 
                readOnly={userData?.email ? true : false}
              />
            </FormRow>
            <div className="grid md:grid-cols-2 gap-6">
              <FormRow label="City" required>
                <input type="text" name="city" value={individualForm.city} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
              </FormRow>
              <FormRow label="State" required>
                <input type="text" name="state" value={individualForm.state} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
              </FormRow>
            </div>
            <FormRow label="Gender" required>
              <select name="gender" value={individualForm.gender} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormRow>
            <FormRow label="Contact Number" required>
              <input type="tel" name="contactNumber" value={individualForm.contactNumber} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
            </FormRow>
            <FormRow label="Years of Work Experience" required>
              <select name="experience" value={individualForm.experience} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required>
                <option value="">Select Number of Years</option>
                <option value="0-1">0-1 Years</option>
                <option value="1-3">1-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </FormRow>
            <FormRow label="Please help us with your work email address (Optional)">
              <input type="email" name="workEmail" value={individualForm.workEmail} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" />
            </FormRow>
            <div className="mt-8 text-center pointer-cursor ">
              <Button type="submit" className="cursor-pointer bg-green-500 text-white font-bold px-8 py-3 hover:bg-green-400">
                SUBMIT INDIVIDUAL
              </Button>
            </div>
          </form>
        )}

        {formType === "team" && (
          <form onSubmit={handleTeamSubmit}>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-green-500/20 pb-2">TEAM REGISTRATION</h3>
            <FormRow label="Team Name" required>
              <input type="text" name="teamName" value={teamForm.teamName} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
            </FormRow>
            <FormRow label="Team Lead Name" required>
              <input 
                type="text" 
                name="teamLead" 
                value={teamForm.teamLead} 
                onChange={handleTeamChange} 
                className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white read-only:opacity-70 read-only:cursor-not-allowed" 
                required 
                readOnly={userData?.name ? true : false}
              />
            </FormRow>
            <FormRow label="Team Lead Email" required>
              <input 
                type="email" 
                name="teamLeadEmail" 
                value={teamForm.teamLeadEmail} 
                onChange={handleTeamChange} 
                className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white read-only:opacity-70 read-only:cursor-not-allowed" 
                required 
                readOnly={userData?.email ? true : false}
              />
            </FormRow>
            <FormRow label="Team Members (comma separated names & emails)" required>
              <input type="text" name="members" value={teamForm.members} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
            </FormRow>
            <FormRow label="Years of Work Experience" required>
              <select name="experience" value={teamForm.experience} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required>
                <option value="">Select Number of Years</option>
                <option value="0-1">0-1 Years</option>
                <option value="1-3">1-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </FormRow>
            <FormRow label="Please help us with your work email address (Optional)">
              <input type="email" name="workEmail" value={teamForm.workEmail} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" />
            </FormRow>
            <div className="mt-8 text-center">
              <Button type="submit pointer-cursor " className="cursor-pointer bg-green-500 text-white font-bold px-8 py-3 hover:bg-green-400">
                SUBMIT TEAM
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};