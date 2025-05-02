"use client";

import React, { useState, useEffect } from "react";
import { checkAnswer, generateRandomProblem } from "./mathLogic";
import Link from "next/link";
import "./style.css";
import Loading from "../loading";

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [problem, setProblem] = useState({});
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    generateNewProblem("addition");
  }, []);

  const generateNewProblem = (operation) => {
    const { num1, num2, answer } = generateRandomProblem(operation);
    setProblem({ num1, num2, answer, operation });
    setMessage(`Solve: ${num1} ${getOperator(operation)} ${num2}`);
    setIsCorrect(null);
    setCorrectAnswer(null);
    setErrorMessage("");
    setAnswer("");
  };

  const getOperator = (operation) => {
    const operators = {
      addition: "+",
      subtraction: "-",
      multiplication: "×",
      division: "÷",
      squareRoot: "√",
    };
    return operators[operation] || "";
  };

  const handleCheckAnswer = () => {
    if (answer === "") {
      setErrorMessage("Please enter a number.");
      return;
    }

    const parsedAnswer = parseFloat(answer);
    if (isNaN(parsedAnswer)) {
      setErrorMessage("Please enter a valid number.");
      return;
    }

    const result = checkAnswer(parsedAnswer, problem.answer);
    setIsCorrect(result.isCorrect);
    setCorrectAnswer(result.correctAnswer);

    setMessage(result.isCorrect ? "🎉 Correct! Well done!" : `❌ Incorrect. The correct answer is: ${result.correctAnswer}`);
    setErrorMessage("");
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <section>
      <div className="container-fluid mt-5 learn">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold mb-4 ">Welcome to the Beginner's Math Project</h1>
          <img
            src="https://github.com/Bhanuteja59/waste/blob/main/roadmap%20of%20maths.jpg?raw=true"
            alt="Math Roadmap"
            className="img-fluid rounded-lg roadMapImg mx-auto"
          />
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="left-sidebar p-3 border rounded">
              <h3>Lessons</h3>
              <ul className="list-unstyled">
                <Link href="#addition"><li>Addition</li></Link>
                <Link href="#subtraction"><li>Subtraction</li></Link>
                <Link href="#multiplication"><li>Multiplication</li></Link>
                <Link href="#division"><li>Division</li></Link>
                <Link href="#square-root"><li>Square Root</li></Link>
              </ul>

            </div>
          </div>

          <div className="col-md-9">
            {/* Addition Section */}
            <div id="addition" className="lesson-card">
              <h3>Learning Addition</h3>
              <div className="step-box">
                <h4>Step 1: Understanding Numbers</h4>
                <p>Let's take two numbers: <strong>2</strong> and <strong>3</strong>.</p>
              </div>
              <div className="step-box">
                <h4>Step 2: Counting Objects</h4>
                <p>You have <strong>2 apples</strong> 🍎🍎 and your friend gives you <strong>3 more</strong> 🍏🍏🍏.</p>
              </div>
              <div className="step-box">
                <h4>Step 3: Adding Step-by-Step</h4>
                <p>Start with <strong>2</strong> and count forward:</p>
                <p><strong>2 → 3 → 4 → 5</strong></p>
              </div>
            </div>

            <div id="subtraction" className="lesson-card">
              <h3>Learning Subtraction</h3>
              <div className="step-box">
                <h4>Step 1: Understanding Numbers</h4>
                <p>You start with <strong>7 chocolates</strong> 🍫🍫🍫🍫🍫🍫🍫.</p>
              </div>
              <div className="step-box">
                <h4>Step 2: Taking Away</h4>
                <p>You give <strong>3 chocolates</strong> to a friend.</p>
              </div>
              <div className="step-box">
                <h4>Step 3: Counting Leftover</h4>
                <p>After giving away 3 chocolates, you have <strong>4 left</strong> 🍫🍫🍫🍫.</p>
              </div>
            </div>

            <div id="multiplication" className="lesson-card">
              <h3>Learning Multiplication</h3>
              <div className="step-box">
                <h4>Step 1: Understanding Multiplication</h4>
                <p>If you have <strong>3 boxes</strong> 📦📦📦 and each box has <strong>2 balls</strong> 🎾🎾 inside.</p>
              </div>
              <div className="step-box">
                <h4>Step 2: Counting Groups</h4>
                <p>Each box has 2 balls, so we count:</p>
                <p><strong>2 + 2 + 2 = 6</strong> 🎾🎾🎾🎾🎾🎾</p>
              </div>
            </div>

            <div id="division" className="lesson-card">
              <h3>Learning Division</h3>
              <div className="step-box">
                <h4>Step 1: Understanding Sharing</h4>
                <p>You have <strong>6 candies</strong> 🍬🍬🍬🍬🍬🍬 and want to share equally with <strong>2 friends</strong>.</p>
              </div>
              <div className="step-box">
                <h4>Step 2: Splitting the Candies</h4>
                <p>Each friend gets <strong>3 candies</strong> 🍬🍬🍬.</p>
              </div>
            </div>

            <div id="square-root" className="lesson-card">
              <h3>Learning Square Roots</h3>
              <div className="step-box">
                <h4>Step 1: Understanding Squares</h4>
                <p>A square has 3 rows and 3 columns of dots:</p>
                <p>⚫⚫⚫<br />⚫⚫⚫<br />⚫⚫⚫</p>
              </div>
              <div className="step-box">
                <h4>Step 2: Finding the Square Root</h4>
                <p>Since 3 × 3 = 9, the square root of 9 is <strong>3</strong>.</p>
              </div>
            </div>

            {/* Practice More Section */}
            <section className="practice-section mt-4">
              <div className="card p-4 shadow-sm">
                <h2 className="text-center">Practice More</h2>
                <p className="text-center lead">{message}</p>
                <div className="d-flex justify-content-center mt-3">
                  <input
                    className="form-control text-center w-50"
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                  />
                </div>
                {errorMessage && <p className="text-danger text-center mt-2">{errorMessage}</p>}
                <div className="d-flex justify-content-center mt-3">
                  <button className="btn btn-success me-2" onClick={handleCheckAnswer}>
                    ✅ Submit Answer
                  </button>
                  <button className="btn btn-secondary" onClick={() => generateNewProblem(problem.operation)}>
                    🔄 New Problem
                  </button>
                </div>
                {isCorrect !== null && (
                  <p className={`text-center mt-3 fw-bold ${isCorrect ? "text-success" : "text-danger"}`}>
                    {message}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        <footer className="bg-dark text-white text-center py-4 mt-5">
        </footer>
      </div>
    </section>
  );
}
