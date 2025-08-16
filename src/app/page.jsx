'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Loading from './loading';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl sm:text-2xl text-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, Math.random() > 0.5 ? 180 : -180],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {['+', '−', '×', '÷', '=', 'π', '∞'][Math.floor(Math.random() * 7)]}
          </motion.div>
        ))}
      </div>

      {/* Floating Calculator */}
      <motion.div
        className="hidden md:block absolute top-1/4 left-8 md:left-16 w-24 h-32 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="grid grid-cols-4 gap-1 text-white text-xs">
          {['7', '8', '9', '+', '4', '5', '6', '−', '1', '2', '3', '×', 'C', '0', '=', '÷'].map((btn) => (
            <motion.div
              key={btn}
              className="w-5 h-5 bg-white/20 rounded-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition"
              whileHover={{ scale: 1.2 }}
            >
              {btn}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Graph */}
      <motion.div
        className="hidden md:block absolute bottom-1/4 right-8 md:right-16 w-32 h-24 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20"
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-0 w-full h-px bg-white/30"></div>
          <div className="absolute bottom-0 left-0 w-px h-full bg-white/30"></div>
          <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-pink-400/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full" style={{ height: '60%' }}>
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <path d="M0,60 L20,40 L40,50 L60,20 L80,30 L100,10" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="text-center p-6 sm:p-10 rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl border-2 border-white/20 w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute -top-4 -right-4 w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center text-lg sm:text-xl animate-pulse shadow-xl">
          🔥
        </div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-wide leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            Maths World
          </span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl font-light mb-10 opacity-90 leading-relaxed max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Where numbers come alive and equations tell stories. Begin your adventure today!
        </motion.p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 gap-5 mt-6 ">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Link
              href="/home"
              className="px-3 py-3 sm:px-8 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
            >
              <button className='btn btn-success border-4 mb-2'>
                🚀 Start Learning
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Achievement Badges */}
        <motion.div
          className="flex justify-center gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          {['🏆', '⭐', '🎯'].map((badge, i) => (
            <motion.div
              key={i}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center text-xl sm:text-2xl backdrop-blur-sm border border-white/20 cursor-pointer"
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {badge}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
