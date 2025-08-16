"use client"; // needed for localStorage in Next.js app router

import React, { useEffect, useState } from "react";
import Link from "next/link";

function HeroSection() {
  const [username, setUsername] = useState(null);

  return (
    <div>
      <div
        className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)",
        }}
      >
        {/* Overlay & Decorations */}
        <div className="absolute inset-0 bg-gray-900/70">
          {/* Floating shapes ... (your original code remains here) */}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border-2 border-white/20">
            {/* ✅ Dynamic username display */}
            <h2 className="text-white text-2xl mb-4">
              Welcome {username ? username : "User"} 👋
            </h2>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              <span className="text-yellow-300">Math</span>{" "}
              <span className="text-blue-300">Adventure</span>{" "}
              <span className="text-pink-300">Time!</span>
            </h1>

            <p className="text-2xl md:text-3xl text-white max-w-2xl mx-auto mb-10 font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] px-4">
              Join our{" "}
              <span className="text-green-300 font-bold">fun</span> learning
              journey with <span className="text-purple-300 font-bold">games</span>,{" "}
              <span className="text-red-300 font-bold">puzzles</span>, and{" "}
              <span className="text-yellow-300 font-bold">rewards</span>!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/started"
                className="relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-yellow-400/40 transition-all duration-300 transform hover:scale-105 text-xl border-2 border-white/50"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
