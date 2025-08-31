"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatbotWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingText, setTypingText] = useState("");
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // Chat window open/close
  const bottomRef = useRef();

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText, open]);

  // Fetch user info for personalized greeting
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
      `What's on your mind 🤔`
    ];
    const randomIndex = Math.floor(Math.random() * problems.length);
    return `Hey ${userData?.username || "friend"}, let's start with: ${problems[randomIndex]}`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = input;
    pushMessage("user", msg);
    setInput("");
    setTypingText("...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setTypingText("");
      pushMessage("assistant", data.response);
    } catch {
      setTypingText("");
      pushMessage("assistant", "❌ Failed to get a response. Try again.");
    }
  };

  const ChatBubble = ({ role, content }) => {
    const [liked, setLiked] = useState(false);
    const isUser = role === "user";
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 transition-transform transform hover:scale-105`}>
        <div className={`relative p-4 rounded-2xl max-w-xs shadow-md ${isUser ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}>
          {content}
          {!isUser && (
            <button
              onClick={() => setLiked(!liked)}
              className={`absolute -top-2 -right-2 text-xl transition-transform ${liked ? "animate-bounce text-red-500" : "text-gray-400 hover:text-red-500"}`}
            >
              ❤️
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating chat button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition text-2xl"
          title="Chat with us"
        >
          💬
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-5 w-80 max-w-xs md:w-96 h-[500px] md:h-[600px] bg-gradient-to-b from-white to-gray-100 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-purple-600 text-white p-4 font-semibold flex justify-between items-center">
            <span>Maths Tutor</span>
            <button onClick={() => setOpen(false)} className="text-white text-lg font-bold">×</button>
          </div>

          {/* Chat content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} role={msg.role} content={msg.content} />
            ))}
            {typingText && <ChatBubble role="assistant" content={typingText} />}
            <div ref={bottomRef}></div>
          </div>

          {/* Input area */}
          <div className="flex gap-2 p-3 border-t border-gray-300">
            <input
              className="flex-1 p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your answer or question..."
            />
            <button
              onClick={sendMessage}
              className="bg-purple-500 text-white px-4 py-2 rounded-2xl hover:bg-purple-600 transition shadow-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Inline animation styles */}
      <style jsx>{`
        .animate-bounce {
          animation: bounce 0.6s infinite alternate;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}
