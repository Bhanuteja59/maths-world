"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import "./Header.css"; // Import the CSS file

export default function Header() {
  const [activeLink, setActiveLink] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/home", icon: "🏠" },
    { name: "Exercise", href: "/services/exercise", icon: "✏️" },
    { name: "Quiz", href: "/services/quiz", icon: "🧠" },
    { name: "Profile", href: "/dashboard", icon: "👤" },
  ];

  return (
    <header className="fixed-top shadow-sm border-bottom bg-white">
      <div className="container-fluid px-4 md:px-6">
        <div className="d-flex justify-content-between align-items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/home" className="d-flex align-items-center gap-2 text-decoration-none">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg d-flex align-items-center justify-content-center text-white font-bold shadow-md">
                ∑
              </div>
              <span className="fs-4 fw-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MathMaster
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="d-none d-md-flex align-items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link-custom d-flex align-items-center gap-1 ${activeLink === item.name ? "active-link" : ""
                  }`}
                onClick={() => setActiveLink(item.name)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="d-md-none d-flex align-items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-light p-2 rounded-circle shadow-sm"
              aria-label="Toggle menu"
            >
              {!isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="d-md-none bg-white shadow-md border-top"
        >
          <div className="px-4 py-2 d-flex flex-column gap-2 text-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`mobile-nav-link px-3 py-2 text-decoration-none ${activeLink === item.name ? "active-link" : ""
                  }`}
                onClick={() => {
                  setActiveLink(item.name);
                  setIsMenuOpen(false);
                }}
              >
                <span>{item.icon} </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
