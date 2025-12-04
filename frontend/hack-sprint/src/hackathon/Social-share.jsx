import { Share2, Instagram, GithubIcon, Linkedin, Link2, Heart, Github } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";

export const SocialShare = () => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Check out this amazing hackathon!";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareUrls = {
    instagram: `https://www.instagram.com/hack.sprint?igsh=MWN6bjlldTV2Z2Nqdg==`,
    github: `https://github.com/devlup-labs/HackSprint`,
    linkedin: `https://www.linkedin.com/company/hacksprintiitj/`,
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareText = "Check out this amazing hackathon!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "HackSprint 🚀",
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        console.error("Share canceled:", err);
      }
    } else {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "HackSprint 🚀",
            text: shareText,
            url: currentUrl,
          });
        } catch (err) {
          console.error("Error sharing:", err);
        }
      } else {
        handleCopyLink();
      }
    }
  };

  const SocialButton = ({ children, onClick, className, hoverColorClass }) => (
    <Button
      variant="ghost"
      size="icon"
      className={`w-12 h-12 rounded-full bg-gray-900/50 border border-green-500/20 group transition-all duration-300 hover:scale-110 ${hoverColorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  return (
    <aside className="w-24 min-h-[calc(100vh-88px)] sticky top-[88px]">
      <div className="h-full p-4 flex flex-col items-center gap-6 pt-8 bg-gray-900/50 backdrop-blur-md border-l border-green-500/20">

        <div
          className="text-center cursor-pointer group"
          onClick={handleShare}
        >
          <Share2 className="w-6 h-6 text-green-400 mx-auto mb-1 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-xs text-gray-400 font-medium group-hover:text-green-400">Share</span>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <SocialButton
            hoverColorClass="hover:bg-[#1DA1F2]/20 cursor-pointer hover:shadow-[0_0_15px_rgba(29,161,242,0.5)] flex items-center justify-center"
            onClick={() => window.open(shareUrls.instagram, "_blank")}
          >
            <Instagram className="w-7 h-7 text-[#1DA1F2]" />
          </SocialButton>

          <SocialButton
            hoverColorClass="hover:bg-[#1877F2]/20 cursor-pointer hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] flex items-center justify-center"
            onClick={() => window.open(shareUrls.github, "_blank")}
          >
            <Github className="w-7 h-7 text-[#1877F2]" />
          </SocialButton>

          <SocialButton
            hoverColorClass="hover:bg-[#0A66C2]/20 cursor-pointer hover:shadow-[0_0_15px_rgba(10,102,194,0.5)] flex items-center justify-center"
            onClick={() => window.open(shareUrls.linkedin, "_blank")}
          >
            <Linkedin className="w-7 h-7 text-[#0A66C2]" />
          </SocialButton>

          <SocialButton
            hoverColorClass="hover:bg-green-500/20 cursor-pointer hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] flex items-center justify-center"
            onClick={handleCopyLink}
          >
            <Link2
              className={`w-7 h-7 text-green-400 transition-transform duration-300 ${copied ? "rotate-12 scale-125" : ""
                }`}
            />
          </SocialButton>
        </div>

        {copied && (
          <div className="text-xs text-green-400 font-medium animate-pulse">Copied!</div>
        )}

        <div className="w-8 h-px bg-green-500/20" />

        <div className="flex flex-col items-center gap-2">
          <SocialButton
            hoverColorClass="hover:bg-red-500/20 cursor-pointer flex items-center justify-center hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            onClick={() => setLiked(!liked)}
          >
            <Heart
              className={`w-7 h-7 transition-all duration-200 ${liked ? "text-red-500 fill-current" : "text-red-400/80"
                }`}
            />
          </SocialButton>
        </div>
      </div>
    </aside>
  );
};