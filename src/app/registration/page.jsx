"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function RegistrationPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signup"); // "signup" | "login" | "forgot"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true); // for JWT check
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check existing JWT and handle Google OAuth redirect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");

    if (oauthToken) {
      handleOAuthRedirect(oauthToken);
      return;
    }

    verifyToken(); // background token check
  }, []);

  // ✅ Safe token check with timeout
  const verifyToken = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setCheckingToken(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // abort after 8s

      const res = await fetch(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("Token invalid");
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/home");
      } else {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
    } finally {
      setCheckingToken(false);
    }
  };

  const handleOAuthRedirect = async (token) => {
    localStorage.setItem("jwt", token);

    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("OAuth token fetch error:", err);
    } finally {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, document.title, url.toString());
      handleSuccess();
    }
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuth = async (e) => {
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
    if ((mode === "signup" || mode === "login") && (!form.password || form.password.length < 4)) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    setLoading(true);
    try {
      let endpoint = "";
      let payload = {};

      if (mode === "signup") {
        endpoint = `${API_BASE}/user/signup`;
        payload = {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        };
      } else if (mode === "login") {
        endpoint = `${API_BASE}/user/login`;
        payload = {
          email: form.email.trim(),
          password: form.password,
        };
      } else if (mode === "forgot") {
        endpoint = `${API_BASE}/user/forgot-password`;
        payload = { email: form.email.trim() };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Server error (${res.status})`);
      }

      if (mode === "forgot") {
        setErrorMsg(
          "✅ Password reset link has been sent to your email. Please check your inbox and follow the instructions. The link will expire in 15 minutes."
        );
      } else {
        localStorage.setItem("jwt", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        handleSuccess();
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      router.push("/home");
    }, 1500);
  };

  const handleGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          {mode === "signup" ? "🎉 Create Account" : mode === "login" ? "👋 Welcome Back" : "🔑 Reset Password"}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {mode === "signup"
            ? "Sign up to track progress, earn stars ⭐ and unlock more fun."
            : mode === "login"
            ? "Log in to continue your journey 🚀"
            : "Enter your email and we'll send you a password reset link."}
        </p>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-md">{errorMsg}</div>
        )}

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

          {(mode === "signup" || mode === "login") && (
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
          )}

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
                : mode === "login"
                ? "Signing in..."
                : "Sending..."
              : mode === "signup"
              ? "Create Account"
              : mode === "login"
              ? "Sign In"
              : "Send Reset Link"}
          </motion.button>
        </form>

        {(mode === "signup" || mode === "login") && (
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition mt-4"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-gray-700">
              {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
            </span>
          </button>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-green-600 font-medium hover:underline">
                Login
              </button>
            </>
          ) : mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-green-600 font-medium hover:underline">
                Sign up
              </button>
              <br />
              Forgot password?{" "}
              <button onClick={() => setMode("forgot")} className="text-red-600 font-medium hover:underline">
                Reset here
              </button>
            </>
          ) : (
            <>
              Remembered your password?{" "}
              <button onClick={() => setMode("login")} className="text-green-600 font-medium hover:underline">
                Back to Login
              </button>
            </>
          )}
        </div>
      </motion.div>

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
                  : mode === "login"
                  ? "You are now logged in 🚀"
                  : "Check your email for the password reset link."}
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
