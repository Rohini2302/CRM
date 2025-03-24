import React, { useState } from 'react';
import './Showlead.css'; // Import the CSS file

function App() {
  // Dummy data for the table (50 entries)
  const initialData = [
    // ... (same 50 dummy data entries as before)
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
    { id: 16, name: 'Liam Johnson', age: 26, leads: 'Lead 30', status: 'Pending' },
    { id: 17, name: 'Ava Davis', age: 29, leads: 'Lead 31, Lead 32', status: 'Active' },
    { id: 18, name: 'Noah Wilson', age: 37, leads: 'Lead 33', status: 'Inactive' },
    { id: 19, name: 'Isabella Moore', age: 31, leads: 'Lead 34, Lead 35', status: 'Active' },
    { id: 20, name: 'Mason Taylor', age: 40, leads: 'Lead 36', status: 'Pending' },
    { id: 21, name: 'Sophia Anderson', age: 28, leads: 'Lead 37, Lead 38', status: 'Active' },
    { id: 22, name: 'Ethan Thomas', age: 33, leads: 'Lead 39', status: 'Inactive' },
    { id: 23, name: 'Charlotte Jackson', age: 30, leads: 'Lead 40, Lead 41', status: 'Active' },
    { id: 24, name: 'Logan White', age: 35, leads: 'Lead 42', status: 'Pending' },
    { id: 25, name: 'Amelia Harris', age: 29, leads: 'Lead 43, Lead 44', status: 'Active' },
    { id: 26, name: 'Lucas Martin', age: 32, leads: 'Lead 45', status: 'Inactive' },
    { id: 27, name: 'Mia Thompson', age: 34, leads: 'Lead 46, Lead 47', status: 'Active' },
    { id: 28, name: 'Benjamin Garcia', age: 31, leads: 'Lead 48', status: 'Pending' },
    { id: 29, name: 'Harper Martinez', age: 27, leads: 'Lead 49, Lead 50', status: 'Active' },
    { id: 30, name: 'Elijah Robinson', age: 36, leads: 'Lead 51', status: 'Inactive' },
    { id: 31, name: 'Evelyn Clark', age: 30, leads: 'Lead 52, Lead 53', status: 'Active' },
    { id: 32, name: 'Alexander Rodriguez', age: 38, leads: 'Lead 54', status: 'Pending' },
    { id: 33, name: 'Abigail Lewis', age: 29, leads: 'Lead 55, Lead 56', status: 'Active' },
    { id: 34, name: 'James Lee', age: 33, leads: 'Lead 57', status: 'Inactive' },
    { id: 35, name: 'Emily Walker', age: 31, leads: 'Lead 58, Lead 59', status: 'Active' },
    { id: 36, name: 'Michael Hall', age: 35, leads: 'Lead 60', status: 'Pending' },
    { id: 37, name: 'Elizabeth Allen', age: 28, leads: 'Lead 61, Lead 62', status: 'Active' },
    { id: 38, name: 'Daniel Young', age: 32, leads: 'Lead 63', status: 'Inactive' },
    { id: 39, name: 'Sofia Hernandez', age: 30, leads: 'Lead 64, Lead 65', status: 'Active' },
    { id: 40, name: 'Matthew King', age: 37, leads: 'Lead 66', status: 'Pending' },
    { id: 41, name: 'Avery Wright', age: 29, leads: 'Lead 67, Lead 68', status: 'Active' },
    { id: 42, name: 'David Lopez', age: 34, leads: 'Lead 69', status: 'Inactive' },
    { id: 43, name: 'Scarlett Hill', age: 31, leads: 'Lead 70, Lead 71', status: 'Active' },
    { id: 44, name: 'Joseph Scott', age: 36, leads: 'Lead 72', status: 'Pending' },
    { id: 45, name: 'Madison Green', age: 28, leads: 'Lead 73, Lead 74', status: 'Active' },
    { id: 46, name: 'Samuel Adams', age: 33, leads: 'Lead 75', status: 'Inactive' },
    { id: 47, name: 'Chloe Baker', age: 30, leads: 'Lead 76, Lead 77', status: 'Active' },
    { id: 48, name: 'Henry Gonzalez', age: 35, leads: 'Lead 78', status: 'Pending' },
    { id: 49, name: 'Victoria Nelson', age: 29, leads: 'Lead 79, Lead 80', status: 'Active' },
    { id: 50, name: 'Jackson Carter', age: 32, leads: 'Lead 81', status: 'Inactive' },
    { id: 51, name: 'Jack Cart', age: 32, leads: 'Lead 81', status: 'Inactive' },
  ];

  // State to manage the data, filter, search, name filter, and pagination
  const [data, setData] = useState(initialData);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Number of rows per page

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('leads'); // Default tab is 'leads'

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
    setCurrentPage(1); // Reset to the first page after applying filters
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < Math.ceil(data.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'leads':
        return (
          <>
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
                  {currentRows.map((item) => (
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

            {/* Pagination controls */}
            <div className="pagination">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ◀ {/* Left arrow */}
              </button>
              {Array.from({ length: Math.ceil(data.length / rowsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={goToNextPage}
                disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
                className="pagination-button"
              >
                ▶ {/* Right arrow */}
              </button>
            </div>
          </>
        );
      case 'analytics':
        return <div className="tab-content">Analytics Content Goes Here</div>;
      case 'settings':
        return <div className="tab-content">Settings Content Goes Here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="table-container">
      <h1>Show Leads</h1>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div
          onClick={() => setActiveTab('leads')}
          className={`tab-section ${activeTab === 'leads' ? 'active' : ''}`}
        >
          Leads
        </div>
        <div
          onClick={() => setActiveTab('analytics')}
          className={`tab-section ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          Analytics
        </div>
        <div
          onClick={() => setActiveTab('settings')}
          className={`tab-section ${activeTab === 'settings' ? 'active' : ''}`}
        >
          Settings
        </div>
      </div>

      {/* Container for search bar, name filter bar, and filter dropdown */}
      {activeTab === 'leads' && (
        <div className="filter-container">
          {/* Search Bar */}
          <div className="name-filter-bar">
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
      )}

      {/* Render tab content */}
      {renderTabContent()}
    </div>
  );
}

export default App;