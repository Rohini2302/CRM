import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../../../firebaseConfig";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Store authentication state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);

      // Redirect to home
      navigate("/Showlead");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>Don't have an account? 
          <span onClick={() => navigate("/signin")} style={{ cursor: "pointer", color: "blue" }}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
