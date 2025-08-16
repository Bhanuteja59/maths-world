"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Loading from "./loading";
import { motion } from "framer-motion";
import { Sparkles, RefreshCcw, CheckCircle } from "lucide-react";

const generateQuestion = () => {
  const operations = ["addition", "subtraction"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, answer, steps;

  if (operation === "addition") {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    answer = num1 + num2;
    steps = [
      `Start with ${num1} in your head.`,
      `Count forward ${num2} steps.`,
      `You reach ${answer}! 🎉`
    ];
  } else {
    num1 = Math.floor(Math.random() * 10) + 10;
    num2 = Math.floor(Math.random() * 10) + 1;
    answer = num1 - num2;
    steps = [
      `Start with ${num1}.`,
      `Count backwards ${num2} steps.`,
      `You land on ${answer}! 🎉`
    ];
  }

  return {
    question: `${num1} ${operation === "addition" ? "+" : "-"} ${num2} = ?`,
    answer,
    steps,
  };
};

export default function Beginners() {
  const [problem, setProblem] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [confetti, setConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAnswer = () => {
    if (userAnswer.trim() === "") {
      setFeedback("⚠️ Please enter an answer!");
      setSolutionSteps([]);
    } else if (parseInt(userAnswer) === problem.answer) {
      setFeedback("🎉 Correct! You’re awesome!");
      setSolutionSteps([]);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
    } else {
      setFeedback("❌ Oops! Let’s solve it together:");
      setSolutionSteps(problem.steps);
    }
  };

  const generateNewProblem = () => {
    setProblem(generateQuestion());
    setUserAnswer("");
    setFeedback("");
    setSolutionSteps([]);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="h-195 flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-4">
      {confetti && <Confetti />}
      
      <motion.h1
        className="text-5xl font-extrabold mb-4 text-purple-700 drop-shadow-lg flex items-center gap-2"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Sparkles className="text-yellow-500 w-8 h-8" /> Beginner Math Fun!
      </motion.h1>

      <p className="text-lg mb-8 text-center text-gray-700 max-w-md">
        🚀 Practice basic math and become a number hero!
      </p>

      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md border-4 border-yellow-300"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-600">{problem.question}</h2>

        <input
          type="text"
          className="p-3 border-2 border-purple-300 rounded-xl w-full text-center text-2xl focus:outline-none focus:ring-4 focus:ring-purple-200"
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

        {solutionSteps.length > 0 && (
          <motion.div
            className="mt-6 bg-yellow-100 p-5 rounded-xl shadow-inner text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-semibold mb-2 text-purple-700">📖 Steps:</h3>
            <ul className="list-decimal list-inside space-y-2">
              {solutionSteps.map((step, index) => (
                <li key={index} className="text-lg text-gray-800">
                  {step}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
