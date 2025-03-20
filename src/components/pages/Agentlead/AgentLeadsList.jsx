import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AgentLeadsList.css";

const AgentLeadsList = () => {
  const [agentLeads, setAgentLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false); // Track if search is applied

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

  // Handles filtering when the search button is clicked
  const handleSearch = () => {
    const newFilteredLeads = agentLeads.filter((lead) =>
      lead[filterBy].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeads(newFilteredLeads);
    setIsFiltered(true); // Mark filtered state
  };

  // Reset to show all data
  const handleReset = () => {
    setFilteredLeads(agentLeads);
    setSearchTerm("");
    setIsFiltered(false);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="agent-leads-list">
      {/* Back Button
      <button className="back-btn" onClick={handleBack}>
        ← Back
      </button> */}

      <h2>Agent Leads List</h2>

      {/* Search and Filter Controls */}
      <div className="search-filter-container">
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="filter-dropdown"
        >
          <option value="name"> Name</option>
          <option value="email"> Email</option>
          <option value="assignedLeads"> Assigned Leads</option>
        </select>
        <button className="search-btn" onClick={handleSearch}>
          Filter
        </button>

        <input
          type="text"
          placeholder="Enter search term..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>

        {/* Show Reset Button only when filtered */}
        {isFiltered && (
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Assigned Leads</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.assignedLeads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentLeadsList;
