"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

import "./registration.css"

function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome back!");
        setTimeout(() => router.push("/home"), 1500);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => router.push("/home"), 1500);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Background Elements */}
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>
      <div className="bg-blur-circle-3"></div>

      <div className="auth-card">
        {/* Header with Tabs */}
        <div className="auth-header">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => {
                setIsLoginView(true);
                setActiveTab("login");
              }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => {
                setIsLoginView(false);
                setActiveTab("signup");
              }}
            >
              Sign Up
            </button>
          </div>
          <h2 className="auth-title">
            {isLoginView ? "Welcome Back" : "Get Started"}
          </h2>
          <p className="auth-subtitle">
            {isLoginView
              ? "Log in to access your personalized dashboard"
              : "Create an account to unlock all features"}
          </p>
        </div>

        {/* Social Login Options */}
        <div className="social-login">
          <button className="social-btn google-btn" onClick={handleGoogleLogin}>
            <img src="https://img.icons8.com/color/512/google-logo.png" alt="Google" width={20} height={20} />
            Continue with Google
          </button>
          <div className="divider">
            <span>or</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="auth-content">
          {isLoginView ? (
            <Form onSubmit={handleLogin}>
              <FormGroup className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <div className="input-with-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="input-icon"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="input-with-icon-control"
                  />
                </div>
              </FormGroup>
              <FormGroup className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="input-with-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="input-icon"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="input-with-icon-control"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormGroup>
              <Button
                type="submit"
                variant="primary"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="spin-animation" size={20} />
                ) : (
                  <>
                    Log In <ArrowRight size={18} className="ml-1" />
                  </>
                )}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleSignUp}>
              <FormGroup className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <div className="input-with-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="input-icon"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="input-with-icon-control"
                  />
                </div>
              </FormGroup>
              <FormGroup className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <div className="input-with-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="input-icon"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="input-with-icon-control"
                  />
                </div>
              </FormGroup>
              <FormGroup className="mb-4">
                <Form.Label>Password</Form.Label>
                <div className="input-with-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="input-icon"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="input-with-icon-control"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="password-strength">
                  <div
                    className={`strength-bar ${signupPassword.length > 0 && signupPassword.length < 6
                      ? "weak"
                      : signupPassword.length >= 6 && signupPassword.length < 10
                        ? "medium"
                        : signupPassword.length >= 10
                          ? "strong"
                          : ""
                      }`}
                  ></div>
                  <span className="strength-text">
                    {signupPassword.length === 0
                      ? ""
                      : signupPassword.length < 6
                        ? "Weak"
                        : signupPassword.length < 10
                          ? "Medium"
                          : "Strong"}
                  </span>
                </div>
              </FormGroup>
              <Button
                type="submit"
                variant="primary"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="spin-animation" size={20} />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} className="ml-1" />
                  </>
                )}
              </Button>
            </Form>
          )}
        </div>

        {/* Footer */}
        <div className="auth-footer">
          {isLoginView ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setIsLoginView(false);
                  setActiveTab("signup");
                }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsLoginView(true);
                  setActiveTab("login");
                }}
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;