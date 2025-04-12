'use client';

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Loading from "./loading";

const OPERATIONS = {
  addition: { name: "Addition", icon: "+", levels: ["Easy", "Medium", "Hard"] },
  subtraction: { name: "Subtraction", icon: "-", levels: ["Easy", "Medium", "Hard"] },
  multiplication: { name: "Multiplication", icon: "×", levels: ["Easy", "Medium", "Hard"] },
  division: { name: "Division", icon: "÷", levels: ["Medium", "Hard"] },
  "square-root": { name: "Square Roots", icon: "√", levels: ["Hard"] },
  exponents: { name: "Exponents", icon: "xⁿ", levels: ["Medium", "Hard"] }
};

const generateProblem = (operation, difficulty) => {
  let num1, num2, answer;
  const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  switch (operation) {
    case "addition":
      if (difficulty === "Easy") {
        num1 = getRandom(1, 10);
        num2 = getRandom(1, 10);
      } else if (difficulty === "Medium") {
        num1 = getRandom(10, 50);
        num2 = getRandom(10, 50);
      } else {
        num1 = getRandom(50, 200);
        num2 = getRandom(50, 200);
      }
      answer = num1 + num2;
      return { 
        question: `${num1} + ${num2} = ?`, 
        answer: answer.toString(),
        operation,
        difficulty
      };

    case "subtraction":
      if (difficulty === "Easy") {
        num1 = getRandom(5, 20);
        num2 = getRandom(1, num1);
      } else if (difficulty === "Medium") {
        num1 = getRandom(20, 100);
        num2 = getRandom(10, num1);
      } else {
        num1 = getRandom(100, 500);
        num2 = getRandom(50, num1);
      }
      answer = num1 - num2;
      return { 
        question: `${num1} - ${num2} = ?`, 
        answer: answer.toString(),
        operation,
        difficulty
      };

    case "multiplication":
      if (difficulty === "Easy") {
        num1 = getRandom(1, 5);
        num2 = getRandom(1, 5);
      } else if (difficulty === "Medium") {
        num1 = getRandom(3, 9);
        num2 = getRandom(3, 9);
      } else {
        num1 = getRandom(5, 15);
        num2 = getRandom(5, 15);
      }
      answer = num1 * num2;
      return { 
        question: `${num1} × ${num2} = ?`, 
        answer: answer.toString(),
        operation,
        difficulty
      };

    case "division":
      if (difficulty === "Medium") {
        num2 = getRandom(2, 5);
        num1 = num2 * getRandom(2, 5);
      } else {
        num2 = getRandom(3, 10);
        num1 = num2 * getRandom(3, 10);
      }
      answer = num1 / num2;
      return { 
        question: `${num1} ÷ ${num2} = ?`, 
        answer: answer.toString(),
        operation,
        difficulty
      };

    case "square-root":
      num1 = Math.pow(getRandom(2, 12), 2);
      if (difficulty === "Hard") {
        // Add decimal squares for harder problems
        if (Math.random() > 0.5) {
          const root = getRandom(1, 5) + Math.random();
          num1 = parseFloat((root * root).toFixed(2));
          answer = parseFloat(root.toFixed(2));
        } else {
          answer = Math.sqrt(num1);
        }
      } else {
        answer = Math.sqrt(num1);
      }
      return { 
        question: `√${num1} = ?`, 
        answer: answer.toString(),
        operation,
        difficulty
      };

    case "exponents":
      if (difficulty === "Medium") {
        num1 = getRandom(2, 5);
        num2 = getRandom(2, 3);
      } else {
        num1 = getRandom(2, 6);
        num2 = getRandom(3, 4);
      }
      answer = Math.pow(num1, num2);
      return { 
        question: `${num1}^${num2} = ?`, 
        answer: answer.toString(),
        operation,
        difficulty
      };

    default:
      return { question: "", answer: "", operation, difficulty: "Medium" };
  }
};

