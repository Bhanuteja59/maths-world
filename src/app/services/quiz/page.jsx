"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";

// ============================
// Advanced Real-World Quiz Page
// Features added in this version:
// - Difficulty selection (Easy / Intermediate / Hard)
// - Input answer "Enter" key submits
// - If input is empty when submitting: show prompt, decrement a star (if available), do NOT advance
// - Difficulty-aware question & answer generation (simple AI heuristics)
// - Smoother UI, accessible buttons, keyboard-first UX
// - Better distractor generation for MCQ using heuristics
// - Full scoreboard, history, and end-screen
// - Defensive checks to avoid layout-breaking modals
// - Plenty of inline comments and structure for maintainability
// ============================

// --- Utilities & config --------------------------------------------------
const OPS = ["+", "-", "×", "÷"];

// Difficulty config
const DIFFICULTY = {
  EASY: {
    name: "Easy",
    maxOperand: 10,
    allowDecimal: false,
    modifier: 1,
    color: "#28a745"
  },
  INTERMEDIATE: {
    name: "Intermediate",
    maxOperand: 25,
    allowDecimal: true,
    modifier: 1.5,
    color: "#ffc107"
  },
  HARD: {
    name: "Hard",
    maxOperand: 100,
    allowDecimal: true,
    modifier: 2,
    color: "#dc3545"
  },
};

// Small RNG helper
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Format answer to string consistently (avoid floating noise)
const fmt = (n, allowDecimal) => {
  if (!Number.isFinite(n)) return "0";
  if (allowDecimal) return Number(n.toFixed(1)).toString();
  return Math.round(n).toString();
};

// --- Question generators (AI heuristics) ---------------------------------

// Generate arithmetic problem influenced by difficulty
function makeArithmetic(difficultyKey = "EASY") {
  const cfg = DIFFICULTY[difficultyKey] || DIFFICULTY.EASY;
  const max = Math.max(4, cfg.maxOperand);
  const allowDecimal = !!cfg.allowDecimal;

  // Choose operation with weights that make sense by difficulty
  let ops = [...OPS];
  if (difficultyKey === "EASY") ops = ["+", "-", "×"];
  else if (difficultyKey === "INTERMEDIATE") ops = ["+", "-", "×", "÷"];
  else ops = [...OPS];

  const op = ops[randInt(0, ops.length - 1)];

  // Pick operands depending on op
  let a, b;
  if (op === "÷") {
    // For division prefer results with one decimal at most
    b = randInt(1, Math.max(2, Math.floor(max / 4)));
    const res = (Math.random() < 0.6 ? randInt(1, Math.floor(max / 3)) : randInt(1, max));
    a = Math.round(res * b);
  } else {
    a = randInt(1, max);
    b = randInt(1, Math.max(2, Math.floor(max / (difficultyKey === "HARD" ? 1 : 2))));
  }

  if (allowDecimal && Math.random() < 0.25) {
    // randomly turn one operand into one-decimal operand for realism
    a = Number((a + Math.random()).toFixed(1));
  }

  let value;
  switch (op) {
    case "+": value = a + b; break;
    case "-": value = a - b; break;
    case "×": value = a * b; break;
    case "÷": value = Number((a / b).toFixed(1)); break;
    default: value = 0;
  }

  return { text: `${a} ${op} ${b} = ?`, value, allowDecimal };
}

// MCQ generation with distractors that are more plausible.
function generateMcqForDifficulty(difficultyKey) {
  const q = makeArithmetic(difficultyKey);
  const correct = q.value;
  const distractors = new Set();

  // Generate distractors by adding/subtracting small deltas and swapping digits
  while (distractors.size < 3) {
    let candidate;

    // Strategy mix
    const strat = Math.random();
    if (strat < 0.35) {
      // small drift
      const drift = Math.max(1, Math.round(Math.abs(correct) * (0.05 + Math.random() * 0.3)));
      candidate = Number((correct + (Math.random() < 0.5 ? -drift : drift)).toFixed(q.allowDecimal ? 1 : 0));
    } else if (strat < 0.6) {
      // swap digits (e.g. 12 -> 21)
      const s = String(Math.abs(Math.round(Number(correct))));
      const swapped = s.split("").reverse().join("");
      candidate = Number((Number(swapped) * (Math.sign(correct) || 1)).toFixed(q.allowDecimal ? 1 : 0));
    } else {
      // random plausible number near the operands
      candidate = Math.round((correct + randInt(-5, 5)) * (q.allowDecimal ? 1 : 1));
    }

    if (!Number.isFinite(candidate)) candidate = 0;
    if (candidate !== correct) distractors.add(fmt(candidate, q.allowDecimal));
  }

  const options = [...distractors, fmt(correct, q.allowDecimal)].sort(() => Math.random() - 0.5);
  return { question: q.text, answer: fmt(correct, q.allowDecimal), options, allowDecimal: q.allowDecimal };
}

