"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdaptiveTeacherBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [typingText, setTypingText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // ✅ Fetch user info on load
  const fetchUser = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const userData = await fetchUser();
      setUser(userData);

      if (!userData) {
        pushMessage(
          "assistant",
          <div className="flex flex-col gap-2">
            <span>🔒 You must log in to unlock the Teacher.</span>
            <a
              href="/register"
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-center"
            >
              👉 Register / Login
            </a>
          </div>
        );
      } else {
        pushMessage(
          "assistant",
          `👋 Hi ${userData.username}! I'm your Maths Teacher. Let's improve together!`
        );

        // Suggest next problem dynamically
        const suggestion = dynamicSuggestion(userData);
        pushMessage("assistant", suggestion);
      }
    };
    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  useEffect(() => {
    const handleStorage = () => window.location.reload();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const pushMessage = (role, content) => {
    const msg = { id: `${role}-${Date.now()}`, role, content, ts: Date.now() };
    setMessages((m) => [...m, msg].slice(-100));
    return msg;
  };

  const simulateTyping = (text, callback) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
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

  const localReply = (text) => {
    const lower = text.toLowerCase();
    if (["hi", "hello", "hey"].some((g) => lower.includes(g))) {
      return `Hello ${user?.username || ""}! 👋 How are you today?`;
    }
    if (lower.includes("bye")) return "Goodbye 👋 Have a nice day!";
    return null;
  };

  // ✅ Generate dynamic suggestion based on scores
  const dynamicSuggestion = (userData) => {
    const avgScore =
      ((userData.scores?.easy || 0) +
        (userData.scores?.medium || 0) +
        (userData.scores?.hard || 0)) /
      3;

    if (avgScore < 40) return "🎯 Try a new easy addition problem!";
    if (avgScore < 70) return "💪 Let's tackle a medium subtraction challenge.";
    return "🚀 You’re doing great! How about a hard multiplication problem?";
  };

  const buildPayloadMessages = (extraUserPrompt) => {
    const avgScore =
      ((user?.scores?.easy || 0) +
        (user?.scores?.medium || 0) +
        (user?.scores?.hard || 0)) /
      3;

    const difficultyHint =
      avgScore < 50
        ? "Use very simple examples (apples, candies)."
        : avgScore < 80
        ? "Use medium-level examples."
        : "Use challenging examples, step by step.";

    const system = {
      role: "system",
      content: `You are a friendly maths teacher for a logged-in user.
- Personalize the chat using the username.
- Adjust examples based on their average score.
- Explain math step by step, max 5 lines, use bullets if needed.
- ${difficultyHint}`,
    };

    const recent = messages
      .filter((m) => m.role !== "system")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    if (extraUserPrompt) recent.push({ role: "user", content: extraUserPrompt });

    return [system, ...recent];
  };

  const askHF = async (extraUserPrompt) => {
    if (!HF_TOKEN) {
      pushMessage(
        "assistant",
        <div className="flex flex-col gap-2">
          <span>🔒 API not configured. Login to use Teacher chat.</span>
          <a
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-center"
          >
            👉 Register / Login
          </a>
        </div>
      );
      return;
    }

    setThinking(true);
    const placeholder = pushMessage("assistant", "");

    const payloadMessages = buildPayloadMessages(extraUserPrompt);
    const body = {
      model: "deepseek-ai/DeepSeek-V3.1",
      messages: payloadMessages,
      temperature: 0.4,
      max_tokens: 150,
    };

    let finalText = "🤔 Let me think...";

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
        finalText =
          data?.choices?.[0]?.message?.content ||
          "I'm not sure. Can you ask differently?";
      }
    } catch (err) {
      console.error("HF fetch error", err);
      finalText = "Oops! Something went wrong. Please try again.";
    }

    setThinking(false);

    simulateTyping(finalText, () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholder.id ? { ...m, content: finalText } : m
        )
      );
      setTypingText("");
    });
  };

  const sendChatMessage = async () => {
    const text = chatInput?.trim();
    if (!text) return;
    pushMessage("user", text);
    setChatInput("");

    if (!user) {
      pushMessage(
        "assistant",
        <div className="flex flex-col gap-2">
          <span>🔒 You must log in to unlock the Teacher.</span>
          <a
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-center"
          >
            👉 Register / Login
          </a>
        </div>
      );
      return;
    }

    const reply = localReply(text);
    if (reply) {
      simulateTyping(reply, () => {
        pushMessage("assistant", reply);
        setTypingText("");
      });
      return;
    }

    await askHF(text);

    // After HF reply, suggest next problem
    setTimeout(() => {
      const suggestion = dynamicSuggestion(user);
      pushMessage("assistant", suggestion);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="bg-pink-500 hover:bg-red-600 text-white px-4 py-3 rounded-full shadow-lg font-bold"
          whileHover={{ scale: 1.1 }}
        >
          Chat with Teacher
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="w-96 h-[500px] bg-gradient-to-b from-pink-50 to-purple-100 border-2 border-pink-300 rounded-3xl shadow-2xl flex flex-col"
          >
            <div className="p-3 bg-pink-500 text-white rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://www.citypng.com/public/uploads/preview/anime-manga-cartoon-girl-teacher-hd-png-7017516948698304run65aoc5.png"
                  alt="Teacher Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                />
                <span className="font-bold text-lg">Teacher</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-xl font-bold">
                ✖
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`px-3 py-2 rounded-2xl shadow-md max-w-[80%] whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-yellow-200 text-gray-900 ml-auto"
                      : "bg-pink-200 text-gray-800 mr-auto"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {typingText && (
                <div className="bg-pink-200 text-gray-800 mr-auto px-3 py-2 rounded-2xl shadow-md max-w-[80%] whitespace-pre-line">
                  {typingText}
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="p-3 border-t border-pink-200 flex gap-2 bg-pink-50 rounded-b-3xl">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder={user ? "Type here..." : "Login to unlock Teacher..."}
                className={`flex-1 border border-pink-300 px-3 py-2 rounded-xl bg-white focus:outline-none ${
                  !user ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!user}
              />
              <button
                onClick={sendChatMessage}
                disabled={!user}
                className={`bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl shadow-md ${
                  !user ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
