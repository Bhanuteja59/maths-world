'use client';

import React, { useState, useEffect } from 'react';
import Loading from './loading';

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CustomerReview from "./components/CustomerReview";
import Footer from "./components/Footer";
import Services from "./components/Services";
import LevelSelection from "./components/LevelSelection";


const Page = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-fluid ">

      <Navbar />
      <HeroSection />
      <LevelSelection />
      <Services />
      <CustomerReview />
      <Footer />
      

    </div>
  );
};

export default Page;
