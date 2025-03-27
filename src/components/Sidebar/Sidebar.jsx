import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close Sidebar
  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Hide sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    window.location.href = "/auth"; // Redirect to login
  };

  return (
    <>
      {/* Hamburger Menu - Hidden on "/leads" */}
      {location.pathname !== "/leads" && (
        <button
          className={`menu-icon ${isOpen ? "open" : ""}`}
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* Sidebar - Hidden on "/leads" */}
      {location.pathname !== "/leads" && (
        <div className={`sidebar1 ${isOpen ? "open" : ""}`} ref={sidebarRef}>
          <div className="sidebar-header">
            <h2>LeadManager</h2>
          </div>

          {/* Menu Items */}
          <ul className="sidebar-menu">
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/" onClick={closeSidebar}>📊 Dashboard</Link>
            </li>
            <li className={location.pathname === "/leads" ? "active" : ""}>
              <Link to="/leads" onClick={closeSidebar}>📋 Leads</Link>
            </li>
            <li className={location.pathname === "/settings" ? "active" : ""}>
              <Link to="/settings" onClick={closeSidebar}>⚙️ Generate</Link>
            </li>
            <li className={location.pathname === "/Showlead" ? "active" : ""}>
              <Link to="/Showlead" onClick={closeSidebar}>📈 Show Lead</Link>
            </li>
            <li className={location.pathname === "/AgentLead" ? "active" : ""}>
              <Link to="/AgentLead" onClick={closeSidebar}>🕵️‍♂️ AgentLead</Link>
            </li>
            <li className={location.pathname === "/Agentform" ? "active" : ""}>
              <Link to="/Agentform" onClick={closeSidebar}>📝 Agent Form</Link>
            </li>
            <li className={location.pathname === "/excel" ? "active" : ""}>
            <Link to="/excel" onClick={closeSidebar}>📝import excel</Link>
          </li>
          </ul>

          {/* Logout Button */}
          <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
