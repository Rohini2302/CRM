import React, { useState } from "react";
import "./Auth.css";

const Auth = ({ handleLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = () => {
    // Retrieve users array from localStorage or initialize it
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isRegister) {
      // **🔹 Register User**
      if (!email || !password || !confirmPassword) {
        setError("Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      // Check if the email already exists
      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        setError("An account with this email already exists.");
        return;
      }

      // Add new user to the users array
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      setIsRegister(false); // Switch to login mode
      setError("");
      alert("Account created successfully! Please login.");
    } else {
      // **🔹 Login User**
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        localStorage.setItem("isAuthenticated", "true");
        handleLogin();
        setError("");
      } else {
        setError("Invalid email or password!");
      }
    }
  };

  return (
    <div className={`auth-container ${isRegister ? "register-mode" : ""}`}>
      <div className="form-container">
        {/* 🔹 Left Panel for Switching */}
        <div className="toggle-panel">
          <h2>{isRegister ? "Welcome Back!" : "Hello, Friend!"}</h2>
          <p>{isRegister ? "Login to continue" : "Sign up to start your journey"}</p>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Register"}
          </button>
        </div>

        {/* 🔹 Right Panel for Form */}
        <div className="form-box">
          <h2>{isRegister ? "Register" : "Login"}</h2>
          {error && <p className="error-message">{error}</p>}

          <input
            type="email"
             className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
             className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 🔹 Show Confirm Password Only for Signup */}
          {isRegister && (
            <input
              type="password"
               className="auth-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button onClick={handleAuth}>{isRegister ? "Sign Up" : "Login"}</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;