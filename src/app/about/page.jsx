"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100 text-gray-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-pink-300 rounded-full blur-2xl opacity-30 animate-float animation-delay-1000"></div>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-amber-900 mb-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="text-amber-600">Maths World</span> 🌍
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl max-w-3xl mx-auto text-gray-700 leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          A fun and interactive learning platform designed for children 🚀.  
          Solve questions, earn stars ⭐, and unlock new challenges as you grow your skills in mathematics!
        </motion.p>
      </section>

      {/* Levels Section */}
      <section className="px-6 py-16 bg-white shadow-inner">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <motion.div
            className="bg-amber-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-bold text-amber-700 mb-3">Easy Level 🍭</h2>
            <p className="text-gray-600">Every <span className="font-semibold text-amber-800">10 questions</span> completed = <span className="font-bold">1 star</span>.</p>
          </motion.div>

          <motion.div
            className="bg-pink-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-bold text-pink-700 mb-3">Intermediate Level 🎯</h2>
            <p className="text-gray-600">Every <span className="font-semibold text-pink-800">20 questions</span> completed = <span className="font-bold">1 star</span>.</p>
          </motion.div>

          <motion.div
            className="bg-blue-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl font-bold text-blue-700 mb-3">Advanced Level 🧠</h2>
            <p className="text-gray-600">Every <span className="font-semibold text-blue-800">25 questions</span> completed = <span className="font-bold">1 star</span>.</p>
          </motion.div>
        </div>
      </section>

      {/* Why Login Section */}
      <section className="px-6 py-16 text-center bg-amber-50">
        <h2 className="text-3xl font-bold text-amber-900 mb-6">Why Login? 🔑</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700">
          Logging in allows you to <span className="font-semibold text-amber-700">save your progress</span>,  
          track stars ⭐, and unlock exclusive levels and rewards.  
          Without login, you can still play, but your progress won’t be saved.
        </p>
      </section>

      {/* Developer Section */}
      <section className="px-6 py-16 text-center bg-gradient-to-r from-amber-100 to-pink-100">
        <motion.h2
          className="text-3xl font-bold text-amber-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Meet the Developer 👨‍💻
        </motion.h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Hi, I’m <span className="font-semibold text-amber-700">Bhanu Teja</span>.  
          I love creating educational and fun applications that help children learn better.  
          Let’s connect!
        </p>

        <div className="flex justify-center gap-6">
          <a
            href="https://www.linkedin.com/in/bhanuteja59/"
            target="_blank"
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg border border-amber-200 transition-all"
          >
            LinkedIn
          </a>
          <a
            href="mailto:bhanutejareddy59@gmail.com"
            target="_blank"
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg border border-amber-200 transition-all"
          >
            Gmail
          </a>
          <a
            href="https://portfolio-psi-lovat-40.vercel.app/"
            target="_blank"
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg border border-amber-200 transition-all"
          >
            Portfolio
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-100 text-amber-900 py-8 text-center mt-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Maths World. Built with ❤️ by Bhanu Teja.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
