import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar1">
      <ul>
        <li><Link to="/">📊 Dashboard</Link></li>
        <li><Link to="/form-selector">📋 Leads</Link></li>
        <li><Link to="/Showlead">📈 Show Lead</Link></li>
        <li><Link to="/settings">⚙️ Settings</Link></li>
        <li><Link to="/AgentLead">🕵️‍♂️ AgentLead</Link></li>
        <li><Link to="/Agentform">📝 Agent Form</Link></li>

      </ul>
    </div>
  );
};

export default Sidebar;