export default function ExercisePage() {
  const [selectedOperations, setSelectedOperations] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [problems, setProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mode, setMode] = useState("selection"); // 'selection' or 'practice'
  const [loading, setLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Initialize operations
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const startPractice = useCallback(() => {
    if (selectedOperations.length === 0) return;
    
    const initialProblems = selectedOperations.map(op => 
      generateProblem(op, difficulty)
    );
    
    setProblems(initialProblems);
    setUserAnswers(Array(selectedOperations.length).fill(""));
    setFeedback(Array(selectedOperations.length).fill(""));
    setMode("practice");
    setTimerActive(true);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setCorrectAnswers(0);
    setTotalAttempts(0);
  }, [selectedOperations, difficulty]);


  const handleOperationToggle = (operation) => {
    setSelectedOperations(prev =>
      prev.includes(operation)
        ? prev.filter(op => op !== operation)
        : [...prev, operation]
    );
  };

  const handleChange = (index, value) => {
    // Only allow numbers and decimal points
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      const newAnswers = [...userAnswers];
      newAnswers[index] = value;
      setUserAnswers(newAnswers);
    }
  };

  const handleCheckAnswer = (index) => {
    if (userAnswers[index].trim() === "") {
      const newFeedback = [...feedback];
      newFeedback[index] = { message: "Please enter a number", isCorrect: false };
      setFeedback(newFeedback);
      return;
    }

    const isCorrect = parseFloat(userAnswers[index]) === parseFloat(problems[index].answer);
    const newFeedback = [...feedback];
    
    if (isCorrect) {
      newFeedback[index] = { 
        message: "Correct! 🎉", 
        isCorrect: true 
      };
      setScore(prev => prev + (10 * (streak + 1)));
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setCorrectAnswers(prev => prev + 1);
      
      if (streak + 1 >= 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      newFeedback[index] = { 
        message: `Incorrect. The answer was ${problems[index].answer}.`, 
        isCorrect: false 
      };
      setStreak(0);
    }
    
    setFeedback(newFeedback);
    setTotalAttempts(prev => prev + 1);
  };

  const generateNewProblem = (index) => {
    const newProblems = [...problems];
    newProblems[index] = generateProblem(problems[index].operation, difficulty);
    setProblems(newProblems);
    
    const newFeedback = [...feedback];
    newFeedback[index] = "";
    setFeedback(newFeedback);
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = "";
    setUserAnswers(newUserAnswers);
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <AnimatePresence mode="wait">
        {mode === "selection" ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Math Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Challenge</span>
              </h1>
              <p className="text-xl text-gray-600">
                Select operations and difficulty to begin your math workout
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose Operations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(OPERATIONS).map(([key, op]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${selectedOperations.includes(key) ? 'border-blue-500 bg-grey-50 text-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => handleOperationToggle(key)}
                  >
                    <span className="text-2xl font-bold mb-1">{op.icon}</span>
                    <span>{op.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Difficulty</h2>
              <div className="flex flex-wrap gap-3">
                {["Easy", "Medium", "Hard"].map(level => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg transition-all font-medium ${difficulty === level ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full text-lg font-bold text-white shadow-lg transition-all ${selectedOperations.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
                onClick={startPractice}
                disabled={selectedOperations.length === 0}
              >
                Start Practice Session
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="practice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <motion.h1 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-0"
              >
                Math Practice: <span className="text-danger bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{difficulty} Level</span>
              </motion.h1>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-white rounded-xl p-3 shadow-md flex items-center">
                  <span className="font-bold text-gray-700 mr-2">🏆</span>
                  <span>{score} pts</span>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-md flex items-center">
                  <span className="font-bold text-gray-700 mr-2">🔥</span>
                  <span>Streak: {streak}</span>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-md flex items-center">
                  <span className="font-bold text-gray-700 mr-2">🎯</span>
                  <span>{accuracy}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className={`p-4 ${OPERATIONS[problem.operation].levels.includes("Hard") ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : OPERATIONS[problem.operation].levels.includes("Medium") ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-green-600 to-blue-600'}`}>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-white">
                        {OPERATIONS[problem.operation].name}
                      </h2>
                      <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm text-black">
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-center mb-6">
                      <div className="text-5xl font-bold text-gray-800 py-4 px-8 bg-gray-50 rounded-lg">
                        {problem.question}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <input
                        type="text"
                        className={`w-full p-4 text-center text-xl border-2 rounded-lg transition-all focus:outline-none focus:ring-2 ${feedback[index]?.isCorrect ? 'border-green-500 focus:ring-green-200' : feedback[index] && !feedback[index]?.isCorrect ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                        value={userAnswers[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder="Your answer"
                        onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer(index)}
                      />
                      {feedback[index] && (
                        <p className={`mt-2 text-center font-medium ${feedback[index].isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {feedback[index].message}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-between gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                        onClick={() => handleCheckAnswer(index)}
                      >
                        <span>✓</span> Submit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                        onClick={() => generateNewProblem(index)}
                      >
                        <span>🔄</span> New Problem
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-10 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium shadow-lg"
                onClick={() => setMode("selection")}
              >
                ← Back to Selection
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}