import { useState } from "react";
import "./AgentLeadForm.css";

const AgentLeadForm = () => {
  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Email: "",
    Password: "",
    LeadStatus: "",
    AssingedLeads: "",
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
        AssingedLeads: "",
      });
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container2">
      <div className="form-container">
        <h2>Agent Lead Form</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="Id"
              placeholder="Id"
              value={formData.Id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="Name"
              placeholder="Name"
              value={formData.Name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="Email"
              placeholder="Email"
              value={formData.Email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="Password"
              placeholder="Password"
              value={formData.Password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dropdown for Lead Status */}
          <div className="form-group">
            <select
              name="LeadStatus"
              value={formData.LeadStatus}
              onChange={handleChange}
              required
            >
              {/* <option value="">Select Lead Status</option> */}
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="AssingedLeads"
              placeholder="Assigned Leads"
              value={formData.AssingedLeads}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>

      {/* Keeping Agent Preview as it is */}
      <div className="preview-container">
      <h3>Agent Preview</h3>
      {Object.entries(formData).map(([key, value]) => (
    <p key={key}>
      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> 
      <span>{value}</span>
    </p>
        ))}
      </div>
    </div>
  );
};

export default AgentLeadForm;
