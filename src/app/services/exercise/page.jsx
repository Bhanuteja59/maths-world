// pages/index.js (Home Page)
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Math <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Practice</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Sharpen your math skills with fun, interactive exercises. Choose your difficulty level and start learning!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200"
          >
            <div className="text-green-600 text-4xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Easy Level</h2>
            <p className="text-gray-600 mb-4">Perfect for beginners and young learners</p>
            <Link href="/services/exercise/easy">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Start Easy
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200"
          >
            <div className="text-blue-600 text-4xl mb-4">🌿</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Intermediate</h2>
            <p className="text-gray-600 mb-4">Challenge yourself with moderate problems</p>
            <Link href="/services/exercise/intermediate">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Start Intermediate
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200"
          >
            <div className="text-purple-600 text-4xl mb-4">🔥</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Advanced</h2>
            <p className="text-gray-600 mb-4">For math masters seeking a real challenge</p>
            <Link href="/services/exercise/advanced">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Start Advanced
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}