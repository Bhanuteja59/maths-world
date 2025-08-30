"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { GiStarsStack } from "react-icons/gi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Loading from "../loading";



const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Generate easy math problem
const generateEasyProblem = () => {
  const operations = [
    {
      name: "Addition",
      generate: () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        return { question: `${a} + ${b}`, answer: a + b };
      },
    },
    {
      name: "Subtraction",
      generate: () => {
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * a) + 1;
        return { question: `${a} - ${b}`, answer: a - b };
      },
    },
    {
      name: "Multiplication",
      generate: () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        return { question: `${a} × ${b}`, answer: a * b };
      },
    },
  ];

  const op = operations[Math.floor(Math.random() * operations.length)];
  return { ...op.generate(), operation: op.name };
};

export default function EasyPage() {
  const router = useRouter();

  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0); // Only correct answers
  const [totalProblems, setTotalProblems] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
    setProblem(generateEasyProblem());
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
        body: JSON.stringify({ difficulty: "easy", score: newStars, label: "Easy Level" }),
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

      // Update stars every 10 correct answers
      const newStars = Math.floor(newTotalCorrect / 10);
      if (newStars > stars) {
        setStars(newStars);
        saveStars(newStars);
      }

      if (newTotalCorrect % 3 === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      // Auto-load next problem after 1.5s
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

  if (!problem) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-100 via-green-100 to-blue-100 p-4 md:p-8 font-sans">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: Problem card */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-2xl p-6 border-4 border-yellow-300">
          <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-4">
            🎈 Easy Math Practice
          </h1>

          <div className="bg-blue-400 rounded-xl p-4 mb-6 text-center text-white font-bold text-xl shadow-lg">
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
              <h2 className="text-5xl font-extrabold text-purple-800 mb-2">{problem.question} = ?</h2>
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
              className="w-full max-w-xs p-4 text-center text-2xl border-4 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400 mb-4 font-bold"
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
                className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-8 py-3 rounded-2xl text-2xl shadow-lg"
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
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg mt-4 text-lg"
          >
            🔄 Skip Question
          </motion.button>
          </div>
        </div>

        {/* Right side: Score card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-pink-300 flex flex-col gap-6 justify-center">
          <div className="text-center bg-pink-100 rounded-xl p-4 shadow-inner">
            <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
              <GiStarsStack size={32} /> Stars
            </h3>
            <p className="text-4xl font-extrabold text-yellow-500">{stars} ⭐</p>
            <p className="text-2xl text-gray-600 mt-1">1 star = 10 correct answers</p>
          </div>

          <div className="text-center bg-green-100 rounded-xl p-4 shadow-inner">
            <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
              <AiOutlineCheckCircle size={32} /> Correct Answers
            </h3>
            <p className="text-4xl font-extrabold text-red-500">{totalCorrect}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