// Input question
function generateInputForDifficulty(difficultyKey) {
  const q = makeArithmetic(difficultyKey);
  return { question: q.text, answer: fmt(q.value, q.allowDecimal), allowDecimal: q.allowDecimal };
}

// --- Main Component ------------------------------------------------------
export default function QuizPageAdvanced() {
  // Setup state
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizOver, setQuizOver] = useState(false);

  // Game settings
  const [mode, setMode] = useState("INPUT"); // INPUT | MCQ
  const [difficulty, setDifficulty] = useState("EASY");
  const [questionLimit, setQuestionLimit] = useState(10);
  const [totalTime, setTotalTime] = useState(90);

  // Game runtime
  const [timeLeft, setTimeLeft] = useState(90);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Player state
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [confettiOn, setConfettiOn] = useState(false);

  // Input state
  const [userAnswer, setUserAnswer] = useState("");

  // Refs
  const inputRef = useRef(null);

  const timePct = useMemo(() => (totalTime > 0 ? clamp(Math.round((timeLeft / totalTime) * 100), 0, 100) : 0), [timeLeft, totalTime]);

  // Loading splash
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // Timer
  useEffect(() => {
    if (!quizStarted || quizOver) return;
    if (timeLeft <= 0) {
      setQuizOver(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [quizStarted, quizOver, timeLeft]);

  // Start quiz
  function startQuiz() {
    setScore(0);
    setStars(0);
    setCorrectCount(0);
    setQuestionsAsked(0);
    setSessionHistory([]);
    setQuizOver(false);
    setQuizStarted(true);
    setTimeLeft(totalTime);

    // first question
    const first = mode === "MCQ" ? generateMcqForDifficulty(difficulty) : generateInputForDifficulty(difficulty);
    setCurrentQuestion(first);

    // focus input for quick typing
    setTimeout(() => inputRef.current?.focus?.(), 250);
  }

  // Advance question (internal)
  function advanceQuestion() {
    setQuestionsAsked((q) => q + 1);
    const next = mode === "MCQ" ? generateMcqForDifficulty(difficulty) : generateInputForDifficulty(difficulty);
    setCurrentQuestion(next);
    setUserAnswer("");
    setFeedback("");
    // focus input again for typing mode
    setTimeout(() => inputRef.current?.focus?.(), 120);
  }

  // Celebrate
  function celebrate() {
    toast.success("Nice! Correct answer ✨", { autoClose: 900, position: "top-center" });
    setConfettiOn(true);
    setTimeout(() => setConfettiOn(false), 3000);
  }

  // Process answer: common path for both modes
  function processAnswerInternal(isCorrect, chosen = "") {
    // Bookkeeping
    if (isCorrect) {
      setFeedback("✅ Correct!");
      setScore((s) => s + 10);
      celebrate();
      setCorrectCount((c) => c + 1);
      // award star every 15 correct answers
      setStars((st) => {
        const next = st;
        if ((correctCount + 1) > 0 && (correctCount + 1) % 15 === 0) return next + 1;
        return next;
      });
    } else {
      setFeedback(`❌ Wrong — correct: ${currentQuestion.answer}`);
      setScore((s) => Math.max(0, s - 5));
      toast.error("Incorrect — try the next one", { autoClose: 900, position: "top-center" });
    }

    setSessionHistory((hist) => [
      ...hist,
      { question: currentQuestion.question, userAnswer: chosen?.toString?.() ?? "", correctAnswer: currentQuestion.answer, isCorrect },
    ]);

    // short delay then advance or end
    setTimeout(() => {
      const nextCount = questionsAsked + 1;
      if (nextCount >= questionLimit) {
        setQuizOver(true);
      } else {
        advanceQuestion();
      }
    }, 650);
  }

  // Handler for MCQ click
  function handleOptionClick(opt) {
    if (!currentQuestion) return;
    const isCorrect = String(opt).trim() === String(currentQuestion.answer).trim();
    processAnswerInternal(isCorrect, opt);
  }

  // Handler for input submit (button or Enter key)
  function handleSubmitInput({ fromKeyboard = false } = {}) {
    if (!currentQuestion) return;

    // If input blank, prompt user and remove a star
    if (!userAnswer.trim()) {
      toast.info("Please type an answer before submitting.", { autoClose: 1300, position: "top-center" });
      // remove a star penalty if player has one
      setStars((st) => Math.max(0, st - 1));
      // keep feedback visible but don't advance
      setFeedback("⚠️ No answer entered — -1 ⭐ penalty (if any)");
      return;
    }

    const isCorrect = userAnswer.trim().toLowerCase() === String(currentQuestion.answer).toLowerCase();
    processAnswerInternal(isCorrect, userAnswer.trim());
  }

  // Key handler to allow Enter to submit
  function handleInputKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitInput({ fromKeyboard: true });
    }
  }

  // If the user changes difficulty after selecting it, we keep it but update example
  useEffect(() => {
    // Regenerate preview question if not started
    if (!quizStarted) {
      const preview = mode === "MCQ" ? generateMcqForDifficulty(difficulty) : generateInputForDifficulty(difficulty);
      setCurrentQuestion(preview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, mode]);

  // If quiz ends show toast summary
  useEffect(() => {
    if (!quizOver) return;
    toast.info(`Quiz finished — Score ${score}`, { autoClose: 2000 });
  }, [quizOver]);

  // --- Render -------------------------------------------------------------
  if (loading) return <Loading />;

  return (
    <div className="quiz-app fluid-container" style={{ background: "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)  " }}>
      <AnimatePresence>{confettiOn && <Confetti numberOfPieces={220} recycle={false} />}</AnimatePresence>
      <br />
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(10px)" }}>
        <div className="container">
          <a className="navbar-brand text-white fw-bold d-flex align-items-center" href="#">
            <div className="bg-white rounded-circle p-2 me-2" style={{ width: "40px", height: "40px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            Quiz Mastery 
          </a>
          <div className="d-flex gap-2">
            <span className="badge bg-light text-dark" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>Difficulty: {DIFFICULTY[difficulty].name}</span>
            <span className="badge bg-light text-dark" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>Mode: {mode}</span>
          </div>
        </div>
      </nav>

      {/* START SCREEN */}
      {!quizStarted && !quizOver && (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-4 rounded-4 shadow-lg"
                style={{ 
                  background: "rgba(255, 255, 255, 0.95)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h2 className="fw-bold mb-3" style={{ color: "#333" }}>Ready to train your brain?</h2>
                    <p className="text-muted mb-4">Choose difficulty & mode, set quiz length and time. Press Start when ready.</p>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Mode</label>
                      <div className="d-flex gap-2 flex-wrap ">
                        <button 
                          className={`btn ${mode === "INPUT" ? "btn-success" : "btn-outline-success"} rounded-pill`} 
                          onClick={() => setMode("INPUT")}
                          style={{ 
                            padding: "0.5rem 1.2rem",
                            transition: "all 0.3s ease",
                            boxShadow: mode === "INPUT" ? "0 4px 8px rgba(0,0,0,0.1)" : "none"
                          }}
                        >
                          ✍️ Type Answer
                        </button>
                        <button 
                          className={`btn ${mode === "MCQ" ? "btn-warning" : "btn-outline-warning"} rounded-pill`} 
                          onClick={() => setMode("MCQ")}
                          style={{ 
                            padding: "0.5rem 1.2rem",
                            transition: "all 0.3s ease",
                            boxShadow: mode === "MCQ" ? "0 4px 8px rgba(0,0,0,0.1)" : "none"
                          }}
                        >
                          🧠 Multiple Choice
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Difficulty</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {Object.keys(DIFFICULTY).map((k) => (
                          <button 
                            key={k} 
                            className={`btn ${difficulty === k ? "" : "btn-outline-"} rounded-pill`}
                            onClick={() => setDifficulty(k)}
                            style={{ 
                              backgroundColor: difficulty === k ? DIFFICULTY[k].color : "transparent",
                              color: difficulty === k ? "white" : DIFFICULTY[k].color,
                              borderColor: DIFFICULTY[k].color,
                              padding: "0.5rem 1.2rem",
                              transition: "all 0.3s ease",
                              boxShadow: difficulty === k ? "0 4px 8px rgba(0,0,0,0.1)" : "none"
                            }}
                          >
                            {DIFFICULTY[k].name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Questions</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent">📝</span>
                          <input 
                            type="number" 
                            min={5} 
                            max={50} 
                            value={questionLimit} 
                            className="form-control rounded-end" 
                            onChange={(e) => setQuestionLimit(clamp(Number(e.target.value || 0), 5, 50))} 
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Time Limit (seconds)</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent">⏱️</span>
                          <input 
                            type="number" 
                            min={1} 
                            value={totalTime} 
                            className="form-control rounded-end" 
                            onChange={(e) => { const v = clamp(Number(e.target.value || 0), 0, 1800); setTotalTime(v); setTimeLeft(v); }} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 d-flex gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary btn-lg rounded-pill px-4 d-flex align-items-center"
                        onClick={startQuiz}
                        style={{ 
                          background: "linear-gradient(90deg, #667eea, #764ba2)",
                          border: "none",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
                        }}
                      >
                        <span className="me-2">🚀</span> Start Quiz
                      </motion.button>
                    </div>
                  </div>

                  <div className="col-md-6 d-flex justify-content-center">
                    <div className="" style={{ background: "rgba(0,0,0,0.05)" }}>
                      <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExejIyaDhlMWsxeHM5OGRyZGMwbTBhZ2JsazI0Z3l5NzUyMTQxbGhlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8zjxfpuutpJFRnlM2h/giphy.gif" alt="Quiz Illustration" className="img-fluid mb-3" style={{ maxHeight: "180px" }} />
                      </div>
                  </div>


                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ SCREEN */}
      {quizStarted && !quizOver && (
        <div className="container mt-4">
          <div className="row g-4">
            <div className="col-lg-8">
              <motion.div 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-4 rounded-4 shadow-lg"
                style={{ 
                  background: "rgba(255, 255, 255, 0.95)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex gap-2">
                    <span className="badge rounded-pill bg-primary px-3 py-2">Q {questionsAsked + 1} / {questionLimit}</span>
                    <span 
                      className="badge rounded-pill px-3 py-2 text-white" 
                      style={{ backgroundColor: DIFFICULTY[difficulty].color }}
                    >
                      {DIFFICULTY[difficulty].name}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge rounded-pill bg-success px-3 py-2">Score: {score}</span>
                  </div>
                </div>

                <h3 className="mb-4 fw-bold text-center" style={{ color: "#333", minHeight: "4rem" }}>
                  {currentQuestion?.question}
                </h3>

                {mode === "INPUT" ? (
                  <div>
                    <input 
                      ref={inputRef} 
                      type="number" 
                      className="form-control form-control-lg text-center rounded-pill shadow-sm" 
                      placeholder="Type your answer and press Enter or Submit" 
                      value={userAnswer} 
                      onChange={(e) => setUserAnswer(e.target.value)} 
                      onKeyDown={handleInputKeyDown} 
                      aria-label="Answer input"
                      style={{ padding: "1rem 1.5rem", fontSize: "1.25rem" }}
                    />
                    <div className="d-flex gap-2 mt-3">
                      <motion.button 
                        whileHover={{ scale: 1.03 }} 
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-success flex-grow-1 rounded-pill py-2"
                        onClick={() => handleSubmitInput()}
                        style={{ fontSize: "1.1rem", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                      >
                        Submit Answer
                      </motion.button>
                      <button 
                        className="btn btn-outline-secondary rounded-pill py-2"
                        onClick={() => { setUserAnswer(""); inputRef.current?.focus?.(); }}
                        style={{ width: "120px" }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row row-cols-2 row-cols-md-2 g-3 ">
                    {currentQuestion?.options?.map((opt, i) => (
                      <div className="col hover:bg-secondary rounded-4" key={i}>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 1 }}
                          className="btn w-100  text-start rounded-4 shadow-sm "
                          onClick={() => handleOptionClick(opt)}
                          style={{ 
                            background: "rgba(255, 239, 174, 0.8)", 
                            border: "1px solid rgba(0,0,0,0.1)",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between ">
                            <div className="d-flex align-items-center gap-3 fw-semibold justify-content-start">
                              <span className="badge bg-primary me-2">{String.fromCharCode(65 + i)}</span>
                              <span className="fw-medium fs-5">{opt}</span>
                            </div>
                            <div className="small text-muted d-none d-md-block">Tap to answer</div>
                          </div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {feedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }} 
                      className="mt-3 p-3 rounded-3 text-center"
                      style={{ 
                        background: feedback.startsWith('✅') ? 'rgba(40, 167, 69, 0.15)' : 'rgba(220, 53, 69, 0.15)',
                        border: feedback.startsWith('✅') ? '1px solid rgba(40, 167, 69, 0.3)' : '1px solid rgba(220, 53, 69, 0.3)'
                      }}
                    >
                      <strong className={feedback.startsWith('✅') ? 'text-success' : 'text-danger'}>{feedback}</strong>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="progress mt-4 rounded-pill" style={{ height: "10px" }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${Math.round((questionsAsked / questionLimit) * 100)}%`,
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                      transition: "width 0.5s ease"
                    }}
                  ></div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-lg-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-4 shadow-lg text-white mb-4"
                style={{ 
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))",
                  backdropFilter: "blur(10px)"
                }}
              >
                <h6 className="m-0 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clock me-2" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                  </svg>
                  Time Left
                </h6>
                <div className="progress my-2 rounded-pill" style={{ height: "12px", backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <div 
                    className={`progress-bar ${timePct < 25 ? 'bg-danger' : timePct < 50 ? 'bg-warning' : 'bg-success'} rounded-pill`} 
                    role="progressbar" 
                    style={{ width: `${timePct}%`, transition: "width 1s linear" }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between">
                  <div><strong>{timeLeft}s</strong></div>
                  <div><small>Total {totalTime}s</small></div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-4 shadow-lg mb-4"
                style={{ 
                  background: "rgba(255, 255, 255, 0.95)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <h6 className="mb-3 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trophy me-2" viewBox="0 0 16 16">
                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.38.093.558.135l1.442.36C12.715 14.09 13.5 14.5 14 14.5h.5a.5.5 0 0 1 0 1h-15a.5.5 0 1 1 0-1h.5c0 0 .285-.41.816-.857l1.443-.36a5.9 5.9 0 0 0 .558-.135L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.1 33.1 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935zM3.5 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  </svg>
                  Scoreboard
                </h6>
                <div className="d-flex gap-2 mb-3">
                  <span className="badge bg-success py-2">{score} pts</span>
                  <span className="badge bg-dark py-2">Correct: {correctCount}</span>
                </div>

                <hr />
                <h6 className="mb-2 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-history me-2" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                  Recent
                </h6>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {sessionHistory.slice(-5).reverse().map((h, i) => (
                    <div 
                      key={i} 
                      className={`p-2 mb-2 rounded-3 ${h.isCorrect ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}
                    >
                      <div className="small fw-bold">{h.question}</div>
                      <div className="small text-muted">You: {h.userAnswer} • Ans: {h.correctAnswer}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-4 shadow-sm text-center"
                style={{ 
                  background: "rgba(255, 255, 255, 0.8)", 
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)"
                }}
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline-primary w-100 rounded-pill"
                  onClick={() => { setQuizStarted(false); setQuizOver(false); setUserAnswer(""); setQuestionsAsked(0); }}
                >
                  Back to Main Page 
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ OVER */}
      {quizOver && (
        <div className="container text-center mt-5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-4 shadow-lg"
            style={{ 
              background: "rgba(255, 255, 255, 0.95)", 
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              maxWidth: "800px",
              margin: "0 auto"
            }}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-trophy-fill text-warning" viewBox="0 0 16 16">
                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.38.093.558.135l1.442.36C12.715 14.09 13.5 14.5 14 14.5h.5a.5.5 0 0 1 0 1h-15a.5.5 0 1 1 0-1h.5c0 0 .285-.41.816-.857l1.443-.36a5.9 5.9 0 0 0 .558-.135L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.1 33.1 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935zM3.5 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
            </motion.div>
            <h2 className="fw-bold mb-3">🏁 Quiz Finished</h2>
            <p className="lead">Score: <strong className="text-primary">{score}</strong> • Stars: <strong className="text-warning">{stars}</strong></p>
            <p>You attempted <strong>{questionsAsked}</strong> questions out of <strong>{questionLimit}</strong>.</p>

            <div className="table-responsive mt-4 mb-4 rounded-3 shadow-sm" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Your Answer</th>
                    <th>Correct</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionHistory.map((h, idx) => (
                    <tr key={idx} className={h.isCorrect ? 'table-success' : 'table-danger'}>
                      <td>{idx+1}</td>
                      <td className="text-start">{h.question}</td>
                      <td>{h.userAnswer}</td>
                      <td>{h.correctAnswer}</td>
                      <td>
                        {h.isCorrect ? (
                          <span className="badge bg-success">Correct</span>
                        ) : (
                          <span className="badge bg-danger">Wrong</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex gap-2 justify-content-center mt-4">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-lg rounded-pill px-4"
                onClick={() => window.location.reload()}
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <style jsx>{`
        .quiz-app {
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          min-height: 100vh;
          padding-bottom: 2rem;
        }
        .btn {
          transition: all 0.3s ease;
        }
        .bg-gradient {
          background: linear-gradient(90deg,#4b6cb7,#182848);
        }
        .table th {
          border-top: none;
          font-weight: 600;
        }
        .table td {
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}
