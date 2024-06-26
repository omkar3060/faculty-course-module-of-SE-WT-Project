import React, { useState, useEffect } from 'react';
import './DisplayCourses.css'; // Import the CSS file
import Navbar from './Navbar';

const DisplayCourses = () => {
  const [courses, setCourses] = useState([]);
  const [keyval, setKeyVal] = useState(-1);
  const [uname, setUname] = useState('');
  const [uhmt, setUhmt] = useState(0);
  const [ucode, setUcode] = useState('');

  useEffect(() => {
    // Fetch courses data from the server
    fetch('http://localhost:5000/api/getCourses') // Use the appropriate endpoint you've set up on your server
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.log(error));
  }, []);

  const handleEdit = (index, course) => {
    setKeyVal(index);
    setUname(course.courseName);
    setUhmt(course.howManyTimes);
    setUcode(course.courseCode);
  };

  const handleUpdate = (id, code, uname, uhmt, ucode) => {
    const fkey = id + code;
    fetch(`http://localhost:5000/api/updateCourse/${id}/${code}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uname, uhmt, ucode }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Update successful:', data);
        alert('Refresh the page to see the changes');
      })
      .catch((error) => {
        console.error('Error updating course:', error);
      });

    setKeyVal(-1);
  };

  const handleDelete = (id, code) => {
    if (window.confirm(`Are you sure want to delete`)) {
      fetch(`http://localhost:5000/api/deleteCourse/${id}/${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, code }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Delete successful:', data);
          alert('Course deleted successfully');
          // Update the local state or fetch updated data from the server
        })
        .catch((error) => {
          console.error('Error deleting course:', error);
          alert('Error deleting course');
        });
    }
  };
  

  return (
    <>
      <div><Navbar></Navbar></div>
      <div className="display-courses-container">
        <div className="w-50">
          <div>
            <h2>YOUR COURSES</h2>
          </div>
          <table className="display-courses-table">
            <thead>
              <tr>
                <th>FACULTY ID</th>
                <th>COURSE NAME</th>
                <th>HOW MANY TIMES</th>
                <th>COURSE CODE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {courses &&
                courses.map((course, index) => (
                  index === keyval ? (
                    <tr key={index} className="edit-row">
                      <td>{course.fId}</td>
                      <td><input type="text" className="edit-row-input" value={uname} onChange={(e) => setUname(e.target.value)} /></td>
                      <td><input type="number" className="edit-row-input" value={uhmt} onChange={(e) => setUhmt(e.target.value)} /></td>
                      <td><input type="text" className="edit-row-input" value={ucode} onChange={(e) => setUcode(e.target.value)} /></td>
                      <td>
                        <button onClick={() => handleUpdate(course.fId, course.courseCode, uname, uhmt, ucode)} className="edit-row-button">Update</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>{course.fId}</td>
                      <td>{course.courseName}</td>
                      <td>{course.howManyTimes}</td>
                      <td>{course.courseCode}</td>
                      <td>
                        <button onClick={() => handleEdit(index, course)} className="edit-row-button">Edit</button>
                        <button onClick={() => handleDelete(course.fId, course.courseCode)} className="delete-row-button">Delete</button>
                      </td>
                    </tr>
                  )
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DisplayCourses;
