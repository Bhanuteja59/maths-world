"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { GiStarsStack } from "react-icons/gi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Loading from "../loading";

// Hugging Face API
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;

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

// Ask Hugging Face AI for kid-friendly explanation
async function askHF(problem, userAnswer, correct) {
  try {
    const res = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3.1",
        messages: [
          {
            role: "user",
            content: `Explain this math problem to a child in very simple words with a short example: 
              Problem: ${problem.question}, Correct Answer: ${problem.answer}, 
              Child's Answer: ${userAnswer}, Was it correct? ${correct}`,
          },
        ],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "I’m still learning 🤖";
  } catch (err) {
    console.error("HF call failed:", err);
    return "Error fetching AI answer.";
  }
}

export default function IntermediatePage() {
  const router = useRouter();

  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
    setProblem(generateIntermediateProblem());
    setAnswer("");
    setFeedback("");
    setIsCorrect(false);
    setAiMessage("");
  };

  const saveStars = async (newStars) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ difficulty: "medium", score: newStars, label: "Intermediate Level" }),
      });
    } catch (err) {
      console.error("Failed to save stars:", err);
    }
  };

  const checkAnswer = async () => {
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
        saveStars(newStars);
      }

      if (newTotalCorrect % 5 === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      // Load AI explanation
      setAiLoading(true);
      const msg = await askHF(problem, answer, true);
      setAiMessage(msg);
      setAiLoading(false);

      setTimeout(() => generateNewProblem(), 3000);
    } else {
      setFeedback(`❌ Oops! Correct answer is ${problem.answer}`);
      setIsCorrect(false);

      // Load AI explanation
      setAiLoading(true);
      const msg = await askHF(problem, answer, false);
      setAiMessage(msg);
      setAiLoading(false);

      setTimeout(() => generateNewProblem(), 4000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") checkAnswer();
  };

  if (!problem) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-pink-100 to-yellow-100 p-4 md:p-8 font-sans">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Problem card */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-2xl p-6 border-4 border-purple-300">
          <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-4">
            🧮 Intermediate Math Practice
          </h1>

          <div className="bg-pink-400 rounded-xl p-4 mb-6 text-center text-white font-bold text-xl shadow-lg">
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
              <h2 className="text-5xl font-extrabold text-blue-900 mb-2">{problem.question} = ?</h2>
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
              className="w-full max-w-xs p-4 text-center text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-400 mb-4 font-bold"
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
                className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-8 py-3 rounded-2xl text-2xl shadow-lg"
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

        {/* Score card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-yellow-300 flex flex-col gap-6 justify-center md:col-span-1">
          <div className="text-center bg-yellow-100 rounded-xl p-4 shadow-inner">
            <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2">
              <GiStarsStack size={32} /> Stars
            </h3>
            <p className="text-4xl font-extrabold text-yellow-500">{stars} ⭐</p>
            <p className="text-2xl text-gray-600 mt-1">1 star = 20 correct answers</p>
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
