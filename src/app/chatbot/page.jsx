"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, User } from "lucide-react";

export default function ChatbotWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return null;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user;
      } catch {
        return null;
      }
    };

    const init = async () => {
      const userData = await fetchUser();
      setUser(userData);
      if (userData) {
        pushMessage("assistant", `👋 Hi ${userData.username}! Welcome to your Maths Tutor.`);
        pushMessage("assistant", dynamicSuggestion(userData));
      } else {
        pushMessage("assistant", `👋 Hi there! Let's solve some fun math problems together!`);
      }
    };
    init();
  }, []);

  const pushMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const dynamicSuggestion = (userData) => {
    const problems = [
      "What's on your mind 🤔",
      "Need help with fractions? ➗",
      "Want a quick algebra tip? ✖️",
      "How about a geometry question? 📐"
    ];
    const randomIndex = Math.floor(Math.random() * problems.length);
    return `Hey ${userData?.username || "friend"}, let's start with: ${problems[randomIndex]}`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = input;
    pushMessage("user", msg);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setTyping(false);
      pushMessage("assistant", data.response);
    } catch {
      setTyping(false);
      pushMessage("assistant", "❌ Failed to get a response. Try again.");
    }
  };

  const ChatBubble = ({ role, content }) => {
    const isUser = role === "user";
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
        <div className={`flex items-end gap-2 max-w-[80%]`}>
          {!isUser && <Bot className="w-6 h-6 text-purple-500" />}
          <div
            className={`p-3 rounded-2xl shadow-md ${isUser
              ? "bg-purple-600 text-white rounded-br-sm"
              : "bg-white text-gray-800 rounded-bl-sm"}`}
          >
            {content}
          </div>
          {isUser && <User className="w-6 h-6 text-gray-500" />}
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex items-center gap-2 text-gray-500">
      <Bot className="w-5 h-5 text-purple-500" />
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.2s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.4s]"></span>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating chat button */}
      <div className="fixed bottom-5 right-5 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-purple-600 text-white shadow-xl flex items-center justify-center hover:bg-purple-700 transition text-2xl"
        >
          💬
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-5 w-80 md:w-96 h-[500px] md:h-[600px] bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 font-semibold flex justify-between items-center shadow-md">
              <span>📚 Maths Tutor</span>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50">
                {["Fractions", "Algebra", "Geometry", "Word Problem"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} role={msg.role} content={msg.content} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={bottomRef}></div>
            </div>

            {/* Input area */}
            <div className="flex gap-2 p-3 border-t border-gray-200 bg-white">
              <input
                className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your answer or question..."
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition shadow-md flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
