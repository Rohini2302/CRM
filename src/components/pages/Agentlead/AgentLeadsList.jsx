import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebaseConfig";
import "./AgentLeadsList.css";

const AgentLeadsList = () => {
  const [agentLeads, setAgentLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const userUID = localStorage.getItem("firebaseUserUID");

  useEffect(() => {
    if (!userUID) return;

    const fetchAgentLeads = () => {
      setLoading(true);
      const agentLeadsRef = ref(database, `users/${userUID}/agentLeads`);
      
      const unsubscribe = onValue(agentLeadsRef, (snapshot) => {
        const leadsData = snapshot.val() || {};
        
        // Convert Firebase object to array
        const leadsArray = Object.keys(leadsData).map(key => ({
          id: key,
          ...leadsData[key]
        }));

        setAgentLeads(leadsArray);
        setFilteredLeads(leadsArray);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchAgentLeads();
  }, [userUID]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLeads(agentLeads);
    } else {
      const term = searchTerm.toLowerCase();
      const newFilteredLeads = agentLeads.filter((lead) => {
        if (filterBy === "all") {
          return (
            lead.name?.toLowerCase().includes(term) ||
            lead.email?.toLowerCase().includes(term) ||
            lead.assignedLeads?.toLowerCase().includes(term) ||
            lead.leadStatus?.toLowerCase().includes(term)
          );
        }
        return lead[filterBy]?.toLowerCase().includes(term);
      });
      setFilteredLeads(newFilteredLeads);
    }
  }, [searchTerm, filterBy, agentLeads]);

  const handleReset = () => {
    setSearchTerm("");
  };

  if (loading) {
    return <div className="loading">Loading agent leads...</div>;
  }

  return (
    <div className="agent-leads-list">
      <h1 className="Agent-Title">Agent Leads List</h1>

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

        {searchTerm && (
          <button className="reset-btn" onClick={handleReset}>
            Show All
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
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
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.password}</td>
                <td>{lead.assignedLeads}</td>
                <td>
                  <span className={`status-badge ${lead.leadStatus.toLowerCase()}`}>
                    {lead.leadStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentLeadsList;