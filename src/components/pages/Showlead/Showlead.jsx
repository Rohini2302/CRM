import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../../../firebaseConfig";
import "./Showlead.css";
import { FaRobot, FaPhone, FaEnvelope, FaWhatsapp, FaSms } from "react-icons/fa"; // Icons

function Showlead() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchForms = () => {
      const formsRef = ref(database, "forms");

      onValue(formsRef, (snapshot) => {
        if (snapshot.exists()) {
          const formsData = snapshot.val();
          const formEntries = Object.entries(formsData).map(([key, value]) => ({
            id: key,
            title: value.title || key,
          }));

          setForms(formEntries);
          setSelectedForm(formEntries[0]?.id || null);
        }
      });
    };

    fetchForms();
  }, []);

  useEffect(() => {
    if (!selectedForm) return;

    const fetchSubmissions = () => {
      setLoading(true);
      const submissionsRef = ref(database, `forms/${selectedForm}/submissions`);

      onValue(submissionsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const firstEntry = Object.values(data)[0] || {};
          setTableHeaders([...Object.keys(firstEntry), "Status", "AI Action", "Actions"]);

          const formattedData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            status: data[key].status || "Onprocess",
          }));

          setTableData(formattedData);
          setFilteredData(formattedData);
        } else {
          setTableData([]);
          setFilteredData([]);
          setTableHeaders([]);
        }
        setLoading(false);
      });
    };

    fetchSubmissions();
  }, [selectedForm]);

  // Handle status change
  const handleStatusChange = (rowId, newStatus) => {
    const submissionRef = ref(database, `forms/${selectedForm}/submissions/${rowId}`);
    update(submissionRef, { status: newStatus });
  };

  // Handle AI action
  const handleAIAction = (rowId) => {
    alert(`AI script triggered for Lead ID: ${rowId}`);
  };

  // Search Function
  useEffect(() => {
    let newData = [...tableData];

    if (searchTerm) {
      newData = newData.filter((row) =>
        Object.values(row).some(
          (value) =>
            typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterStatus !== "All") {
      newData = newData.filter((row) => row.status === filterStatus);
    }

    setFilteredData(newData);
  }, [searchTerm, filterStatus, tableData]);

  return (
    <div className="showlead-container">
      <h1>Form Submissions</h1>

      {/* Tabs for Forms */}
      <div className="tabs">
        {forms.map((form, index) => (
          <button
            key={index}
            className={`tab ${selectedForm === form.id ? "active" : ""}`}
            onClick={() => setSelectedForm(form.id)}
          >
            {form.title}
          </button>
        ))}
      </div>

      {/* Search & Filter Section */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
          <option value="Onprocess">Onprocess</option>
        </select>
      </div>

      {/* Table Content */}
      <div className="table-container">
        {loading ? (
          <div className="loading-message">Loading data...</div>
        ) : filteredData.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  {tableHeaders.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr key={row.id || rowIndex}>
                    <td>{rowIndex + 1}</td>
                    {tableHeaders
                      .filter((header) => !["Status", "AI Action", "Actions"].includes(header))
                      .map((header) => (
                        <td key={header}>{row[header] || "-"}</td>
                      ))}
                    {/* Status Dropdown */}
                    <td>
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                      >
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                        <option value="Onprocess">Onprocess</option>
                      </select>
                    </td>
                    {/* AI Action Button */}
                    <td>
                      <button className="ai-btn" onClick={() => handleAIAction(row.id)}>
                        <FaRobot />
                      </button>
                    </td>
                    {/* Action Buttons */}
                    <td className="action-icons">
  <a href="tel:1234567890" className="action-icon call">
    <FaPhone />
  </a>
  <a href="sms:1234567890" className="action-icon msg">
    <FaSms />
  </a>
  <a href="https://wa.me/1234567890?text=Hello!" target="_blank" rel="noopener noreferrer" className="action-icon whatsapp">
    <FaWhatsapp />
  </a>
  <a href="mailto:test@example.com" className="action-icon email">
    <FaEnvelope />
  </a>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data-message">No submissions available</div>
        )}
      </div>
    </div>
  );
}

export default Showlead;
