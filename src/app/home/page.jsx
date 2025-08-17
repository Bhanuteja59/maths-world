"use client";

import React from "react";
import useAuth from "@/hooks/useAuth";
import Loading from "../loading";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CustomerReview from "../components/CustomerReview";
import Footer from "../components/Footer";
import Services from "../components/Services";
import LevelSelection from "../components/LevelSelection";

export default function HomePage() {
  const { loading } = useAuth({ requireLogin: true });

  if (loading) return <Loading message="Loading Home..." />;

  return (
    <div className="container-fluid">
      <Navbar />
      <HeroSection />
      <LevelSelection />
      <Services />
      <CustomerReview />
      <Footer />
    </div>
  );
}
