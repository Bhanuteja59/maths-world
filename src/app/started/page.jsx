"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "./loading";

export default function GetStarted() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleClick = () => {
    setShowConfetti(true);
    setLoading(true);
    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setShowConfetti(false);
          router.push("/services/learn");
        }, 500);
      }
    }, 100);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 text-center p-6">
      {showConfetti && <Confetti />}

      <h1 className="text-4xl font-bold text-blue-700 mb-4 animate-bounce">
        Welcome to Maths World! 🎉
      </h1>

      <p className="text-lg text-gray-700 mb-6 max-w-md">
        Let's start your math adventure! Click below to begin.
      </p>

      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-lg shadow-lg transition-all transform ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
      >
        {loading ? "⏳ Loading..." : "🚀 Get Started Now!"}
      </button>

      {loading && (
        <div className="w-64 mt-6 bg-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
            style={{ width: `${progress}%` }}
            className="h-full bg-blue-500"
          />
        </div>
      )}

      {loading && (
        <p className="mt-2 text-blue-600 font-semibold">{progress}%</p>
      )}
    </div>
  );
}
