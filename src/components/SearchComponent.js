import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const SearchComponent = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [result, setResult] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const courseOptions = [
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

useEffect(() => {
  // Fetch courses data from the server when form is submitted
  if (formSubmitted && selectedCourse) {
    fetch(`http://localhost:5000/api/details/${selectedCourse}`)
      .then((response) => response.json())
      .then((data) => {
        // Check if the response contains a message
        if (data.message) {
          setMessage(data.message);
          setResult([]); // Reset result array
        } else {
          setMessage(""); // Reset message
          setResult(data);
        }
      })
      .catch((error) => console.log(error));
  }
}, [selectedCourse, formSubmitted]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourse) {
      setFormSubmitted(true);
    } else {
      alert("Please select a course before submitting.");
    }
  };

  const handleChangeCourse = (e) => {
    setSelectedCourse(e.target.value);
    setFormSubmitted(false); // Reset formSubmitted when the input value changes
  };

  return (
    <><div><Navbar></Navbar></div>
    <div style={{ margin:'20px'}}>
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: 'bold' }}>
          Select Course:
          <select
            value={selectedCourse}
            onChange={handleChangeCourse}
            style={{ fontWeight: 'bold', marginLeft: '10px', marginRight: '10px' }}
          >
            <option value="" disabled>
              Select Course
            </option>
            {courseOptions.map((course, index) => (
              <option key={index} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" style={{ fontWeight: 'bold', backgroundColor: "white", borderRadius: "4px" }}>Submit</button>
      </form>

      {message && (
        <div style={{ marginTop: '10px', textAlign: "center", fontWeight: "Bold" }}>
          <h3>{"!" + message}</h3>
        </div>
      )}

      {formSubmitted && result.length > 0 && (
        <div className="w-100 vh-100 d-flex justify-content-center" style={{ marginTop: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>Details of Teachers Teaching Course: {selectedCourse}</h3>
          <div className="w-50">
            <table style={{ border: "2px solid black" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Faculty Id
                  </th>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Course Name
                  </th>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    How Many Times
                  </th>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Course Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.map((course, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid black", padding: "4px" }}>
                      {course.fId}
                    </td>
                    <td style={{ border: "1px solid black", padding: "4px" }}>
                      {course.courseName}
                    </td>
                    <td style={{ border: "1px solid black", padding: "4px" }}>
                      {course.howManyTimes}
                    </td>
                    <td style={{ border: "1px solid black", padding: "4px" }}>
                      {course.courseCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div></>
  );
};

export default SearchComponent;
