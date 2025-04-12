"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Loading from './loading';

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
      `You reach ${answer}!`
    ];
  } else {
    num1 = Math.floor(Math.random() * 10) + 10;
    num2 = Math.floor(Math.random() * 10) + 1;
    answer = num1 - num2;
    steps = [
      `Start with ${num1}.`,
      `Count backwards ${num2} steps.`,
      `You land on ${answer}!`
    ];
  }

  return { question: `${num1} ${operation === "addition" ? "+" : "-"} ${num2} = ?`, answer, steps };
};

export default function Beginners() {
  const [problem, setProblem] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [confetti, setConfetti] = useState(false);

  const checkAnswer = () => {
    if (userAnswer.trim() === "") {
      setFeedback("⚠️ Please enter an answer!");
      setSolutionSteps([]);
    } else if (parseInt(userAnswer) === problem.answer) {
      setFeedback("🎉 Correct! Well done!");
      setSolutionSteps([]);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 6000);
    } else {
      setFeedback("❌ Oops! Let's solve it step by step.");
      setSolutionSteps(problem.steps);
    }
  };

  const generateNewProblem = () => {
    setProblem(generateQuestion());
    setUserAnswer("");
    setFeedback("");
    setSolutionSteps([]);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-blue-200 to-blue-50 py-40">
      {confetti && <Confetti />}
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Beginner Level</h1>
      <p className="text-lg mb-6 text-center text-gray-700">Practice basic math problems!</p>

      <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">{problem.question}</h2>
        <input 
          type="text"
          className="p-3 border rounded w-full text-center text-lg"
          placeholder="Your Answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <div className="flex justify-between mt-4">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
            onClick={checkAnswer}
          >
            ✅ Submit
          </button>
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            onClick={generateNewProblem}
          >
            🔄 New Question
          </button>
        </div>
        <p className="mt-3 font-semibold text-lg text-red-600">{feedback}</p>

        {solutionSteps.length > 0 && (
          <div className="mt-4 bg-yellow-100 p-4 rounded-lg shadow-md text-left">
            <h3 className="text-xl font-semibold mb-2">📖 How to Solve:</h3>
            <ul className="list-disc list-inside">
              {solutionSteps.map((step, index) => (
                <li key={index} className="text-lg text-gray-800">{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
