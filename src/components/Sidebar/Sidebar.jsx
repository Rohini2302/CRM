import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
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

  // Check if a menu item is active
  const isActive = (path) => location.pathname === path;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Clear authentication flag
    localStorage.removeItem("userRole"); // Remove user role
    localStorage.removeItem("userEmail"); // Remove user email
    navigate("/login"); // Redirect to login page
  };

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
      <div className={`sidebar1 ${isOpen ? "open" : ""}`} ref={sidebarRef}>
        {/* Logo/Site Name */}
        <div className="sidebar-header">
          <h2>LeadManager</h2>
        </div>
        
        {/* Menu Items */}
        <ul className="sidebar-menu">
          <li className={isActive("/") ? "active" : ""}>
            <Link to="/" onClick={closeSidebar}>📊 Dashboard</Link>
          </li>
          <li className={isActive("/leads") ? "active" : ""}>
            <Link to="/leads" onClick={closeSidebar}>📋 Leads</Link>
          </li>
          <li className={isActive("/settings") ? "active" : ""}>
            <Link to="/settings" onClick={closeSidebar}>⚙️ Generate</Link>
          </li>
          <li className={isActive("/Showlead") ? "active" : ""}>
            <Link to="/Showlead" onClick={closeSidebar}>📈 Show Lead</Link>
          </li>
          <li className={isActive("/AgentLead") ? "active" : ""}>
            <Link to="/AgentLead" onClick={closeSidebar}>🕵️‍♂️ AgentLead</Link>
          </li>
          <li className={isActive("/Agentform") ? "active" : ""}>
            <Link to="/Agentform" onClick={closeSidebar}>📝 Agent Form</Link>
          </li>
          
        </ul>

        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </>
  );
};

export default Sidebar;
