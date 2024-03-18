const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const dbURI = 'URI';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Check if the connection is successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Course schema
const courseSchema = new mongoose.Schema({
  fId :{
    type : Number,
    default : 13,},
  courseName: String,
  howManyTimes: Number,
  courseCode: String,
  
});

// Create the Course model
const Course = mongoose.model('courses', courseSchema);

// Route to add courses
app.post('/api/addCourse', async (req, res) => {
  try {
    const courses = req.body;


    // Validate input (you can add more validation as needed)
    if (courses.every(course => course.courseName && course.howManyTimes && course.courseCode)) {
      // Save courses to MongoDB
      const duplicateCourses = await Course.find({
        fId : 13,
        courseName: { $in: courses.map(course => course.courseName) },
      });

      console.log(duplicateCourses)

      if (duplicateCourses.length > 0) {
        res.json({ success: false, message: 'Duplicate course selections are not allowed.' });
      } else {
        // Save non-duplicate courses to MongoDB
        const savedCourses = await Course.create(courses);
        res.json({ success: true, data: savedCourses });
      }
    }
    else {
      res.json({ success: false, message: 'Please fill in all fields.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'An unexpected error occurred.' });
  }
});


app.put('/api/updateCourse/:id/:code', async (req, res) => {
  const { id, code } = req.params;
  const { uname, uhmt, ucode } = req.body;
  console.log(uname, uhmt, ucode);

  try {
    // Check if the updated course code already exists
    const existingCourse = await Course.findOne({ courseCode: ucode });
    if (existingCourse && existingCourse.fId !== id) {
      return res.json({
        success: false,
        message: 'Course code already exists. Please choose a different code.',
      });
    }

    // Find and update the course based on id and courseCode
    const updatedCourse = await Course.findOneAndUpdate(
      { fId: id, courseCode: code },
      { courseName: uname, howManyTimes: uhmt, courseCode: ucode },
      { new: true }
    );

    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.json({ success: false, message: 'An unexpected error occurred.' });
  }
});


app.post('/api/deleteCourse/:id/:code', async (req, res) => {
  const id = parseInt(req.params.id);
  const code = req.params.code;

  // Find the index of the course in the array
  try {
    // Use async/await to make the code more readable
    const result = await Course.deleteOne({ fId: id, courseCode: code });

    // Check the result
    if (result.deletedCount > 0) {
      res.json({ success: true, data: "deleted" });
    } else {
      res.status(404).json({ success: false, message: 'Course not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
 
});

app.get('/api/getCourses', async (req, res) => {
  const userFId= 13;
  Course.find({ fId: userFId })
  .then(courses => res.json(courses))
  .catch(err => res.json(err))
});

app.get('/api/details/:fId', (req, res) => {
  const userfId  = req.params.fId;

  // Check if fId exists in mock data
  Course.find({ courseName: userfId })
  .then(courses => res.json(courses))
  .catch(err => res.json(err))
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});