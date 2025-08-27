import React from "react";
import { Github, Instagram, Linkedin, Twitter, Facebook, Users, Trophy } from "lucide-react";

const socialLinks = [
  { name: "GitHub", icon: <Github size={22} />, url: "https://github.com/devlup-labs/HackSprint" },
  { name: "Instagram", icon: <Instagram size={22} />, url: "https://www.instagram.com/hack.sprint?igsh=MWN6bjlldTV2Z2Nqdg==" },
  { name: "LinkedIn", icon: <Linkedin size={22} />, url: "https://www.linkedin.com/company/devlup-labs/" },
  { name: "Twitter", icon: <Twitter size={22} />, url: "https://x.com/devluplabs" },
  { name: "Facebook", icon: <Facebook size={22} />, url: "https://www.facebook.com/devluplabs/" },
];

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1c] text-white relative overflow-hidden px-6">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(22, 243, 110, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(22, 243, 110, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <img
          src="hackSprint.webp"
          alt="HackSprint Logo"
          className="w-40 md:w-56 mx-auto mb-8 pulse"
        />

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          Under Maintenance
        </h1>

        <p
          className="text-lg md:text-2xl text-green-300/90  mb-12"
          style={{ animationDelay: "0.4s" }}
        >
          Crafting the Future of Hackathons
        </p>

        {/* Compact Stats Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="p-4 border border-green-500/30 bg-white/5 rounded-lg backdrop-blur-sm hover:border-green-400/50 transition">
            <Users size={28} className="mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-green-300">300+</div>
            <p className="text-green-200 text-sm">Platform Logins</p>
          </div>
          <div className="p-4 border border-green-500/30 bg-white/5 rounded-lg backdrop-blur-sm hover:border-green-400/50 transition">
            <Trophy size={28} className="mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-green-300">150+</div>
            <p className="text-green-200 text-sm">Quiz Participations</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="absolute bottom-6 flex items-center gap-6 text-green-400">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="hover:text-green-300 transition-transform transform hover:scale-110"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
