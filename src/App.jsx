import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import TopBar from "./components/Topbar/Topbar";
import Dashboard from "./components/pages/dasboard/dashboard";
import Reports from "./components/pages/reports/report";
import Settings from "./components/pages/settings/settings";
import AgentLeadsList from "./components/pages/Agentlead/AgentLeadsList";
import Showlead from "./components/pages/Showlead/Showlead";
import AgentLeadForm from "./components/pages/AgentForm/AgentLeadForm";
import Builder from "./components/Builder";
import Login from "./components/pages/Login/Login"; 
import Signin from './components/pages/Login/SignUp';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authKey, setAuthKey] = useState(0); // 🔹 This forces re-render on login

  // Check if user is already logged in
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login
  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    setAuthKey((prevKey) => prevKey + 1); // 🔹 Force re-render
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    setAuthKey((prevKey) => prevKey + 1); // 🔹 Force re-render
  };

  return (
    <Router>
      <div className="container">
        {isAuthenticated ? (
          <>
            <Sidebar />
            <div className="main-content">
              <Routes key={authKey}>  {/* 🔹 Ensures Routes re-render on login */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Builder />} />
                <Route path="/Showlead" element={<Showlead />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/AgentLead" element={<AgentLeadsList />} />
                <Route path="/Agentform" element={<AgentLeadForm />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes key={authKey}>  {/* 🔹 Re-renders Routes when auth changes */}
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
