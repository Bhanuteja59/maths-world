"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function HeroSection() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        if (parsed?.username) setUsername(parsed.username);
      } catch (e) {
        console.error("Error parsing cached user:", e);
      }
    }

    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          setUsername(data.user.username);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/50 to-green-900/70 z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl border-2 border-white/20 shadow-lg"
        >
          {/* Greeting */}
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white text-2xl mb-4 font-semibold"
          >
            {username ? (
              <>
                👋 Hello,{" "}
                <span className="text-yellow-300 font-bold animate-pulse">
                  {username}
                </span>
                !
              </>
            ) : (
              <Link href="/home" className="underline text-yellow-300">
                Welcome Champ! 🚀
              </Link>
            )}
          </motion.h2>

          {/* Main Title */}
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-xl"
          >
            <span className="text-yellow-300">Math</span>{" "}
            <span className="text-blue-300">Adventure</span>{" "}
            <span className="text-pink-300">Time!</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-2xl md:text-3xl text-white max-w-2xl mx-auto mb-10 font-medium drop-shadow-lg px-4"
          >
            Join our{" "}
            <span className="text-green-300 font-bold">fun</span> learning
            journey with{" "}
            <span className="text-purple-300 font-bold">games</span>,{" "}
            <span className="text-red-300 font-bold">puzzles</span>, and{" "}
            <span className="text-yellow-300 font-bold">rewards</span>!
          </motion.p>
          <br />

          {/* Start Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Link
              href="/services/exercise"
              className="relative px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-yellow-400/40 transition-all duration-300 transform hover:scale-105 text-xl border-2 border-white/50"
            >
              Start Practicing
            </Link>
          </motion.div>

          {/* Floating stars animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: Math.random() * 2,
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute text-yellow-400 text-2xl"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              >
                ★
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;
