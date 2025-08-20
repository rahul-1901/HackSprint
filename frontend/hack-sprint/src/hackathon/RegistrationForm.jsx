import { useState, useEffect } from "react";
import { Button } from "./Button";
import { getDashboard } from "../backendApis/api";

const FormRow = ({ label, required, children }) => (
  <div className="mb-6">
    {/* CHANGE: Made label text white */}
    <label className="block text-sm font-medium text-white mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

export const RegistrationForm = ({ onBack, onSubmit }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState("individual");

  const [individualForm, setIndividualForm] = useState({
    fullName: "",
    email: "",
    location: "",
    contactNumber: "",
    experience: "",
    usedElk: "",
    genAiTech: {
      aiSearch: false,
      rag: false,
      kibana: false,
      agents: false,
      none: false,
    },
    elkUsage: "",
    workEmail: "",
    agreeTerms: false,
  });

  const [teamForm, setTeamForm] = useState({
    teamName: "",
    teamLead: "",
    teamLeadEmail: "",
    members: "",
    experience: "",
    usedElk: "",
    genAiTech: {
      aiSearch: false,
      rag: false,
      kibana: false,
      agents: false,
      none: false,
    },
    elkUsage: "",
    workEmail: "",
    agreeTerms: false,
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
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name in individualForm.genAiTech) {
      setIndividualForm((prev) => ({
        ...prev,
        genAiTech: { ...prev.genAiTech, [name]: checked },
      }));
    } else {
      setIndividualForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleTeamChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name in teamForm.genAiTech) {
      setTeamForm((prev) => ({
        ...prev,
        genAiTech: { ...prev.genAiTech, [name]: checked },
      }));
    } else {
      setTeamForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleIndividualSubmit = (e) => {
    e.preventDefault();
    if (!individualForm.agreeTerms) {
      // Note: alert() might not work in all embedded environments.
      // Consider a modal for a better user experience.
      console.error("User must agree to the Terms and Services.");
      return;
    }
    onSubmit(individualForm);
  };

  const handleTeamSubmit = (e) => {
    e.preventDefault();
    if (!teamForm.agreeTerms) {
      console.error("User must agree to the Terms and Services.");
      return;
    }
    onSubmit(teamForm);
  };

  return (
    <div className="min-h-screen bg-[#101622] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto bg-surface/60 backdrop-blur-sm border border-green-500 rounded-xl p-6 md:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-green-500/20 pb-4">
          <div>
            {/* CHANGE: Made heading text white */}
            <h1 className="text-2xl font-bold text-white">Forge the Future</h1>
            {/* CHANGE: Made subtitle text white */}
            <p className="text-sm text-white">ENDS ON: SEP 07, 2025, 11:59 PM IST (ASIA/KOLKATA)</p>
          </div>
        </div>

        <div className="flex gap-6 mb-8">
          {/* CHANGE: Made active button text white */}
          <Button
            className={`px-6 py-2 font-bold rounded ${formType === "individual" ? "bg-green-500 text-white" : " cursor-pointer bg-surface text-green-500 border border-green-500"}`}
            onClick={() => setFormType("individual")}
          >
            Individual Registration
          </Button>
          {/* CHANGE: Made active button text white */}
          <Button
            className={`px-6 py-2 font-bold rounded ${formType === "team" ? "bg-green-500 text-white" : "cursor-pointer bg-surface text-green-500 border border-green-500"}`}
            onClick={() => setFormType("team")}
          >
            Team Registration
          </Button>
        </div>

        {formType === "individual" && (
          <form onSubmit={handleIndividualSubmit}>
            {/* CHANGE: Made section heading white */}
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-green-500/20 pb-2">INDIVIDUAL REGISTRATION</h3>
            <FormRow label="Full Name" required>
              <input type="text" name="fullName" value={individualForm.fullName} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
            </FormRow>
            <FormRow label="Email" required>
              <input type="email" name="email" value={individualForm.email} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
            </FormRow>
            <div className="grid md:grid-cols-2 gap-6">
              <FormRow label="Current Location" required>
                <input type="text" name="location" value={individualForm.location} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
              </FormRow>
              <FormRow label="Contact Number" required>
                <input type="tel" name="contactNumber" value={individualForm.contactNumber} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
              </FormRow>
            </div>
            <FormRow label="Years of Work Experience" required>
              <select name="experience" value={individualForm.experience} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required>
                <option value="">Select Number of Years</option>
                <option value="0-1">0-1 Years</option>
                <option value="1-3">1-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </FormRow>
            <FormRow label="Have you worked with the ELK Stack before?" required>
              <select name="usedElk" value={individualForm.usedElk} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required>
                <option value="">Please make a selection</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </FormRow>
            <FormRow label="What GenAI technologies are you working on?" required>
              {/* CHANGE: Made checkbox labels white */}
              <div className="space-y-2 text-white">
                {Object.keys(individualForm.genAiTech).map(tech => (
                  <label key={tech} className="flex items-center gap-2">
                    <input type="checkbox" name={tech} checked={individualForm.genAiTech[tech]} onChange={handleIndividualChange} className="h-4 w-4 rounded bg-[#0b0e1c] border-green-500 text-green-500" />
                    <span>{tech === 'aiSearch' ? 'AI or Semantic search' : tech.charAt(0).toUpperCase() + tech.slice(1)}</span>
                  </label>
                ))}
              </div>
            </FormRow>
            <FormRow label="What have you used the ELK Stack for in the past?">
              <textarea name="elkUsage" value={individualForm.elkUsage} onChange={handleIndividualChange} rows="3" className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" />
            </FormRow>
            <FormRow label="Please help us with your work email address (Optional)">
              <input type="email" name="workEmail" value={individualForm.workEmail} onChange={handleIndividualChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" />
            </FormRow>
            <FormRow label="">
              {/* CHANGE: Made checkbox label white */}
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" name="agreeTerms" checked={individualForm.agreeTerms} onChange={handleIndividualChange} className="h-4 w-4 rounded bg-[#0b0e1c] border-green-500 text-green-500" />
                <span>I agree to the Terms and Services</span>
              </label>
            </FormRow>
            <div className="mt-8 text-center pointer-cursor ">
              {/* CHANGE: Made submit button text white */}
              <Button type="submit" className="cursor-pointer bg-green-500 text-white font-bold px-8 py-3 hover:bg-green-400">
                SUBMIT INDIVIDUAL
              </Button>
            </div>
          </form>
        )}

        {formType === "team" && (
          <form onSubmit={handleTeamSubmit}>
            {/* CHANGE: Made section heading white */}
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-green-500/20 pb-2">TEAM REGISTRATION</h3>
            <FormRow label="Team Name" required>
              <input type="text" name="teamName" value={teamForm.teamName} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
            </FormRow>
            <FormRow label="Team Lead Name" required>
              <input type="text" name="teamLead" value={teamForm.teamLead} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
            </FormRow>
            <FormRow label="Team Lead Email" required>
              <input type="email" name="teamLeadEmail" value={teamForm.teamLeadEmail} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required />
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
            <FormRow label="Have you worked with the ELK Stack before?" required>
              <select name="usedElk" value={teamForm.usedElk} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" required>
                <option value="">Please make a selection</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </FormRow>
            <FormRow label="What GenAI technologies are you working on?" required>
              {/* CHANGE: Made checkbox labels white */}
              <div className="space-y-2 text-white">
                {Object.keys(teamForm.genAiTech).map(tech => (
                  <label key={tech} className="flex items-center gap-2">
                    <input type="checkbox" name={tech} checked={teamForm.genAiTech[tech]} onChange={handleTeamChange} className="h-4 w-4 rounded bg-[#0b0e1c] border-green-500 text-green-500" />
                    <span>{tech === 'aiSearch' ? 'AI or Semantic search' : tech.charAt(0).toUpperCase() + tech.slice(1)}</span>
                  </label>
                ))}
              </div>
            </FormRow>
            <FormRow label="What have you used the ELK Stack for in the past?">
              <textarea name="elkUsage" value={teamForm.elkUsage} onChange={handleTeamChange} rows="3" className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" />
            </FormRow>
            <FormRow label="Please help us with your work email address (Optional)">
              <input type="email" name="workEmail" value={teamForm.workEmail} onChange={handleTeamChange} className="w-full bg-[#0b0e1c] border border-green-500 rounded-md p-2 text-white" />
            </FormRow>
            <FormRow label="">
              {/* CHANGE: Made checkbox label white */}
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" name="agreeTerms" checked={teamForm.agreeTerms} onChange={handleTeamChange} className="h-4 w-4 rounded bg-[#0b0e1c] border-green-500 text-green-500" />
                <span>I agree to the Terms and Services</span>
              </label>
            </FormRow>
            <div className="mt-8 text-center">
              {/* CHANGE: Made submit button text white */}
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