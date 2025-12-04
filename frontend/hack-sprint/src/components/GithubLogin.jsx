import React, { useContext } from "react";
import { AppContent } from "../context/AppContext";

export default function GithubLogin() {
  const { backendUrl } = useContext(AppContent);

  const handleGithubLogin = () => {
    // Redirect to GitHub OAuth
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    // Use frontend handler route for redirect
    const redirectUri = `${window.location.origin}/github-auth-handler`;

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&redirect_uri=${redirectUri}`;

    window.location.href = githubAuthUrl;
  };

  return (
    <div>
      <button
        onClick={handleGithubLogin}
        className="text-lg text-center text-[#FFD700] cursor-pointer w-full py-1.5 mt-2 mb-3 rounded-full bg-[#FFD70011] border-2 border-[#FFD700] hover:border-[#ffaa00] hover:bg-[#ffaa001a] hover:text-[#ffaa00] transition-transform duration-300 hover:scale-105"
      >
        <i className="fa-brands fa-github"></i> &nbsp; Login with GitHub
      </button>
    </div>
  );
}
