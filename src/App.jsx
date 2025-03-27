import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/pages/dasboard/dashboard";
import Settings from "./components/pages/settings/settings";
import AgentLeadsList from "./components/pages/Agentlead/AgentLeadsList";
import Showlead from "./components/pages/Showlead/Showlead";
import AgentLeadForm from "./components/pages/AgentForm/AgentLeadForm";
import Builder from "./components/Builder";
import Auth from "./components/pages/Auth/Auth"; 
import "./App.css";
import Leads from "./components/pages/Excel/Leads";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    console.log("Stored Auth:", storedAuth); // Debugging Line
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false); // Ensure it resets properly
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="container">
        {isAuthenticated ? (
          <>
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Builder />} />
                <Route path="/Showlead" element={<Showlead />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/AgentLead" element={<AgentLeadsList />} />
                <Route path="/Agentform" element={<AgentLeadForm />} />
                <Route path="/excel" element={<Leads />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/auth" element={<Auth handleLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
