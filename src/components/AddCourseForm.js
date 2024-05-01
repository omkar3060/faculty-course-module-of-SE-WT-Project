// src/components/AddCourseForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar'
const AddCourseForm = ({ onAddCourse }) => {
  const [courses, setCourses] = useState([
    { courseName: "", howManyTimes: "", courseCode: "" },
    { courseName: "", howManyTimes: "", courseCode: "" },
    { courseName: "", howManyTimes: "", courseCode: "" },
  ]);
  const navigate = useNavigate();
  const [courseNames, setCourseNames] = useState([]);
  const [courseCodeMap, setCourseCodeMap] = useState({});

  useEffect(() => {
    // Fetch course names from your API or set them statically
    // For example, you can replace the following line with an API call
    const fetchedCourseData = [
      { name: "webtech", code: "1240" },
      { name: "system software", code: "1241" },
      { name: "soft engg", code: "1242" },
      { name: "statistics", code: "1243" },
      { name: "GTLA", code: "1244" },
      { name: "Basic mech engg", code: "1245" },
      { name: "Engg Chemistry", code: "1246" },
      { name: "Engg Mechanics", code: "1247" },
      { name: "Basic Electrical Engg", code: "1248" },
      { name: "Professional Communication", code: "1249" },
      { name: "Engg Physics", code: "1250" },
    ];

    const courseNames = fetchedCourseData.map((course) => course.name);
    const codeMap = fetchedCourseData.reduce((map, course) => {
      map[course.name] = course.code;
      return map;
    }, {});

    setCourseNames(courseNames);
    setCourseCodeMap(codeMap);
  }, []);

  const handleInputChange = (index, fieldName, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][fieldName] = value;
    if (fieldName === "courseName") {
      console.log("value:", value);
      const courseCode = courseCodeMap[value];
      updatedCourses[index]["courseCode"] = courseCode;
    }
    setCourses(updatedCourses);
  };

  const handleAddRow = () => {
    setCourses([
      ...courses,
      { courseName: "", howManyTimes: "", courseCode: "" },
    ]);
  };

  const handleAddCourse = async () => {
    const coursesToAdd = courses.filter(
      (course) =>
        course.courseName && course.howManyTimes !== "" && course.courseCode
    );
  
    if (coursesToAdd.length === 0) {
      alert("Please fill in at least one row.");
      return;
    }
  
    const uniqueCourses = new Set();
    const hasDuplicate = coursesToAdd.some((course) => {
      const courseKey = `${course.courseName}-${course.howManyTimes}`;
      if (uniqueCourses.has(courseKey)) {
        return true; // Found a duplicate
      }
      uniqueCourses.add(courseKey);
      return false;
    });
  
    if (hasDuplicate) {
      alert("Duplicate course selections are not allowed.");
      return;
    }
  
    // Check if "howManyTimes" is a valid number
    const validHowManyTimes = coursesToAdd.every(
      (course) => !isNaN(course.howManyTimes) && parseFloat(course.howManyTimes) >= 0
    );
  
    if (validHowManyTimes) {
      try {
        const response = await fetch("http://localhost:5000/api/addCourse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(coursesToAdd),
        });
  
        const data = await response.json();
        if (data.success) {
          // Optionally do something upon successful addition
          alert("Courses added successfully!");
          // Clear only the added rows
          setCourses([
            ...courses.map((course) => ({
              courseName: "",
              howManyTimes: "",
              courseCode: "",
            })),
          ]);
        } else {
          alert(`Failed to add courses. ${data.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
      }
    } else {
      alert("Please ensure 'How Many Times' is a valid number.");
    }
  };
  

  const handleDisplayCourses = () => {
    // Navigate to the DisplayCourses route
    navigate("/display");
  };

  const buttonStyles = {
    base: {
      backgroundColor: "white",
      color: "rgb(229, 49, 85)",
      fontWeight: "bold",
      fontFamily: "Poppins",
      border: "2px solid rgb(241, 84, 116)",
      display: "flex",
      padding: "10px 15px",
      margin: "20px 0",
      cursor: "pointer",
      borderRadius: "4px",
      transition: "background-color 0.3s, color 0.3s", // Added color transition
      boxShadow: "2px 2px 5px rgba(229, 49, 85)",
    },
    hover: {
      fontWeight: "bold",
      backgroundColor: "rgb(241, 84, 116)",
      color: "white",
      boxShadow: "2px 2px 2px rgba(229, 49, 85)",
    },
  };

  return (
    
    <>
    <div><Navbar></Navbar></div><div
      style={{
        background: "white",
        border: "2px solid rgb(241, 84, 116)",
        color: "rgb(229, 49, 85)",
        fontSize: "20px",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "12px",
        marginBottom: "20px", // Add some space at the bottom
        fontFamily: "Poppins",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "2px 2px 2px rgba(229, 49, 85)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Add Course</h2>
      <table style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>How Many Times?</th>
            <th>Course Code</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>
                <select
                  value={course.courseName}
                  onChange={(e) => handleInputChange(index, "courseName", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                    borderColor: "black",
                    borderWidth: "2px",
                    borderRadius: "5px",
                    backgroundColor: "linear-gradient(135deg, #fcfcfd, #fffaec)",
                  }}
                >
                  <option value="" disabled>
                    Select Course
                  </option>
                  {courseNames.map((name, optionIndex) => (
                    <option key={optionIndex} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={course.howManyTimes}
                  onChange={(e) => handleInputChange(index, "howManyTimes", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                    borderColor: "black",
                    borderRadius: "5px",
                    backgroundColor: "linear-gradient(135deg, #fcfcfd, #fffaec)",
                  }} />
              </td>
              <td>
                <input
                  type="text"
                  value={course.courseCode}
                  onChange={(e) => handleInputChange(index, "courseCode", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                    borderColor: "black",
                    borderRadius: "5px",
                    backgroundColor: "linear-gradient(135deg, #fcfcfd, #fffaec)",
                  }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleAddRow}
          style={buttonStyles.base}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = buttonStyles.hover.backgroundColor;
            e.target.style.color = buttonStyles.hover.color;
          } }
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = buttonStyles.base.backgroundColor;
            e.target.style.color = buttonStyles.base.color;
          } }
        >
          Add Row
        </button>
        <button
          onClick={handleAddCourse}
          style={buttonStyles.base}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = buttonStyles.hover.backgroundColor;
            e.target.style.color = buttonStyles.hover.color;
          } }
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = buttonStyles.base.backgroundColor;
            e.target.style.color = buttonStyles.base.color;
          } }
        >
          Save
        </button>
        <button
          onClick={handleDisplayCourses}
          style={buttonStyles.base}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = buttonStyles.hover.backgroundColor;
            e.target.style.color = buttonStyles.hover.color;
          } }
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = buttonStyles.base.backgroundColor;
            e.target.style.color = buttonStyles.base.color;
          } }
        >
          Display Courses
        </button>
      </div>
    </div></>
  );
};

export default AddCourseForm;
