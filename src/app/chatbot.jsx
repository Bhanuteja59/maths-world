"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;

export default function ChatBot({ initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [messages, setMessages] = useState(() => [
    {
      id: `sys-1`,
      role: "assistant",
      content: "👋 Hi! I'm Mr. Math — your fun math teacher! I explain math in simple steps. Try a problem or ask me anything!",
      ts: Date.now(),
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const [typingText, setTypingText] = useState("");
  const abortRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking, typingText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Helper: append message locally
  const pushMessage = (role, content) => {
    const msg = { id: `${role}-${Date.now()}`, role, content, ts: Date.now() };
    setMessages((m) => [...m, msg].slice(-100));
    return msg;
  };

  // Simulate typing effect
  const simulateTyping = (text, callback) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    let index = 0;
    setTypingText("");
    
    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setTypingText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingIntervalRef.current);
        if (callback) callback();
      }
    }, 20);
  };

  // Build messages for HF request
  const buildPayloadMessages = (extraUserPrompt) => {
    const system = {
      role: "system",
      content: "You are a fun math teacher for 5th grade students. Use very simple words and short sentences. Explain concepts step by step. Always be positive and encouraging. If the student is wrong, gently show where they went wrong. Use examples with apples, candies, or toys. Keep explanations under 4 sentences.",
    };

    const recent = messages
      .filter((m) => m.role !== "system")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    if (extraUserPrompt) recent.push({ role: "user", content: extraUserPrompt });

    return [system, ...recent];
  };

  // Core: send ask to Hugging Face router
  async function askHF(extraUserPrompt) {
    setThinking(true);

    const placeholder = pushMessage("assistant", "");

    const payloadMessages = buildPayloadMessages(extraUserPrompt);

    const body = {
      model: "deepseek-ai/DeepSeek-V3.1",
      messages: payloadMessages,
      temperature: 0.3,
      max_tokens: 150, // Keep responses short
    };

    let finalText = "🤔 Hmm, let me think about that...";

    try {
      const res = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HF_TOKEN}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        finalText = data?.choices?.[0]?.message?.content || "I'm not sure about that. Can you ask in a different way?";
      }
    } catch (err) {
      console.error("HF fetch error", err);
      finalText = "Oops! My brain is taking a quick nap. Try again in a moment!";
    }

    setThinking(false);
    
    // Simulate typing for the response
    simulateTyping(finalText, () => {
      setMessages((prev) =>
        prev
          .map((m) => (m.id === placeholder.id ? { ...m, content: finalText } : m))
          .slice(-100)
      );
      setTypingText("");
    });
  }

  // Listen for global math answer events
  useEffect(() => {
    function onMathAnswer(e) {
      try {
        const detail = e.detail || {};
        const problem = detail.problem || null;
        const userAnswer = "userAnswer" in detail ? detail.userAnswer : detail.answer ?? null;

        if (!problem || userAnswer === null || userAnswer === undefined) return;

        pushMessage("user", `I answered: ${userAnswer} for: ${problem.question}`);

        const prompt = [
          `Problem: ${problem.question}`,
          `Correct answer: ${problem.answer}`,
          `Student's answer: ${userAnswer}`,
          `Is it correct? ${parseInt(userAnswer, 10) === Number(problem.answer) ? "Yes" : "No"}`,
          `Explain in simple steps for a 5th grader. Use an example with candies or toys.`,
        ].join("\n");

        askHF(prompt);
      } catch (err) {
        console.error("mathAnswerSubmitted handler error", err);
      }
    }

    window.addEventListener("mathAnswerSubmitted", onMathAnswer);
    return () => window.removeEventListener("mathAnswerSubmitted", onMathAnswer);
  }, [messages]);

  // Free-form chat from the widget input
  const inputRef = useRef(null);
  const [chatInput, setChatInput] = useState("");

  const sendChatMessage = async () => {
    const text = chatInput?.trim();
    if (!text) return;
    pushMessage("user", text);
    setChatInput("");
    await askHF(text);
  };

  const resetChat = () => {
    setMessages([
      {
        id: `sys-1`,
        role: "assistant",
        content: "👋 Hi! I'm Mr. Math — your fun math teacher! I explain math in simple steps. Try a problem or ask me anything!",
        ts: Date.now(),
      },
    ]);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    setTypingText("");
  };

  // Teacher character component
  const TeacherCharacter = ({ isThinking }) => (
    <div className="relative">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="flex flex-col items-center"
      >
        {/* Head */}
        <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center relative">
          {/* Eyes */}
          <div className="flex space-x-4">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
          {/* Smile */}
          <div className="w-6 h-2 bg-black rounded-b-full absolute bottom-2"></div>
          
          {/* Glasses */}
          <div className="absolute top-3 w-14 h-6 border-2 border-brown-800 rounded-full"></div>
        </div>
        
        {/* Hat */}
        <motion.div
          animate={{ rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-16 h-6 bg-blue-500 rounded-t-lg absolute -top-4 z-10"
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full absolute -bottom-2 left-6"></div>
        </motion.div>
        
        {/* Body */}
        <div className="w-14 h-10 bg-green-500 rounded-lg mt-2"></div>
        
        {/* Arms */}
        {isThinking ? (
          <motion.div
            animate={{ rotate: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-2 bg-green-500 rounded-full absolute top-8 -left-2 rotate-45"
          ></motion.div>
        ) : (
          <div className="w-6 h-2 bg-green-500 rounded-full absolute top-8 -left-2 rotate-45"></div>
        )}
        <div className="w-6 h-2 bg-green-500 rounded-full absolute top-8 -right-2 -rotate-45"></div>
      </motion.div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button when closed */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          aria-label="Open Math Teacher"
          className="relative bg-gradient-to-r from-blue-400 to-green-400 text-white p-4 rounded-full shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 6 }}
        >
          <div className="flex flex-col items-center">
            <TeacherCharacter />
            <span className="text-xs font-bold mt-1">Math Help</span>
          </div>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-80 h-[500px] bg-white border-4 border-yellow-300 rounded-3xl shadow-lg flex flex-col overflow-hidden"
          >
            {/* Header with teacher character */}
            <motion.div 
              className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-400 to-green-400 text-white"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="bg-white p-1 rounded-full"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <TeacherCharacter isThinking={thinking} />
                </motion.div>
                <div>
                  <div className="font-bold text-lg">Mr. Math</div>
                  <div className="text-xs opacity-80">Your math teacher!</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={resetChat}
                  title="Start new conversation"
                  className="text-sm px-2 py-1 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition text-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                    🔄 New
                </motion.button>
                <motion.button
                  onClick={() => setOpen(false)}
                  title="Close"
                  className="text-white hover:text-yellow-200 p-1 rounded-full transition"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>

            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-blue-50 to-green-50">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[90%] px-4 py-3 rounded-2xl whitespace-pre-wrap shadow-sm ${
                      m.role === "user" 
                        ? "ml-auto bg-yellow-100 border border-yellow-200 text-yellow-900" 
                        : "mr-auto bg-white border border-blue-200 text-blue-900"
                    }`}
                  >
                    {m.content}
                  </motion.div>
                ))}
              </AnimatePresence>

              {thinking && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-blue-600 bg-blue-100 px-4 py-3 rounded-2xl max-w-[90%] mr-auto"
                >
                  <motion.div
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-xl"
                  >
                    🤔
                  </motion.div>
                  <div>Thinking...</div>
                </motion.div>
              )}
              
              {typingText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[90%] mr-auto bg-white border border-blue-200 text-blue-900 px-4 py-3 rounded-2xl shadow-sm"
                >
                  {typingText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="ml-1"
                  >
                    ▊
                  </motion.span>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <motion.div 
              className="px-4 py-3 bg-white border-t border-gray-200"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="flex gap-2">
                <motion.input
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendChatMessage();
                  }}
                  placeholder="Ask a math question..."
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  onClick={sendChatMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!chatInput.trim()}
                  className="bg-gradient-to-r from-blue-400 to-green-400 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                >
                  ➤
                </motion.button>
              </div>
              
              {/* Quick action buttons */}
              <motion.div 
                className="flex justify-center gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setChatInput("How to add numbers?");
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-200 transition"
                >
                  ➕ Add
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setChatInput("How to multiply?");
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-lg hover:bg-green-200 transition"
                >
                  ✖ Multiply
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}