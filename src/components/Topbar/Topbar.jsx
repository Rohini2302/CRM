import React from "react";
import { FaSearch, FaUserCircle, FaSignOutAlt, FaBell, FaCog } from "react-icons/fa";
import "./Topbar.css";

const Topbar = () => {
  return (
    <div className="topbar">
      <h1 className="logo">Lead Management System</h1>

      {/* Search Field */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      {/* Buttons & Profile */}
      <div className="topbar-actions">
        <button className="icon-btn">
          <FaBell />
        </button>
        <button className="icon-btn">
          <FaCog />
        </button>

        {/* Profile and Sign Out */}
        <div className="profile-section">
          <FaUserCircle className="profile-icon" />
          <button className="signout-btn">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
