"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { GiStarsStack } from "react-icons/gi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaStar } from "react-icons/fa";

import Loading from "../loading";

// ✅ Custom Progress Component (no dependency issues)
function Progress({ value = 0 }) {
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Generate advanced math problem
const generateAdvancedProblem = () => {
  const operations = [
    {
      name: "Addition",
      generate: () => {
        const a = Math.floor(Math.random() * 900) + 100;
        const b = Math.floor(Math.random() * 900) + 100;
        return { question: `${a} + ${b}`, answer: a + b };
      },
    },
    {
      name: "Subtraction",
      generate: () => {
        const a = Math.floor(Math.random() * 900) + 200;
        const b = Math.floor(Math.random() * 200) + 50;
        return { question: `${a} - ${b}`, answer: a - b };
      },
    },
    {
      name: "Multiplication",
      generate: () => {
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 20) + 5;
        return { question: `${a} × ${b}`, answer: a * b };
      },
    },
    {
      name: "Division",
      generate: () => {
        const b = Math.floor(Math.random() * 20) + 5;
        const answer = Math.floor(Math.random() * 20) + 5;
        const a = b * answer;
        return { question: `${a} ÷ ${b}`, answer };
      },
    },
    {
      name: "Mixed",
      generate: () => {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;
        const c = Math.floor(Math.random() * 20) + 1;
        return { question: `(${a} + ${b}) × ${c}`, answer: (a + b) * c };
      },
    },
  ];

  const op = operations[Math.floor(Math.random() * operations.length)];
  return { ...op.generate(), operation: op.name };
};

export default function AdvancedPage() {
  const router = useRouter();

  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
    setProblem(generateAdvancedProblem());
    setAnswer("");
    setFeedback("");
    setIsCorrect(false);
  };

  const saveStars = async (newStars) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) return;
      await fetch(`${API_URL}/user/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ difficulty: "hard", score: newStars, label: "Advanced Level" }),
      });
    } catch (err) {
      console.error("Failed to save stars:", err);
    }
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

      const newStars = Math.floor(newTotalCorrect / 25);
      if (newStars > stars) {
        setStars(newStars);
        saveStars(newStars);
      }

      if (newTotalCorrect % 5 === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      setTimeout(() => generateNewProblem(), 1500);
    } else {
      setFeedback(`❌ Oops! Correct answer is ${problem.answer}`);
      setIsCorrect(false);
      setTimeout(() => generateNewProblem(), 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") checkAnswer();
  };

  if (!problem) return <div className="text-center">
    <Loading />
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-50 via-red-50 to-purple-50 p-4 md:p-8 font-sans">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Problem card */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-2xl p-8 border-4 border-red-300 flex flex-col justify-between">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-purple-800 mb-6">
            🔢 Advanced Math Practice
          </h1>

          <div className="bg-red-400 rounded-xl p-4 mb-6 text-center text-white font-bold text-2xl shadow-lg">
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
              <h2 className="text-5xl font-extrabold text-purple-900 mb-2">{problem.question} = ?</h2>
              <p className="text-lg font-semibold text-gray-700">Operation: {problem.operation}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col items-center">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your answer"
              disabled={isCorrect}
              className="w-full max-w-xs p-4 text-center text-2xl border-4 border-purple-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-400 mb-4 font-bold"
            />

            {feedback && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-2xl font-bold mb-4 ${isCorrect ? "text-green-600" : "text-red-600"}`}
              >
                {feedback}
              </motion.p>
            )}

            {!isCorrect && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkAnswer}
                className="bg-red-400 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-2xl text-2xl shadow-lg"
              >
                ✅ Check Answer
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => generateNewProblem()}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg mt-4 text-lg"
            >
              🔄 Skip Question
            </motion.button>
          </div>
        </div>

        {/* Score card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-yellow-300 flex flex-col gap-6 justify-center">
          <div className="text-center bg-yellow-100 rounded-xl p-4 shadow-inner">
            <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
              <GiStarsStack size={32} /> Stars
            </h3>
            <p className="text-4xl font-extrabold text-yellow-500">{stars} ⭐</p>
            <p className="text-lg text-gray-600 mt-1">1 star = 25 correct answers</p>
          </div>

          <div className="text-center bg-green-100 rounded-xl p-4 shadow-inner">
            <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
              <AiOutlineCheckCircle size={32} /> Correct Answers
            </h3>
            <p className="text-4xl font-extrabold text-red-500">{totalCorrect}</p>
          </div>

          <div className="mt-2">
            <Progress value={(totalCorrect % 25) * 4} />
            <p className="text-sm text-gray-600 mt-1 text-center">Progress toward next ⭐</p>
          </div>
        </div>
      </div>
    </div>
  );
}
