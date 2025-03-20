import React, { useState } from "react";
import "./Leads.css";

const Leads = () => {
  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
  });

  const handleChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Lead Submitted:", lead);
    alert("Lead added successfully!");
    setLead({ name: "", email: "", phone: "", company: "", status: "New" });
  };

  return (
    <div className="leads-container">
      <h2>📋 Add New Lead</h2>
      <form className="lead-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={lead.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={lead.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={lead.phone}
            onChange={handleChange}
            placeholder="Enter phone"
            required
          />
        </div>

        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            name="company"
            value={lead.company}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={lead.status} onChange={handleChange}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Add Lead</button>
      </form>
    </div>
  );
};

export default Leads;
