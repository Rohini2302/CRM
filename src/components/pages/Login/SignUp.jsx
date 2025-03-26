import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, createUserWithEmailAndPassword } from "../../../firebaseConfig"; // Import Firebase
import "./signup.css";

const Signup = () => {
  const [activeTab, setActiveTab] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Create a user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", activeTab);
      localStorage.setItem("userEmail", email);

      alert(`${activeTab} account created successfully!`);

      // Clear input fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/"); // Redirect to login page after signup
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert(error.message || "Error creating account!");
    }
  };

  const handleGoToLogin = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>

        {/* Admin/Agent Toggle */}
        <div className="tab-switch">
          <button className={activeTab === "Admin" ? "active" : ""} onClick={() => setActiveTab("Admin")}>
            Admin
          </button>
          <button className={activeTab === "Agent" ? "active" : ""} onClick={() => setActiveTab("Agent")}>
            Agent
          </button>
        </div>

        {/* Signup Form */}
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter email" 
        />

        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter password" 
        />

        <label>Confirm Password:</label>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirm password" 
        />

        <button onClick={handleSignup}>Sign Up</button>

        <p>Already have an account? <span className="login-link" onClick={handleGoToLogin} style={{ cursor: "pointer", color: "blue" }}>Login here</span></p>
      </div>
    </div>
  );
};

export default Signup;
