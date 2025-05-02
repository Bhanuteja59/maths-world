"use client"
import React, { useState, useEffect } from 'react';
import LevelCard from './LevelCard';
import Loading from './Loading';
import { motion } from 'framer-motion';
import "./style.css"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 my-10">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float1"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float2"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float3"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Animated header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600">Math Adventure</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your level and start your fun learning journey today!
          </p>
        </motion.div>

        {/* Level cards grid with staggered animation */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <LevelCard
            title="Beginners"
            href="/levels/beginners"
            color="#10B981" // Green
            icon="👶"
            description="Start with basic concepts and fun activities"
            delay={0.2}
          />
          <LevelCard
            title="Intermediate"
            href="/levels/intermediate"
            color="#3B82F6" // Blue
            icon="🚀"
            description="Build your skills with exciting challenges"
            delay={0.4}
          />
          <LevelCard
            title="Advanced"
            href="/levels/advanced"
            color="#EF4444" // Red
            icon="🔥"
            description="Master complex problems and puzzles"
            delay={0.6}
          />
        </motion.div>

        {/* Decorative math symbols */}
        <div className="mt-20 flex justify-center space-x-8 opacity-60">
          {['➕', '➖', '✖️', '➗'].map((symbol, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ delay: 1 + index * 0.2, type: 'spring' }}
              className="text-4xl"
            >
              {symbol}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}