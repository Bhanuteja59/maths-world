"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "./loading";
import "./style.css"

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Welcome to Our Learning Platform
          </h1>
          <p className="text-xl mb-8 animate-fade-in">
            Learn, practice, and master new skills with our interactive courses.
          </p>
          <Link href="#">
            <button className=" btn btn-secondary ">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20" id="services">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            { title: "Learn", desc: "Access tutorials.", link: "/services/learn" },
            { title: "Exercise", desc: "Practice exercises.", link: "/services/exercise" },
            { title: "Quiz", desc: "Challenge yourself.", link: "/services/quiz" }
          ].map((service, index) => (
            <div
              key={service.title}
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:scale-105 transition duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 0.2}s` }} // Staggered animation delay
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.desc}</p>
              <Link href={service.link}>
                <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500 transition">
                  Explore
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "📚", title: "Comprehensive Courses", desc: "Learn from industry experts with hands-on projects." },
              { icon: "🎯", title: "Personalized Learning", desc: "Tailored learning paths to suit your goals." },
              { icon: "🏆", title: "Certification", desc: "Earn certificates to showcase your skills." }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-700">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "John Doe", review: "This platform helped me land my dream job!", avatar: "👨‍💻" },
              { name: "Jane Smith", review: "The courses are well-structured and easy to follow.", avatar: "👩‍🎓" },
              { name: "Alex Johnson", review: "I love the interactive quizzes and exercises.", avatar: "🧑‍🔧" }
            ].map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-6xl mb-6">{testimonial.avatar}</div>
                <p className="text-gray-600 mb-4">{testimonial.review}</p>
                <h3 className="text-xl font-semibold text-blue-700">{testimonial.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        {/* <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-facebook text-2xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
          </div>
          <p className="text-gray-400">© 2023 Your Company. All rights reserved.</p>
        </div> */}
      </footer>
    </div>
  );
}