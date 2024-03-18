// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddCourseForm from './components/AddCourseForm';
import DisplayCourses from './components/DisplayCourses';
import WelcomePage from './components/WelcomePage';
import Navbar from './components/Navbar';
import SearchComponent from './components/SearchComponent';
import './App.css'; // Import the CSS file

const App = () => {
  const [courses, setCourses] = useState([]);

  const handleAddCourse = (newCourse) => {
    setCourses([...courses, newCourse]);
  };

  return (
    <Router>
      <div className="container">
        <div className="header">
          <Navbar />
          <div className="separator" />
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/add" element={<AddCourseForm onAddCourse={handleAddCourse} />} />
            <Route path="/display" element={<DisplayCourses courses={courses} />} />
            <Route path="/search" element={<SearchComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
