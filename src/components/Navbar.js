// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <Link to="/">
          <img
            src="data:image/png;base64,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"
            alt="Logo"
            className="navbar-logo"/>
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/add">Add Courses</Link>
          <Link to="/display">Display Courses</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
