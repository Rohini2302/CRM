import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AgentLeadsList.css";

const AgentLeadsList = () => {
  const [agentLeads, setAgentLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [filteredLeads, setFilteredLeads] = useState([]);

  useEffect(() => {
    const fetchAgentLeads = async () => {
      const email = localStorage.getItem("userEmail");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getAgentLeads?email=${email}`
        );
        setAgentLeads(response.data);
        setFilteredLeads(response.data);
      } catch (error) {
        console.error("Error fetching agent leads:", error);
      }
    };

    fetchAgentLeads();

    // Adding 40 dummy agent leads for testing
    const dummyData = Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      name: `Agent ${index + 1}`,
      email: `agent${index + 1}@crm.com`,
      password: "*****",
      leadStatus: index % 2 === 0 ? "Active" : "Inactive",
      assignedLeads: `Lead ${index % 10}`,
    }));

    setAgentLeads(dummyData);
    setFilteredLeads(dummyData);
  }, []);

  // Automatically filter when searchTerm or filterBy changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLeads(agentLeads);
    } else {
      const newFilteredLeads = agentLeads.filter((lead) => {
        const term = searchTerm.toLowerCase();
        if (filterBy === "all") {
          return (
            lead.name.toLowerCase().includes(term) ||
            lead.email.toLowerCase().includes(term) ||
            lead.assignedLeads.toLowerCase().includes(term) ||
            lead.leadStatus.toLowerCase().includes(term)
          );
        } else {
          return lead[filterBy].toLowerCase().includes(term);
        }
      });
      setFilteredLeads(newFilteredLeads);
    }
  }, [searchTerm, filterBy, agentLeads]);

  const handleReset = () => {
    setSearchTerm("");
  };

  return (
    <div className="agent-leads-list">
      <h1 className="Agent-Title">Agent Leads List</h1>

      {/* Search and Filter Controls */}
      <div className="search-filter-container">
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">ALL</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="assignedLeads">Assigned Leads</option>
          <option value="leadStatus">Status</option>
        </select>

        <input
          type="text"
          placeholder="Enter search term..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {/* Show Reset Button only when filtered */}
        {searchTerm && (
          <button className="reset-btn" onClick={handleReset}>
            Show List
          </button>
        )}
      </div>

      {/* 🟢 Table Wrapper for Scrolling */}
      
      {/* <div className="table-container">
        <table>
        <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Assigned Leads</th>
              <th>Status</th>
            </tr>
          </thead>
        </table>
        
        <table> */}
          {/* <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Assigned Leads</th>
              <th>Status</th>
            </tr>
          </thead> */}
          {/* <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.id}</td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.password}</td>
                <td>{lead.assignedLeads}</td>
                <td>{lead.leadStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

<div className="table-container">
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Password</th>
        <th>Assigned Leads</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {filteredLeads.map((lead) => (
        <tr key={lead.id}>
          <td>{lead.id}</td>
          <td>{lead.name}</td>
          <td>{lead.email}</td>
          <td>{lead.password}</td>
          <td>{lead.assignedLeads}</td>
          <td>{lead.leadStatus}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      
    </div>
  );
};

export default AgentLeadsList;
