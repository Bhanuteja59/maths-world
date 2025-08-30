import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GiBookshelf, GiPuzzle } from 'react-icons/gi';

const services = [
  {
    title: 'Exercise',
    desc: 'Practice with interactive exercises to reinforce your learning.',
    link: '/services/exercise',
    icon: <GiBookshelf className="w-12 h-12 text-green-500" />,
    color: 'from-green-300 to-green-500',
  },
  {
    title: 'Quiz',
    desc: 'Test your knowledge with challenging quizzes and track your progress.',
    link: '/services/quiz',
    icon: <GiPuzzle className="w-12 h-12 text-purple-500" />,
    color: 'from-purple-300 to-purple-500',
  },
];

function Services() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 overflow-hidden py-24">
      {/* Floating playful shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-36 h-36 bg-pink-300 rounded-full filter blur-3xl opacity-40 animate-float"></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-yellow-300 rounded-full filter blur-3xl opacity-35 animate-float animation-delay-1500"></div>
        <div className="absolute bottom-10 left-24 w-28 h-28 bg-green-300 rounded-full filter blur-2xl opacity-30 animate-float animation-delay-500"></div>
      </div>

      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 px-6"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
          Our Learning{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Services
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
          Fun and interactive ways to boost your math skills
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto px-6">
        {services.map((service, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-between border-4 border-transparent hover:border-purple-400 transition-all duration-300"
          >
            <div
              className={`w-28 h-28 rounded-full mb-6 bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}
            >
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
            <p className="text-gray-700 text-center mb-6">{service.desc}</p>
            <Link href={service.link}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 text-white rounded-full bg-gradient-to-r ${service.color} font-bold shadow-lg text-lg`}
              >
                Explore {service.title}
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Subtle floating confetti elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-yellow-200 opacity-20 animate-spin-slow pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-pink-200 opacity-25 animate-spin-slow pointer-events-none"></div>
    </div>
  );
}

export default Services;
