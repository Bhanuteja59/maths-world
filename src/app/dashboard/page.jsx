"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "../levels/loading";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.push("/registration");
      return;
    }

    const cachedUser = localStorage.getItem("user");
    if (cachedUser) setUser(JSON.parse(cachedUser));

    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          router.push("/registration");
          return;
        }

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setHistory(data.user.history || []);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  if (loading && !user) return <Loading />;
  if (!user) return null;

  const scorePct = (score) => Math.min(100, (score / 100) * 100);

  return (
    <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 min-h-screen px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8"
      >
        {/* Profile & Scores */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>

          <div className="mt-6 w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Best Scores
            </h2>
            {["easy", "medium", "hard"].map((lvl) => (
              <div key={lvl} className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span className="capitalize">{lvl}</span>
                  <span>{user.scores?.[lvl] ?? 0}/100</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${scorePct(user.scores?.[lvl] ?? 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
                router.push("/registration");
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* History & Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Welcome, {user.username} 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Play more quizzes to earn more stars and improve your scores!
          </p>

          {/* Recent History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Recent Activity
            </h3>
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {history.length > 0 ? (
                history
                  .slice(-5) // show last 5
                  .reverse()
                  .map((entry, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {entry.label || "Quiz Attempt"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.difficulty} •{" "}
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-green-600 font-bold">
                        +{entry.value}
                      </span>
                    </li>
                  ))
              ) : (
                <p className="text-gray-500 text-sm">No history yet.</p>
              )}
            </ul>
          </div>

          {/* Stars / Achievements */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Stars & Achievements
            </h3>
            <div className="flex gap-2 flex-wrap">
              {[...Array(user.stars || Math.floor(history.length / 10))].map(
                (_, idx) => (
                  <motion.span
                    key={idx}
                    className="text-yellow-400 text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    ★
                  </motion.span>
                )
              )}
              {[...Array(Math.max(0, 5 - (user.stars || Math.floor(history.length / 10))))].map(
                (_, idx) => (
                  <span key={idx} className="text-gray-300 text-2xl">
                    ★
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto mt-12 text-center text-sm text-gray-600">
        <div className="py-6">
          <Link href="/about" className="mx-2 hover:underline">
            About
          </Link>
          <Link href="/contact" className="mx-2 hover:underline">
            Contact
          </Link>
          <Link href="/privacy-policy" className="mx-2 hover:underline">
            Privacy Policy
          </Link>
        </div>
        <div className="text-xs">
          © {new Date().getFullYear()} Maths World — built with ❤️
        </div>
      </footer>
    </div>
  );
}
