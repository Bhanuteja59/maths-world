"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Loading from './loading';

const generateProblem = () => {
  const operations = ["+", "-", "×", "÷"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, answer, solutionSteps;

  switch (operation) {
    case "+":
      num1 = Math.floor(Math.random() * 50) + 10;
      num2 = Math.floor(Math.random() * 50) + 10;
      answer = num1 + num2;
      solutionSteps = [
        `Step 1: Add the ones place: ${num1 % 10} + ${num2 % 10}`,
        `Step 2: Add the tens place: ${Math.floor(num1 / 10)} + ${Math.floor(num2 / 10)}`,
        `Step 3: Combine both results → ${answer}! 🎉`
      ];
      break;

    case "-":
      num1 = Math.floor(Math.random() * 50) + 30;
      num2 = Math.floor(Math.random() * 30) + 10;
      answer = num1 - num2;
      solutionSteps = [
        `Step 1: Start with the bigger number: ${num1}`,
        `Step 2: Take away ${num2} from ${num1}`,
        `Step 3: The answer is ${answer}! 🎉`
      ];
      break;

    case "×":
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      solutionSteps = [
        `Step 1: Multiply the numbers: ${num1} × ${num2}`,
        `Step 2: Think of it as repeated addition`,
        `Step 3: The answer is ${answer}! 🎉`
      ];
      break;

    case "÷":
      num2 = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * (Math.floor(Math.random() * 10) + 1);
      answer = num1 / num2;
      solutionSteps = [
        `Step 1: Think of division as sharing equally`,
        `Step 2: If we have ${num1} and split into ${num2} groups`,
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

  const checkAnswer = () => {
    if (userAnswer.trim() === "") {
      setFeedback("⚠️ Please enter an answer!");
      setSolution([]);
    } else if (parseInt(userAnswer) === problem.answer) {
      setFeedback("✅ Correct! Great job! 🎉");
      setSolution([]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    } else {
      setFeedback("❌ Oops! Let's solve it step by step:");
      setSolution(problem.solutionSteps);
      setShake(true);
      setTimeout(() => setShake(false), 3000); 
    }
  };

  const generateNewProblem = () => {
    setProblem(generateProblem());
    setUserAnswer("");
    setFeedback("");
    setSolution([]);
  };

  const [loading, setLoading] = useState(true);

useEffect(() => {
  setTimeout(() => setLoading(false), 2000);
}, []);

if (loading) {
  return <Loading />;
}

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-blue-50 py-40">
      {showConfetti && <Confetti />}
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Intermediate Level</h1>
      <p className="text-lg text-center mb-4">Let's practice math with fun challenges! 🎯</p>

      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-center transition-all ${
          shake ? "animate-shake" : ""
        }`}
      >
        <p className="text-xl font-semibold mb-2">{problem.question}</p>
        <input
          type="number"
          className="p-2 border rounded w-full text-center"
          placeholder="Your Answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <div className="flex justify-between mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={checkAnswer}
          >
            ✅ Check Answer
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={generateNewProblem}
          >
            🔄 New Problem
          </button>
        </div>

        <p className="mt-4 text-lg font-semibold">{feedback}</p>

        {solution.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
            {solution.map((step, index) => (
              <p key={index} className="mb-2 text-gray-700">{step}</p>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
