import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

// Custom window size hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { width } = useWindowSize();
  const isDesktop = width > 768;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    window.location.href = "/auth";
  };

  return (
    <>
      {/* Hide hamburger menu on "/leads" */}
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

      <div
        className={`sidebar1 ${isOpen ? "open" : ""} ${
          isDesktop && location.pathname === "/leads" ? "hidden" : ""
        }`}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <h2>LeadManager</h2>
        </div>

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
            <Link to="/excel" onClick={closeSidebar}>📝 Import Excel</Link>
          </li>
        </ul>

        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
