import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import TopBar from "./components/Topbar/Topbar";
import Dashboard from "./components/pages/dasboard/dashboard";
import Leads from "./components/pages/dasboard/leads/Leads";
import Reports from "./components/pages/reports/report";
import Settings from "./components/pages/settings/settings";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <TopBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
