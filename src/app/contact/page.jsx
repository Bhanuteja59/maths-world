"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "../levels/loading";

const Page = () => {
  const socialLinks = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/bhanuteja59/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.41c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.41h-3v-5.5c0-1.38-.03-3.15-1.91-3.15s-2.21 1.49-2.21 3.04v5.61h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.58v5.62z" />
        </svg>
      ),
    },
    {
      label: "Gmail",
      href: "mailto:bhanutejareddy59@gmail.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M12 13.065L2 6.5v11c0 .827.673 1.5 1.5 1.5h17c.827 0 1.5-.673 1.5-1.5v-11l-10 6.565zM12 11L2 4h20l-10 7z" />
        </svg>
      ),
    },
    {
      label: "Portfolio",
      href: "https://portfolio-psi-lovat-40.vercel.app/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 17.5H6c-.276 0-.5-.224-.5-.5V7c0-.276.224-.5.5-.5h12c.276 0 .5.224.5.5v10c0 .276-.224.5-.5.5zm-1.5-9.5h-9v8h9v-8zM9 11h6v2H9v-2z" />
        </svg>
      ),
    },
  ];

  const [loading, setLoading] = useState(true);

  // ✅ Simulated loading effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading message="Loading your portfolio..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-10 left-20 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-300 rounded-full blur-2xl opacity-30 animate-float animation-delay-1000"></div>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-amber-900 mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hi, I'm <span className="text-amber-600">Bhanu Teja 👋</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          A passionate <span className="font-semibold text-amber-700">Full-Stack Developer</span> 🚀  
          building interactive web apps with modern technologies.
        </motion.p>

        {/* Social Links */}
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              className="bg-amber-100 p-4 rounded-2xl flex items-center justify-center w-16 h-16 border border-amber-200 hover:border-amber-400 shadow-md transition-all"
              aria-label={link.label}
            >
              {link.icon}
            </motion.a>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">About Me</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            I enjoy creating user-friendly, beautiful, and scalable web applications.  
            My journey started with <span className="text-amber-600 font-semibold">React & Next.js</span>,  
            and now I work across the full stack with databases, APIs, and cloud deployment.  
            Always curious, I love learning new technologies and solving problems creatively.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-100 text-amber-900 py-10 text-center mt-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Bhanu Teja. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Page;
