import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Import CSS for styling & animations

const Auth = ({ handleLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
    navigate("/");
  };

  return (
    <div className="auth-container">
      {/* Form Slider Container */}
      <div className={`form-box ${isLogin ? "login-mode" : "signup-mode"}`}>
        {/* Left Panel */}
        <div className="panel">
          <h2>Welcome!</h2>
          <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <button onClick={toggleForm}>{isLogin ? "Register" : "Login"}</button>
        </div>

        {/* Right Panel (Forms) */}
        <div className="form-container">
          {/* Login Form */}
          <div className={`form-content ${isLogin ? "active" : ""}`}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>
          </div>

          {/* Signup Form */}
          <div className={`form-content ${!isLogin ? "active" : ""}`}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" required />
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
