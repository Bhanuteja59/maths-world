"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "./loading";

// keep your classNames/components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CustomerReview from "./components/CustomerReview";
import Footer from "./components/Footer";
import Services from "./components/Services";
import LevelSelection from "./components/LevelSelection";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      router.replace("/home");
      return;
    }

    const existingToken = localStorage.getItem("jwt");
    if (existingToken) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, [router, searchParams]);

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

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
};

export default Page;
