"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { GiStarsStack } from "react-icons/gi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaStar } from "react-icons/fa"; // attractive star icon
import Loading from "../loading";

// ✅ Custom Progress component
function Progress({ value = 0 }) {
  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden h-3">
      <motion.div
        className="h-full bg-gradient-to-r from-green-400 to-green-600"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}

// Generate intermediate math problem
const generateIntermediateProblem = () => {
  const operations = [
    {
      name: "Addition",
      generate: () => {
        const a = Math.floor(Math.random() * 90) + 10;
        const b = Math.floor(Math.random() * 90) + 10;
        return { question: `${a} + ${b}`, answer: a + b };
      },
    },
    {
      name: "Subtraction",
      generate: () => {
        const a = Math.floor(Math.random() * 90) + 20;
        const b = Math.floor(Math.random() * 20) + 1;
        return { question: `${a} - ${b}`, answer: a - b };
      },
    },
    {
      name: "Multiplication",
      generate: () => {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 12) + 2;
        return { question: `${a} × ${b}`, answer: a * b };
      },
    },
    {
      name: "Division",
      generate: () => {
        const b = Math.floor(Math.random() * 12) + 2;
        const answer = Math.floor(Math.random() * 12) + 2;
        const a = b * answer;
        return { question: `${a} ÷ ${b}`, answer };
      },
    },
  ];

  const op = operations[Math.floor(Math.random() * operations.length)];
  return { ...op.generate(), operation: op.name };
};

export default function IntermediatePage() {
  const STORAGE_KEY = "intermediateProgress";

  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [starAnimation, setStarAnimation] = useState(false);

  // Load progress
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    setStars(saved.stars || 0);
    setTotalCorrect(saved.totalCorrect || 0);
    setTotalProblems(saved.totalProblems || 0);
    generateNewProblem();
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stars, totalCorrect, totalProblems })
    );
  }, [stars, totalCorrect, totalProblems]);

  const generateNewProblem = () => {
    setProblem(generateIntermediateProblem());
    setAnswer("");
    setFeedback("");
    setIsCorrect(false);
  };

  const checkAnswer = () => {
    if (answer === "") return;

    const correct = parseInt(answer) === problem.answer;
    setTotalProblems((prev) => prev + 1);

    if (correct) {
      setFeedback("🎉 Correct!");
      setIsCorrect(true);

      const newTotalCorrect = totalCorrect + 1;
      setTotalCorrect(newTotalCorrect);

      const newStars = Math.floor(newTotalCorrect / 20);
      if (newStars > stars) {
        setStars(newStars);
        setStarAnimation(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setTimeout(() => setStarAnimation(false), 2000);
      }

      setTimeout(() => generateNewProblem(), 2000);
    } else {
      setFeedback(`❌ Oops! Correct answer is ${problem.answer}`);
      setIsCorrect(false);
      setTimeout(() => generateNewProblem(), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") checkAnswer();
  };

  if (!problem) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-pink-100 to-yellow-100 p-4 md:p-8 font-sans">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Problem Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 border-4 border-purple-300">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-6">
            🧮 Intermediate Math Practice
          </h1>

          <div className="bg-pink-400 rounded-xl p-3 md:p-4 mb-6 text-center text-white font-bold text-lg md:text-xl shadow-md">
            Problem {totalProblems + 1}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={problem.question}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-6"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-3">
                {problem.question} = ?
              </h2>
              <p className="text-lg font-semibold text-gray-700">
                Operation: {problem.operation}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Input & Buttons */}
          <div className="flex flex-col items-center gap-4">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your answer"
              disabled={isCorrect}
              className="w-full max-w-xs p-4 text-center text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-400 font-bold"
            />

            {feedback && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-xl md:text-2xl font-bold ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback}
              </motion.p>
            )}

            {!isCorrect && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkAnswer}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-2xl text-lg md:text-xl shadow-lg"
              >
                ✅ Check Answer
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                generateNewProblem();
                setAnswer("");
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg text-lg"
            >
              🔄 Skip Question
            </motion.button>
          </div>
        </div>

        {/* Right Section: Score / Progress */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-300 flex flex-col gap-6 justify-start sticky top-6 h-fit">
          
          {/* Stars */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={starAnimation ? { scale: [1, 1.5, 1] } : { scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-yellow-100 rounded-xl p-5 shadow-inner"
          >
            <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
              <GiStarsStack size={28} /> Stars Earned
            </h3>
            <p className="text-5xl font-extrabold text-yellow-500 drop-shadow-lg mt-2">
              {stars} <FaStar className="inline text-yellow-400" />
            </p>
            <p className="text-sm text-gray-600 mt-1">
              (1 star = 20 correct answers)
            </p>
          </motion.div>

          {/* Progress */}
          <div className="text-center bg-green-100 rounded-xl p-5 shadow-inner">
            <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
              <AiOutlineCheckCircle size={26} /> Correct Answers
            </h3>
            <p className="text-4xl font-extrabold text-green-600 mt-2">
              {totalCorrect}
            </p>
            <Progress value={(totalCorrect % 20) * 5} />
            <p className="text-sm text-gray-600 mt-2">
              {20 - (totalCorrect % 20)} more for next ⭐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
