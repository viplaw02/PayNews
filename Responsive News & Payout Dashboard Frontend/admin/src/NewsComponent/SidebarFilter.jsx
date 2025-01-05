import React from 'react';
import { Form, Button } from 'react-bootstrap';

const SidebarFilter = ({ authorFilter, setAuthorFilter, dateRange, setDateRange, typeFilter, setTypeFilter, applyFilters, darkMode }) => {

  // Style for dark mode
  const darkModeStyles = {
    backgroundColor: '#333',
    color: '#fff',
    borderColor: '#fff',
  };

  // Style for light mode
  const lightModeStyles = {
    backgroundColor: '#f8f9fa',
    color: '#000',
    borderColor: '#ccc',
  };

  return (
    <div className={`sidebar p-4`} style={darkMode ? darkModeStyles : lightModeStyles}>
      <h4 className="mb-4">Filter Articles</h4>

      {/* Author Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Filter by Author</Form.Label>
        <Form.Control
          type="text"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          placeholder="Author name"
          style={darkMode ? { ...darkModeStyles, backgroundColor: '#444' } : { ...lightModeStyles }}
        />
      </Form.Group>

      {/* Date Range Filters */}
      <Form.Group className="mb-3">
        <Form.Label>From Date</Form.Label>
        <Form.Control
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          style={darkMode ? { ...darkModeStyles, backgroundColor: '#444' } : { ...lightModeStyles }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>To Date</Form.Label>
        <Form.Control
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          style={darkMode ? { ...darkModeStyles, backgroundColor: '#444' } : { ...lightModeStyles }}
        />
      </Form.Group>

      {/* Type Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Filter by Type</Form.Label>
        <Form.Control
          type="text"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="e.g., news, blog"
          style={darkMode ? { ...darkModeStyles, backgroundColor: '#444' } : { ...lightModeStyles }}
        />
      </Form.Group>

      {/* Apply Filters Button */}
      <Button variant="primary" onClick={applyFilters} className="w-100">
        Apply Filters
      </Button>
    </div>
  );
};

export default SidebarFilter;
