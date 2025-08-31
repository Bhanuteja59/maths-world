"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "./loading";

// keep your classNames/components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CustomerReview from "./components/CustomerReview";
import Services from "./components/Services";
import LevelSelection from "./components/LevelSelection";

const Page = () => {

  useEffect(() => {
  if (!sessionStorage.getItem("reloaded")) {
    sessionStorage.setItem("reloaded", "true");
    window.location.reload();
  }
}, []);


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
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      router.replace("/home");
      return;
    }

    const existingToken = localStorage.getItem("jwt");
    if (existingToken) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, [router, searchParams]);

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div className="container-fluid">
      <Navbar />
      <HeroSection />
      <LevelSelection />
      <Services />
      <CustomerReview />

      {/* Footer with Social Links */}
      <footer className="bg-amber-50 text-amber-900 py-16 px-6 relative overflow-hidden">
        {/* Floating playful shapes */}
        <div className="absolute top-0 left-10 w-32 h-32 bg-yellow-200 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-pink-200 rounded-full filter blur-2xl opacity-25 animate-float animation-delay-1000"></div>

        <div className="container mx-auto text-center z-10 relative">
          <h3 className="text-2xl font-bold mb-6">Connect With Developer</h3>
          <div className="flex justify-center gap-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="relative bg-amber-100 p-3 rounded-xl flex items-center justify-center w-14 h-14 border border-amber-200 hover:border-amber-300 transition-all"
                aria-label={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
