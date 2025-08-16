"use client";

// frontend/src/app/registration/page.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./registration.css";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

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
    // Your backend /auth/google will redirect back to /profile?token=...
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div className="auth-container">
      {/* OPTIONAL: keep using your registration.css background */}
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
            {mode === "login"
              ? "Log in to continue"
              : "Sign up to get started"}
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

            {err && (
              <p className="text-red-600 text-sm mb-2">
                {err}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading
                ? (mode === "login" ? "Logging in..." : "Creating account...")
                : (mode === "login" ? "Log In" : "Register")}
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
    </div>
  );
}
