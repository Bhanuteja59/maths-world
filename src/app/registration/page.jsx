"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./registration.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [googleDialog, setGoogleDialog] = useState(false);

  // ✅ Check if user already has token
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      fetch(`${API_BASE}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then(() => {
          router.replace("/home");
        })
        .catch(() => {
          localStorage.removeItem("jwt");
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setIsLoading(true);
    try {
      const endpoint = mode === "login" ? "/login" : "/signup";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data?.token) {
        throw new Error(data?.message || "Request failed");
      }

      localStorage.setItem("jwt", data.token);
      router.push("/home");
    } catch (e) {
      setErr(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Show modal + redirect after short delay
  const handleGoogle = () => {
    setGoogleDialog(true);
    setTimeout(() => {
      window.location.href = `${API_BASE}/auth/google`;
    }, 1800); // 1.8s delay for user to see animation
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
        <p className="ml-2">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {/* Background */}
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>
      <div className="bg-blur-circle-3"></div>

      <div className="auth-card">
        {/* Tabs */}
        <div className="auth-header">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Register
            </button>
          </div>
          <h2 className="auth-title">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="auth-subtitle">
            {mode === "login" ? "Log in to continue" : "Sign up to get started"}
          </p>
        </div>

        {/* Google */}
        <div className="social-login">
          <button className="social-btn google-btn" onClick={handleGoogle}>
            <img
              src="https://img.icons8.com/color/512/google-logo.png"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google
          </button>
          <div className="divider">
            <span>or</span>
          </div>
        </div>

        {/* Email form */}
        <div className="auth-content">
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="mb-3">
                <label className="block text-sm font-medium">Username</label>
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="••••••••"
                required
              />
            </div>

            {err && <p className="text-red-600 text-sm mb-2">{err}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                ? "Log In"
                : "Register"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("signup")}>Register</button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => setMode("login")}>Log in</button>
            </p>
          )}
        </div>
      </div>

      {/* ✅ Google Dialog */}
      {googleDialog && (
        <div className="google-dialog-overlay">
          <div className="google-dialog">
            <div className="spinner"></div>
            <p>Redirecting to Google…</p>
          </div>
        </div>
      )}
    </div>
  );
}
