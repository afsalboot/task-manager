import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { logo } from "../assets/assets";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-light-primary dark:bg-dark-primary text-light-text-dull dark:text-dark-text py-6 shadow-inner ">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo or App Name */}
        <div className="flex items-center gap-4">
          <Link to='/' className="flex items-center">
          <img src={logo} alt="logo" className="w-8 h-6" />
          <h1 className="text-lg font-semibold tracking-wide">
            For<span className="text-[#A694F7]">Task</span>
          </h1>
          </Link>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-[#A694F7] transition">About</a>
          <a href="#" className="hover:text-[#A694F7] transition">Privacy</a>
          <a href="#" className="hover:text-[#A694F7] transition">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <Github className="w-5 h-5 hover:text-[#A694F7] transition" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-5 h-5 hover:text-[#A694F7] transition" />
          </a>
          <a href="#">
            <Mail className="w-5 h-5 hover:text-[#A694F7] transition" />
          </a>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center text-xs text-[#A694F7] mt-4">
        © {new Date().getFullYear()} ForTask. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
