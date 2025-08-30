"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function RegistrationPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ✅ Handle Google OAuth redirect with ?token
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwt", token);
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, document.title, url.toString());
      handleSuccess();
    }
  }, []);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleAuth(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!validateEmail(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (mode === "signup" && (!form.username || form.username.trim().length < 2)) {
      setErrorMsg("Please provide a valid username (at least 2 characters).");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        mode === "signup" ? `${API_BASE}/user/signup` : `${API_BASE}/user/login`;

      const payload =
        mode === "signup"
          ? { username: form.username.trim(), email: form.email.trim(), password: form.password }
          : { email: form.email.trim(), password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.message || data?.error || `Server error (${res.status})`;
        throw new Error(msg);
      }

      if (!data?.success || !data?.token) {
        throw new Error(data?.message || "Authentication failed");
      }

      localStorage.setItem("jwt", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      handleSuccess();
    } catch (err) {
      setErrorMsg(err.message || "Auth error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Success modal handler
  const handleSuccess = () => {
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      router.push("/home");
    }, 2000); // auto close after 2s
  };

  const handleGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            {mode === "signup" ? "🎉 Create Account" : "👋 Welcome Back"}
          </h1>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          {mode === "signup"
            ? "Sign up to track progress, earn stars ⭐ and unlock more fun."
            : "Log in to continue your journey 🚀"}
        </p>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-md">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 4 characters"
                minLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3 text-sm text-gray-500"
              >
                {showPassword ? "🙈 Hide" : "👁 Show"}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading
              ? mode === "signup"
                ? "Creating..."
                : "Signing in..."
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="text-sm text-gray-400">or</div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Switch between Signup/Login */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === "signup" ? "login" : "signup"));
                setErrorMsg("");
              }}
              className="text-green-600 font-medium hover:underline"
            >
              {mode === "signup" ? "Login" : "Sign up"}
            </button>
          </p>
        </div>


        <br />

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition"
        >
          <FcGoogle size={22} />
          <span className="font-medium text-gray-700">
            {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
          </span>
        </button>
      </motion.div>

      {/* ✅ Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full"
            >
              <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Success!</h2>
              <p className="text-gray-600 mb-4">
                {mode === "signup"
                  ? "Your account has been created ✨"
                  : "You are now logged in 🚀"}
              </p>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-4xl"
              >
                🌟
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
