'use client';

import React , {useState , useEffect} from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Loading from './loading';


function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 second loading time
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white px-6 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl text-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: Math.random() > 0.5 ? [0, 180] : [0, -180],
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
        className="absolute top-1/4 left-1/6 w-24 h-32 bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="grid grid-cols-4 gap-1">
          {['7','8','9','+','4','5','6','−','1','2','3','×','C','0','=','÷'].map((btn) => (
            <div key={btn} className="w-5 h-5 bg-white/20 rounded-sm text-xs flex items-center justify-center">
              {btn}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating Graph */}
      <motion.div
        className="absolute bottom-1/4 right-1/6 w-32 h-24 bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
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
        className="text-center p-12 rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl border-2 border-white/20 max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl animate-pulse">
          🔥
        </div>
        
        <motion.h1 
          className="text-5xl md:text-6xl font-extrabold mb-6 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            Maths World
          </span>
        </motion.h1>
        
        <motion.p
          className="text-xl font-light mb-10 opacity-90 leading-relaxed max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Where numbers come alive and equations tell stories. Begin your adventure today!
        </motion.p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Link 
              href="/home" 
              className="relative px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Learning 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <Link 
              href="/started" 
              className="relative px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Topics
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Achievement Badges Preview */}
        <motion.div 
          className="flex justify-center gap-3 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          {['🏆', '⭐', '🎯'].map((badge, i) => (
            <motion.div
              key={i}
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm border border-white/20"
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

export default Page;