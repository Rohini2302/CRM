import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">📊 Dashboard</Link></li>
        <li><Link to="/leads">📋 Leads</Link></li>
        <li><Link to="/reports">📈 Reports</Link></li>
        <li><Link to="/settings">⚙️ Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
