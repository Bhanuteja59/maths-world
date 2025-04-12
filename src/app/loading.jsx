'use client';

import { motion } from 'framer-motion';

export default function loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 z-50">
      {/* Animated math symbols floating in background */}
      {['+', '−', '×', '÷', 'π', '=', '√'].map((symbol, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl text-white/20"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() > 0.5 ? 30 : -30, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Main loading animation */}
      <div className="relative z-10 text-center">
        <motion.div
          className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 mx-auto mb-8 p-6"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <div className="w-full h-full relative">
            <motion.div
              className="absolute top-0 left-0 w-10 h-10 bg-yellow-400 rounded-full"
              animate={{
                x: [0, 40, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-10 h-10 bg-pink-400 rounded-full"
              animate={{
                x: [0, -40, 0],
                y: [0, -40, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-white mb-2"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Loading Maths World
        </motion.h2>

        <motion.div
          className="h-1 w-48 bg-white/20 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.p
          className="mt-4 text-white/70"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          Preparing interactive lessons...
        </motion.p>
      </div>
    </div>
  );
}