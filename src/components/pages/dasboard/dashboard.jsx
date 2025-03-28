import React, { useState, useEffect } from "react";
import { FaWpforms, FaFolderOpen, FaPhoneAlt, FaChartLine } from "react-icons/fa";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebaseConfig";
import "./Dashboard.css";

const Dashboard = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [stats, setStats] = useState({
    openDeals: 0,
    untouchedDeals: 0,
    callsToday: 0,
    leads: 0
  });
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [todaysLeads, setTodaysLeads] = useState([]);
  const [monthlyDeals, setMonthlyDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const userUID = localStorage.getItem("firebaseUserUID");

  // Fetch all dashboard data
  useEffect(() => {
    if (!userUID) return;
  
    setLoading(true);
  
    const formsRef = ref(database, `users/${userUID}/forms`);
    const excelFilesRef = ref(database, `users/${userUID}/excelFiles`);
    const tasksRef = ref(database, `users/${userUID}/tasks`);
    const meetingsRef = ref(database, `users/${userUID}/meetings`);
    const leadsRef = ref(database, `users/${userUID}/leads`);
    const dealsRef = ref(database, `users/${userUID}/deals`);
  
    // Fetch Forms and Excel Leads Count
    onValue(formsRef, (snapshot) => {
      const formsData = snapshot.val() || {};
      const totalFormsCount = Object.keys(formsData).length;
    
      // Count total leads from all form submissions
      let totalCustomFormLeads = 0;
    
      Object.values(formsData).forEach((form) => {
        if (form.submissions) {
          totalCustomFormLeads += Object.keys(form.submissions).length;
        }
      });
    
      setStats((prev) => ({
        ...prev,
        openDeals: totalFormsCount,
        untouchedDeals: totalCustomFormLeads, // Set total leads under forms/submissions
      }));
    });
    
  
    onValue(excelFilesRef, (snapshot) => {
      const filesData = snapshot.val() || {};
      const totalLeadsCount = Object.values(filesData).reduce(
        (total, file) => total + (file.data?.length || 0),
        0
      );
  
      setStats(prev => ({
        ...prev,
        leads: totalLeadsCount
      }));
    });
  
    // Fetch Tasks
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {};
      const taskList = Object.values(tasksData);
      setTasks(taskList);
    });
  
    // Fetch Meetings
    onValue(excelFilesRef, (snapshot) => {
      const filesData = snapshot.val() || {};
      const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
      
      let todaysCalls = [];
      let upcomingCalls = [];
  
      Object.values(filesData).forEach((file) => {
        if (file.data) {
          file.data.forEach((lead) => {
            const meetingDate = lead.Call_Meeting_Date || lead.callMeetingDate; // Handle variations in column names
  
            if (meetingDate) {
              if (meetingDate.startsWith(today)) {
                todaysCalls.push(lead);
              } else if (meetingDate > today) {
                upcomingCalls.push(lead);
              }
            }
          });
        }
      });
  
      setTodaysLeads(todaysCalls);
      setMonthlyDeals(upcomingCalls); // Assuming monthlyDeals section will be used for upcoming calls
    });
  
    // Fetch Today's Leads
    onValue(leadsRef, (snapshot) => {
      const allLeads = snapshot.val() || {};
      const today = new Date().toISOString().split("T")[0];
  
      const todaysLeadsList = Object.values(allLeads).filter(lead => {
        return lead.date?.startsWith(today);
      });
  
      setTodaysLeads(todaysLeadsList);
    });
  
    // Fetch Deals Closing This Month
    onValue(dealsRef, (snapshot) => {
      const allDeals = snapshot.val() || {};
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
      const monthlyDealsList = Object.values(allDeals).filter(deal => {
        return deal.closingDate?.startsWith(currentMonth);
      });
  
      setMonthlyDeals(monthlyDealsList);
    });
  
    setLoading(false);
  }, [userUID]);
  

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

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
          <FaWpforms size={24} style={{ marginBottom: "10px" }} />
          <h3>My Total Forms</h3>
          <p>{stats.openDeals}</p>
        </div>
        <div className="card">
          <FaFolderOpen size={24} style={{ marginBottom: "10px" }} />
          <h3>Total Custom Leads</h3>
          <p>{stats.untouchedDeals}</p>
        </div>
        <div className="card">
          <FaPhoneAlt size={24} style={{ marginBottom: "10px" }} />
          <h3>My Calls Today</h3>
          <p>{stats.callsToday}</p>
        </div>
        <div className="card">
          <FaChartLine size={24} style={{ marginBottom: "10px" }} />
          <h3>My Excel Leads</h3>
          <p>{stats.leads}</p>
        </div>
      </div>

      {/* Tasks & Meetings Section */}
      <div className="task-meeting">
        <div className="task-card">
          <div className="card-header">
            <h3>My Open Tasks</h3>
            <div className="menu-container">
              <button className="menu-btn" onClick={() => toggleDropdown(0)}>⋮</button>
              {openDropdown === 0 && (
                <div className="dropdown-menu">
                  <ul>
                    <li>Edit</li>
                    <li>Delete</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {tasks.length > 0 ? (
            <ul className="task-list">
              {tasks.slice(0, 3).map((task, index) => (
                <li key={index}>{task.title}</li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <img
                src="https://www.pngall.com/wp-content/uploads/8/Task-PNG-Image-File.png"
                alt="Placeholder"
                style={{ width: "100px", height: "100px", marginBottom: "10px" }}
              />
              <p>No Tasks found.</p>
            </div>
          )}
        </div>

        <div className="task-card">
          <div className="card-header">
            <h3>My Meetings</h3>
            <div className="menu-container">
              <button className="menu-btn" onClick={() => toggleDropdown(1)}>⋮</button>
              {openDropdown === 1 && (
                <div className="dropdown-menu">
                  <ul>
                    <li>Edit</li>
                    <li>Delete</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {meetings.length > 0 ? (
            <ul className="task-list">
              {meetings.slice(0, 3).map((meeting, index) => (
                <li key={index}>{meeting.title} - {new Date(meeting.time).toLocaleString()}</li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <img
                src="https://www.pngall.com/wp-content/uploads/8/Task-PNG-Image-File.png"
                alt="Placeholder"
                style={{ width: "100px", height: "100px", marginBottom: "10px" }}
              />
              <p>No Meetings found.</p>
            </div>
          )}
        </div>

        <div className="task-card">
          <div className="card-header">
            <h3>Today's Leads</h3>
            <div className="menu-container">
              <button className="menu-btn" onClick={() => toggleDropdown(2)}>⋮</button>
              {openDropdown === 2 && (
                <div className="dropdown-menu">
                  <ul>
                    <li>Edit</li>
                    <li>Delete</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {todaysLeads.length > 0 ? (
            <ul className="task-list">
              {todaysLeads.slice(0, 3).map((lead, index) => (
                <li key={index}>{lead.name || lead.email || 'New Lead'}</li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <img
                src="https://www.pngall.com/wp-content/uploads/8/Task-PNG-Image-File.png"
                alt="Placeholder"
                style={{ width: "100px", height: "100px", marginBottom: "10px" }}
              />
              <p>No lead found.</p>
            </div>
          )}
        </div>

        <div className="task-card">
          <div className="card-header">
            <h3>My Deals Closing This Month</h3>
            <div className="menu-container">
              <button className="menu-btn" onClick={() => toggleDropdown(3)}>⋮</button>
              {openDropdown === 3 && (
                <div className="dropdown-menu">
                  <ul>
                    <li>Edit</li>
                    <li>Delete</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {monthlyDeals.length > 0 ? (
            <ul className="task-list">
              {monthlyDeals.slice(0, 3).map((deal, index) => (
                <li key={index}>{deal.title} - ${deal.value || 'N/A'}</li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <img
                src="https://www.pngall.com/wp-content/uploads/8/Task-PNG-Image-File.png"
                alt="Placeholder"
                style={{ width: "100px", height: "100px", marginBottom: "10px" }}
              />
              <p>No Deals found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;