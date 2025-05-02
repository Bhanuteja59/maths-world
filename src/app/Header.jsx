"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Levels", href: "/levels", icon: "📊" },
    { name: "Practice", href: "/services/exercise", icon: "✏️" },
    { name: "Quiz", href: "/services/quiz", icon: "🧠" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/home" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                ∑
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MathMaster
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${activeLink === item.name
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                onClick={() => setActiveLink(item.name)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/started"
                className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Get Started</span>
                <span>🚀</span>
              </Link>
            </motion.div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {!isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-md"
          >
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg font-medium flex items-center space-x-3 ${activeLink === item.name
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                    onClick={() => {
                      setActiveLink(item.name);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="pt-2"
              >
                <Link
                  href="/get-started"
                  className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Get Started</span>
                  <span>🚀</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}