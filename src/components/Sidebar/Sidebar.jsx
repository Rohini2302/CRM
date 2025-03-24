import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Hamburger Menu Icon */}
      <button 
        className={`menu-icon ${isOpen ? "open" : ""}`} 
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      <div 
        className={`sidebar1 ${isOpen ? "open" : ""}`} 
        ref={sidebarRef}
      >
        <ul>
          <li><Link to="/">📊 Dashboard</Link></li>
          <li><Link to="/form-selector">📋 Leads</Link></li>
          <li><Link to="/Showlead">📈 Show Lead</Link></li>
          <li><Link to="/settings">⚙️ Settings</Link></li>
          <li><Link to="/AgentLead">🕵️‍♂️ AgentLead</Link></li>
          <li><Link to="/Agentform">📝 Agent Form</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;