import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../../../firebaseConfig";
import "./AgentLeadForm.css";

const AgentLeadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    leadStatus: "Active",
    assignedLeads: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const userUID = localStorage.getItem("firebaseUserUID");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userUID) {
      setErrorMessage("User not authenticated");
      return;
    }

    try {
      // Create a reference to the agent leads node for the current user
      const agentLeadsRef = ref(database, `users/${userUID}/agentLeads`);
      
      // Generate a new push ID for the lead
      const newLeadRef = push(agentLeadsRef);
      
      // Prepare lead data with timestamp
      const leadData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firebase
      await set(newLeadRef, leadData);

      setSuccessMessage("Agent lead saved successfully!");
      setErrorMessage("");
      setFormData({
        name: "",
        email: "",
        password: "",
        leadStatus: "Active",
        assignedLeads: "",
      });
    } catch (error) {
      console.error("Error saving agent lead:", error);
      setSuccessMessage("");
      setErrorMessage("Failed to save agent lead. Please try again.");
    }
  };

  return (
    <div className="agent-form-wrapper">
      <div className="agent-form-container">
        <h2 className="agent-form-heading">Agent Lead Form</h2>
        {successMessage && <p className="agent-success-message">{successMessage}</p>}
        {errorMessage && <p className="agent-error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="agent-input-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
          </div>

          <div className="agent-input-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
          </div>

          {/* Dropdown for Lead Status */}
          <div className="agent-input-group">
            <select
              name="leadStatus"
              value={formData.leadStatus}
              onChange={handleChange}
              className="agent-select-field"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="agent-input-group">
            <input
              type="text"
              name="assignedLeads"
              placeholder="Assigned Leads"
              value={formData.assignedLeads}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
          </div>

          <button type="submit" className="agent-submit-button">
            Submit
          </button>
        </form>
      </div>

      {/* Agent Preview */}
      <div className="agent-preview-container">
        <h3 className="agent-preview-heading">Agent Preview</h3>
        {Object.entries(formData).map(([key, value]) => (
          <p className="agent-preview-item" key={key}>
            <strong className="agent-preview-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </strong>
            <span className="agent-preview-value">{value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default AgentLeadForm;