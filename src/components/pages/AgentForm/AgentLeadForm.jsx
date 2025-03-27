import { useState } from "react";
import "./AgentLeadForm.css";

const AgentLeadForm = () => {
  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Email: "",
    Password: "",
    LeadStatus: "",
    AssignedLeads: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/saveAgentLead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit agent lead.");
      }

      setSuccessMessage("Agent lead saved successfully!");
      setErrorMessage("");
      setFormData({
        Id: "",
        Name: "",
        Email: "",
        Password: "",
        LeadStatus: "",
        AssignedLeads: "",
      });
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.message);
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
              name="Id"
              placeholder="Id"
              value={formData.Id}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
          </div>

          <div className="agent-input-group">
            <input
              type="text"
              name="Name"
              placeholder="Name"
              value={formData.Name}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
          </div>

          <div className="agent-input-row">
            <input
              type="text"
              name="Email"
              placeholder="Email"
              value={formData.Email}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
            <input
              type="text"
              name="Password"
              placeholder="Password"
              value={formData.Password}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
          </div>

          {/* Dropdown for Lead Status */}
          <div className="agent-input-group">
            <select
              name="LeadStatus"
              value={formData.LeadStatus}
              onChange={handleChange}
              className="agent-select-field"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="agent-input-group">
            <input
              type="text"
              name="AssignedLeads"
              placeholder="Assigned Leads"
              value={formData.AssignedLeads}
              onChange={handleChange}
              className="agent-input-field"
              required
            />
          </div>

          <button type="submit" className="agent-submit-button">Submit</button>
        </form>
      </div>

      {/* Agent Preview */}
      <div className="agent-preview-container">
        <h3 className="agent-preview-heading">Agent Preview</h3>
        {Object.entries(formData).map(([key, value]) => (
          <p className="agent-preview-item" key={key}>
            <strong className="agent-preview-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
            <span className="agent-preview-value">{value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default AgentLeadForm;
