import React, { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../../../firebaseConfig";
import "./Auth.css";

const Auth = ({ handleLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Listen for auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Store user UID in localStorage when authenticated
        localStorage.setItem("firebaseUserUID", user.uid);
      } else {
        // Remove when signed out
        localStorage.removeItem("firebaseUserUID");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // 🔹 Register User
        if (!email || !password || !confirmPassword) {
          throw new Error("Please fill in all fields");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match!");
        }

        if (password.length < 6) {
          throw new Error("Password should be at least 6 characters");
        }

        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Store user data in Realtime Database
        await set(ref(database, 'users/' + userCredential.user.uid), {
          email: email,
          createdAt: new Date().toISOString(),
          uid: userCredential.user.uid  // Also store UID in database
        });

        // Store UID in localStorage
        localStorage.setItem("firebaseUserUID", userCredential.user.uid);

        setIsRegister(false);
        alert("Account created successfully! Please login.");
      } else {
        // 🔹 Login User
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          email, 
          password
        );
        
        // Store UID in localStorage
        localStorage.setItem("firebaseUserUID", userCredential.user.uid);
        
        handleLogin();
      }
    } catch (error) {
      setError(getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert Firebase error codes to user-friendly messages
  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return (
    <div className={`auth-container ${isRegister ? "register-mode" : ""}`}>
      <div className="form-container">
        <div className="toggle-panel">
          <h2>{isRegister ? "Welcome Back!" : "Hello, Friend!"}</h2>
          <p>{isRegister ? "Login to continue" : "Sign up to start your journey"}</p>
          <button 
            onClick={() => setIsRegister(!isRegister)}
            disabled={loading}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </div>

        <div className="form-box">
          <h2>{isRegister ? "Register" : "Login"}</h2>
          {error && <p className="error-message">{error}</p>}

          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {isRegister && (
            <input
              type="password"
              className="auth-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          )}

          <button 
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? "Processing..." : (isRegister ? "Sign Up" : "Login")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;