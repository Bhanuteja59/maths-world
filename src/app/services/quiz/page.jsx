"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./loading";

const generateQuestion = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ["+", "-", "×", "÷"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let answer;

  switch (operation) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "×":
      answer = num1 * num2;
      break;
    case "÷":
      answer = (num1 / num2).toFixed(1);
      break;
    default:
      break;
  }

  return { question: `${num1} ${operation} ${num2} = ?`, answer: answer.toString() };
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

  // ⭐ new states for stars + correct counter
  const [correctCount, setCorrectCount] = useState(0);
  const [stars, setStars] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    let timer;
    if (feedback && feedback !== "⚠️ Enter a number!") {
      setShowProgressBar(true);
      setProgress(0);
      setIsButtonDisabled(true);

      let interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 2.5 : 100));
      }, 100);

      timer = setTimeout(() => {
        setCurrentQuestion(generateQuestion());
        setUserAnswer("");
        setFeedback("");
        setProgress(0);
        setIsButtonDisabled(false);
        setShowProgressBar(false);
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [feedback]);

  const handleSubmit = () => {
    if (userAnswer.trim() === "") {
      setFeedback("⚠️ Enter a number!");
      return;
    }

    const isCorrect = userAnswer.trim() === currentQuestion.answer;
    if (isCorrect) {
      setFeedback("🎉 Correct!");
      setScore((prev) => prev + 10);

      setCorrectCount((prev) => {
        const newCount = prev + 1;
        if (newCount % 15 === 0) {
          setStars((s) => s + 1);
          setShowCongrats(true); // 🎉 show popup
        }
        return newCount;
      });
    } else {
      setFeedback(`❌ Wrong! Correct Answer: ${currentQuestion.answer}`);
      setScore((prev) => prev - 5);
    }

    setSessionHistory([
      ...sessionHistory,
      { question: currentQuestion.question, userAnswer, correctAnswer: currentQuestion.answer, isCorrect },
    ]);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container flex justify-center items-center my-2">
          <h3 className="font-bold text-white mt-2">Fun Math Quiz</h3>
        </div>
      </nav>

      {/* Main Quiz Section */}
      <div className="container mt-5">
        <div className="row">
          {/* Quiz Box */}
          <div className="col-md-8 mx-auto text-center p-4 bg-white shadow rounded">
            <h2 className="mb-3">Solve the Question! 🧮</h2>
            <h3 className="fw-bold text-primary">{currentQuestion.question}</h3>

            <input
              type="text"
              className={`form-control mt-3 text-center ${feedback.includes("🎉") ? "border-success" : feedback.includes("❌") ? "border-danger" : ""}`}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer..."
            />

            <button className="btn btn-primary mt-3 w-100" onClick={handleSubmit} disabled={isButtonDisabled}>
              ✅ Submit
            </button>

            <p className="mt-3 fw-bold">{feedback}</p>

            {/* Progress Bar */}
            {showProgressBar && (
              <div className="progress mt-3">
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style={{ width: `${progress}%` }}></div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-md-4 mt-4">
            {/* Score Section */}
            <div className="p-3 mt-3 bg-info text-white rounded shadow-sm">
              <h4>🏆 Score: {score}</h4>
              <h5>⭐ Stars: {stars}</h5>
              <small className="d-block">Every 15 correct answers = 1 star</small>
            </div>
            <br />

            {/* Instructions */}
            <div className="p-3 bg-warning rounded shadow-sm">
              <h4>📜 Instructions</h4>
              <ul className="list-unstyled">
                <li>🧮 Solve the given math problem.</li>
                <li>✅ Correct = <b>+10</b> points.</li>
                <li>❌ Wrong = <b>-5</b> points.</li>
                <li>⭐ Every 15 correct answers earns you 1 star!</li>
                <li>⏳ New question in <b>4s</b> automatically.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center p-4">
              <h2 className="text-success">🎉 Congratulations! 🎉</h2>
              <p className="mt-3">You earned a ⭐ for 15 correct answers!</p>
              <button className="btn btn-success mt-3" onClick={() => setShowCongrats(false)}>
                Continue Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        body {
          font-family: "Poppins", sans-serif;
          background: linear-gradient(135deg, #ff9a9e, #fad0c4);
        }
        input::placeholder {
          font-size: 18px;
          color: #888;
          font-style: italic;
          opacity: 0.8;
        }
        .border-success {
          border: 2px solid green !important;
        }
        .border-danger {
          border: 2px solid red !important;
        }
      `}</style>
    </div>
  );
}
