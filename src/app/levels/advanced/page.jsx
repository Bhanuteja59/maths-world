"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Loading from "./loading";
import { motion } from "framer-motion";
import { Brain, RefreshCcw, CheckCircle, Star } from "lucide-react";

const generateProblem = () => {
  const operations = ["+", "-", "×", "÷"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, answer, solutionSteps;

  switch (operation) {
    case "+":
      num1 = Math.floor(Math.random() * 150) + 10;
      num2 = Math.floor(Math.random() * 150) + 10;
      answer = num1 + num2;
      solutionSteps = [
        `Step 1: Add the ones place: ${num1 % 10} + ${num2 % 10}`,
        `Step 2: Add the tens place: ${Math.floor(num1 / 10)} + ${Math.floor(num2 / 10)}`,
        `Step 3: Combine both → ${answer}! 🎉`
      ];
      break;

    case "-":
      num1 = Math.floor(Math.random() * 150) + 30;
      num2 = Math.floor(Math.random() * 130) + 10;
      answer = num1 - num2;
      solutionSteps = [
        `Step 1: Start with ${num1}`,
        `Step 2: Subtract ${num2}`,
        `Step 3: Answer is ${answer}! 🎉`
      ];
      break;

    case "×":
      num1 = Math.floor(Math.random() * 112) + 1;
      num2 = Math.floor(Math.random() * 112) + 1;
      answer = num1 * num2;
      solutionSteps = [
        `Step 1: Multiply ${num1} × ${num2}`,
        `Step 2: Think of it as repeated addition`,
        `Step 3: The answer is ${answer}! 🎉`
      ];
      break;

    case "÷":
      num2 = Math.floor(Math.random() * 110) + 1;
      num1 = num2 * (Math.floor(Math.random() * 110) + 1);
      answer = num1 / num2;
      solutionSteps = [
        `Step 1: Division is sharing equally`,
        `Step 2: Split ${num1} into ${num2} groups`,
        `Step 3: Each group gets ${answer}! 🎉`
      ];
      break;

    default:
      return {};
  }

  return { question: `${num1} ${operation} ${num2} = ?`, answer, solutionSteps };
};

export default function Intermediate() {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [solution, setSolution] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(true);

  // ⭐ Progress / Score System
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const totalQuestions = 10; // Level goal

  const checkAnswer = () => {
    if (userAnswer.trim() === "") {
      setFeedback("⚠️ Please enter an answer!");
      setSolution([]);
    } else if (parseInt(userAnswer) === problem.answer) {
      setFeedback("🎉 Correct! You earned a ⭐!");
      setSolution([]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      setScore((prev) => prev + 1);
      setQuestionsAnswered((prev) => prev + 1);
    } else {
      setFeedback("❌ Try again! Let's solve together:");
      setSolution(problem.solutionSteps);
      setShake(true);
      setTimeout(() => setShake(false), 800);
      setQuestionsAnswered((prev) => prev + 1);
    }
  };

  const generateNewProblem = () => {
    setProblem(generateProblem());
    setUserAnswer("");
    setFeedback("");
    setSolution([]);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <Loading />;

  const progressPercent = Math.min((questionsAnswered / totalQuestions) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-blue-100 to-indigo-200 p-6">
      {showConfetti && <Confetti />}

      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold mb-4 text-indigo-700 drop-shadow-lg flex items-center gap-2"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Brain className="text-green-600 w-10 h-10" /> Advanced Math Quest
      </motion.h1>
      
      {/* Problem Card */}
      <motion.div
        className={`bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-lg border-4 border-indigo-300 ${
          shake ? "animate-shake" : ""
        }`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700">{problem.question}</h2>

        <input
          type="number"
          className="p-3 border-2 border-indigo-300 rounded-xl w-full text-center text-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200"
          placeholder="Type your answer..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />

        <div className="flex justify-between mt-6 gap-3">
          <button
            className="flex-1 bg-green-500 text-white px-4 py-3 rounded-xl text-lg font-bold shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
            onClick={checkAnswer}
          >
            <CheckCircle className="w-5 h-5" /> Submit
          </button>
          <button
            className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-xl text-lg font-bold shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
            onClick={generateNewProblem}
          >
            <RefreshCcw className="w-5 h-5" /> New
          </button>
        </div>

        <p className="mt-4 font-bold text-xl text-red-600">{feedback}</p>

        {solution.length > 0 && (
          <motion.div
            className="mt-6 bg-indigo-100 p-5 rounded-xl shadow-inner text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">📖 Solution:</h3>
            <ul className="list-decimal list-inside space-y-2">
              {solution.map((step, index) => (
                <li key={index} className="text-lg text-gray-800">
                  {step}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
