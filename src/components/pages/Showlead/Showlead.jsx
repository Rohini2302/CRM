import React, { useState } from 'react';
import "./Showlead.css"; // Import the CSS file

function Showlead() {
  // Dummy data for the table
  const initialData = [
    { id: 1, name: 'John Doe', age: 28, leads: 'Lead 1, Lead 2, Lead 3', status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 34, leads: 'Lead 4, Lead 5', status: 'Inactive' },
    { id: 3, name: 'Sam Green', age: 45, leads: 'Lead 6', status: 'Active' },
    { id: 4, name: 'Ella Brown', age: 30, leads: 'Lead 7, Lead 8, Lead 9', status: 'Pending' },
    { id: 5, name: 'Mike Johnson', age: 40, leads: 'Lead 10, Lead 11', status: 'Active' },
    { id: 6, name: 'Sarah Lee', age: 29, leads: 'Lead 12', status: 'Inactive' },
    { id: 7, name: 'Chris Evans', age: 35, leads: 'Lead 13, Lead 14, Lead 15', status: 'Active' },
    { id: 8, name: 'Laura Wilson', age: 32, leads: 'Lead 16', status: 'Pending' },
    { id: 9, name: 'David Brown', age: 38, leads: 'Lead 17, Lead 18', status: 'Active' },
    { id: 10, name: 'Emma Watson', age: 27, leads: 'Lead 19', status: 'Inactive' },
    { id: 11, name: 'James Bond', age: 42, leads: 'Lead 20, Lead 21, Lead 22', status: 'Active' },
    { id: 12, name: 'Olivia Taylor', age: 31, leads: 'Lead 23', status: 'Pending' },
    { id: 13, name: 'William Clark', age: 36, leads: 'Lead 24, Lead 25', status: 'Active' },
    { id: 14, name: 'Sophia Martinez', age: 33, leads: 'Lead 26', status: 'Inactive' },
    { id: 15, name: 'Daniel White', age: 39, leads: 'Lead 27, Lead 28, Lead 29', status: 'Active' },
  ];

  // State to manage the data, filter, search, and name filter
  const [data, setData] = useState(initialData);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  // Function to handle filter change
  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    applyFilters(status, searchQuery, nameFilter);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(filterStatus, query, nameFilter);
  };

  // Function to handle name filter input change
  const handleNameFilterChange = (e) => {
    const name = e.target.value;
    setNameFilter(name);
    applyFilters(filterStatus, searchQuery, name);
  };

  // Function to apply all filters
  const applyFilters = (status, query, name) => {
    let filteredData = initialData;

    // Apply status filter
    if (status !== 'All') {
      filteredData = filteredData.filter(item => item.status === status);
    }

    // Apply search query filter
    if (query) {
      filteredData = filteredData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    // Apply name filter
    if (name) {
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    setData(filteredData);
  };

  return (
    <div className="table-container">
      <h1>Show Leads</h1>

      {/* Container for search bar, name filter bar, and filter dropdown */}
      <div className="filter-container">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Name Filter Bar */}
        <div className="name-filter-bar">
          <input
            type="text"
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={handleNameFilterChange}
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="filter-dropdown">
          <select value={filterStatus} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Scrollable table wrapper */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Leads</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.leads}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Showlead;