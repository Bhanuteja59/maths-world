"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    // verify token (now exists in backend)
    fetch(`${API_BASE}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(() => router.replace("/home"))
      .catch(() => {
        localStorage.removeItem("jwt");
        setCheckingAuth(false);
      });
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

  const handleGoogle = () => {
    setGoogleDialog(true);
    setTimeout(() => {
      window.location.href = `${API_BASE}/auth/google`;
    }, 1200);
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
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>
      <div className="bg-blur-circle-3"></div>

      <div className="auth-card">
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

        <div className="auth-content">
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="mb-3">
                <label className="form-label">Username</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    className="input-with-icon-control"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <span className="input-icon">📧</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-with-icon-control"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-with-icon-control"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {err && <p className="text-red-600 text-sm mb-2">{err}</p>}

            <button type="submit" disabled={isLoading} className="auth-submit-btn">
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
