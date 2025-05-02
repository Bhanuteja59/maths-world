import React from 'react'
import Link from 'next/link';

function HeroSection() {
  return (
    <div>
      <div className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)" }}>
        <div className="absolute inset-0 bg-gray-900/70">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-yellow-500/20 rounded-full filter blur-3xl"></div>
        </div>
        <div className="absolute top-1/4 left-1/5 w-16 h-16 bg-yellow-400 rounded-full animate-float1 flex items-center justify-center text-2xl font-bold shadow-lg">+</div>
        <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-red-500 rounded-lg rotate-12 animate-float2 flex items-center justify-center text-2xl font-bold shadow-lg">×</div>
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-blue-500 rounded-full animate-float3 flex items-center justify-center text-xl font-bold shadow-lg">÷</div>
        <div className="absolute top-1/5 right-1/5 w-10 h-10 bg-green-500 rounded-lg -rotate-12 animate-float4 flex items-center justify-center text-xl font-bold shadow-lg">−</div>
        <div className="relative z-10 text-center px-6 py-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border-2 border-white/20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              <span className="text-yellow-300">Math</span> <span className="text-blue-300">Adventure</span> <span className="text-pink-300">Time!</span>
            </h1>

            <p className="text-2xl md:text-3xl text-white max-w-2xl mx-auto mb-10 font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] px-4">
              Join our <span className="text-green-300 font-bold">fun</span> learning journey with <span className="text-purple-300 font-bold">games</span>, <span className="text-red-300 font-bold">puzzles</span>, and <span className="text-yellow-300 font-bold">rewards</span>!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/started"
                className="relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-yellow-400/40 transition-all duration-300 transform hover:scale-105 text-xl border-2 border-white/50"
              >
                Start Learning
              </Link>
              
            </div>
          </div>

          {/* <div className="mt-16 animate-bounce-slow bg-white/20 p-4 rounded-full backdrop-blur-sm">
            <svg className="w-24 h-24 mx-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="#F9A825" stroke="#FFF" strokeWidth="3" />
              <circle cx="70" cy="80" r="10" fill="#000" />
              <circle cx="130" cy="80" r="10" fill="#000" />
              <path d="M70 130 Q100 150 130 130" stroke="#000" strokeWidth="5" fill="none" />
              <path d="M50 40 Q100 0 150 40" stroke="#000" strokeWidth="5" fill="none" />
            </svg>
          </div> */}
        </div>

        <div className="absolute top-10 left-10 w-16 h-20 bg-red-500 rounded-full animate-float5 shadow-xl border-2 border-white/30"></div>
        <div className="absolute top-20 right-20 w-14 h-18 bg-blue-500 rounded-full animate-float6 shadow-xl border-2 border-white/30"></div>
      </div>
    </div>
  )
}

export default HeroSection
