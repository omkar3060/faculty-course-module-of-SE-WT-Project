// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddCourseForm from './components/AddCourseForm';
import DisplayCourses from './components/DisplayCourses';
import WelcomePage from './components/WelcomePage';
import Navbar from './components/Navbar';
import SearchComponent from './components/SearchComponent';
import './App.css'; // Import the CSS file
import Login from './components/Login';

const App = () => {
  const [courses, setCourses] = useState([]);

  const handleAddCourse = (newCourse) => {
    setCourses([...courses, newCourse]);
  };

  return (
    <Router>
      <div className="container">

        <div className="content">
          <Routes>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/add" element={<AddCourseForm onAddCourse={handleAddCourse} />} />
            <Route path="/display" element={<DisplayCourses courses={courses} />} />
            <Route path="/search" element={<SearchComponent />} />
            <Route path='/' element={<Login></Login>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
