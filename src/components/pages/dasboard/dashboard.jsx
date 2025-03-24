import React, { useState } from "react";
import { FaHandshake, FaFolderOpen, FaPhoneAlt, FaChartLine } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Toggle dropdown visibility
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="header">
        <div className="profile">
          <div className="icon1">🏢</div>
          <h2>Welcome to CRM</h2>
        </div>
        <div className="dropdown">
          <select>
            <option>Home</option>
            <option>Classic View</option>
            <option>Manage Home</option>
          </select>
        </div>
      </div>

      {/* Stats Grid with Icons */}
      <div className="stats-grid">
        <div className="card">
          <FaHandshake size={24} style={{ marginBottom: "10px" }} />
          <h3>My Open Deals</h3>
          <p>0</p>
        </div>
        <div className="card">
          <FaFolderOpen size={24} style={{ marginBottom: "10px" }} />
          <h3>My Untouched Deals</h3>
          <p>0</p>
        </div>
        <div className="card">
          <FaPhoneAlt size={24} style={{ marginBottom: "10px" }} />
          <h3>My Calls Today</h3>
          <p>0</p>
        </div>
        <div className="card">
          <FaChartLine size={24} style={{ marginBottom: "10px" }} />
          <h3>My Leads</h3>
          <p>0</p>
        </div>
      </div>

      {/* Tasks & Meetings Section */}
      <div className="task-meeting">
        {[
          { title: "My Open Tasks", message: "No Tasks found." },
          { title: "My Meetings", message: "No Meetings found." },
          { title: "Today's Leads", message: "No lead found." },
          { title: "My Deals Closing This Month", message: "No Deals found." },
        ].map((item, index) => (
          <div className="task-card" key={index}>
            <div className="card-header">
              <h3>{item.title}</h3>
              {/* 3 Dots Menu */}
              <div className="menu-container">
                <button className="menu-btn" onClick={() => toggleDropdown(index)}>⋮</button>
                {openDropdown === index && (
                  <div className="dropdown-menu">
                    <ul>
                      <li>Edit</li>
                      <li>Delete</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="empty">
              <img
                src="https://www.pngall.com/wp-content/uploads/8/Task-PNG-Image-File.png"
                alt="Placeholder"
                style={{ width: "100px", height: "100px", marginBottom: "10px" }}
              />
              <p>{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;