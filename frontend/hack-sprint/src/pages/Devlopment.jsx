import React from "react";
import { Github, Instagram, Linkedin, Twitter, Facebook } from "lucide-react";

const socialLinks = [
  { name: 'GitHub', icon: <Github size={22} />, url: 'https://github.com/devlup-labs/HackSprint' },
  { name: 'Instagram', icon: <Instagram size={22} />, url: 'https://www.instagram.com/hack.sprint?igsh=MWN6bjlldTV2Z2Nqdg==' },
  { name: 'LinkedIn', icon: <Linkedin size={22} />, url: 'https://www.linkedin.com/company/devlup-labs/' },
  { name: 'Twitter', icon: <Twitter size={22} />, url: 'https://x.com/devluplabs' },
  { name: 'Facebook', icon: <Facebook size={22} />, url: 'https://www.facebook.com/devluplabs/' }
];

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1c] text-white text-center relative">
      {/* Logo */}
      <img
        src="hackSprint.webp"
        alt="HackSprint Logo"
        className="w-40 md:w-56 mb-8 drop-shadow-[0_0_25px_#16f36e] animate-pulse"
      />

      {/* Main Message */}
      <div className="space-y-1">
        <p className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl bg-clip-text bg-gradient-to-b from-green-400 to-green-800 tracking-widest z-10 text-center relative leading-tight ZaptronFont font-light text-green-600 uppercase">
          We are under development
        </p>

        <p className="text-lg md:text-2xl lg:text-3xl ZaptronFont font-light tracking-wide bg-clip-text bg-gradient-to-b from-green-400 to-green-800 tracking-widest text-green-600">
          Cooking something great for you
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 flex items-center gap-6 text-green-500">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className="hover:text-green-300 transition"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
