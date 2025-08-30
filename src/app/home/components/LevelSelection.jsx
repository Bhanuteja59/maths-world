import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GiStarsStack, GiPartyPopper } from 'react-icons/gi';

const levels = [
  {
    title: 'Beginner',
    desc: 'Start with the basics and build a strong foundation in math.',
    link: '/services/exercise/easy',
    color: 'from-green-300 to-green-500',
  },
  {
    title: 'Intermediate',
    desc: 'Expand your knowledge with more challenging concepts and problems.',
    link: '/services/exercise/intermediate',
    color: 'from-yellow-300 to-yellow-500',
  },
  {
    title: 'Advanced',
    desc: 'Master complex topics and solve sophisticated mathematical problems.',
    link: '/services/exercise/advanced',
    color: 'from-red-300 to-red-500',
  },
];

function LevelSelection() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-50 to-purple-50 overflow-hidden flex flex-col items-center py-20">
      
      {/* Floating playful shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-36 h-36 bg-pink-300 rounded-full filter blur-3xl opacity-40 animate-float"></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-yellow-300 rounded-full filter blur-3xl opacity-35 animate-float animation-delay-1500"></div>
        <div className="absolute bottom-10 left-24 w-28 h-28 bg-green-300 rounded-full filter blur-2xl opacity-30 animate-float animation-delay-500"></div>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 px-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
          Choose Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Math Level
          </span>{' '}
          <GiPartyPopper className="inline-block ml-2 animate-bounce" />
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
          Learn with fun colors, playful animations, and engaging challenges!
        </p>
      </motion.div>

      {/* Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        {levels.map((level, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-between border-4 border-transparent hover:border-purple-400 transition-all duration-300`}
          >
            <div
              className={`w-28 h-28 rounded-full mb-6 bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg`}
            >
              <h3 className="text-3xl font-bold text-white">{level.title[0]}</h3>
            </div>
            <p className="text-center text-gray-700 mb-6 text-lg">{level.desc}</p>
            <Link href={level.link}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 text-white rounded-full bg-gradient-to-r ${level.color} font-bold shadow-lg text-lg`}
              >
                <GiStarsStack className="inline-block mr-2 animate-spin-slow" />
                Start Learning
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Floating confetti elements for fun */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-yellow-200 opacity-20 animate-spin-slow pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-pink-200 opacity-25 animate-spin-slow pointer-events-none"></div>
    </div>
  );
}

export default LevelSelection;
