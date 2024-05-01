const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('D:\\Web Development\\react\\faculty-course-app\\faculty-course-details-firebase-adminsdk-gnque-35486e57fa.json'); // Replace with your service account key JSON file

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firebase Firestore reference
const db = admin.firestore();
const coursesCollection = db.collection('courses');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const dbURI = 'mongodb+srv://kletech:kletech1234@kledatabase.t7xh5su.mongodb.net/mydb';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Check if the connection is successful
const dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
dbConnection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Course schema
const courseSchema = new mongoose.Schema({
  fId: {
    type: Number,
    default: 13
  },
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
        fId: 13,
        courseName: { $in: courses.map(course => course.courseName) },
      });


        // Save non-duplicate courses to MongoDB
        const savedCourses = await Course.create(courses);

        // Save courses to Firestore
        savedCourses.forEach(course => {
        const courseData = { ...course.toObject() };
        delete courseData._id; // Exclude the _id field
        coursesCollection.doc(course._id.toString()).set(courseData);
        });
        res.json({ success: true, data: savedCourses });
      
    } 
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'An unexpected error occurred.' });
  }
});

// Route to update a course
app.put('/api/updateCourse/:id/:code', async (req, res) => {
  const courseId = req.params.id;
  const courseCode = req.params.code;
  const { uname, uhmt, ucode } = req.body;

  try {
    // Find the course document in Firestore
    const courseDoc = await coursesCollection.where('courseCode', '==', courseCode).where('fId', '==', parseInt(courseId)).get();

    // Check if the course document exists
    if (courseDoc.empty) {
      return res.status(404).json({ success: false, message: 'Course not found in Firestore.' });
    }

    // Update the course data in Firestore
    const updatedCourse = await coursesCollection.doc(courseDoc.docs[0].id).update({
      courseName: uname,
      howManyTimes: uhmt,
      courseCode: ucode
    });

    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.json({ success: false, message: 'An unexpected error occurred.' });
  }
});

// Route to retrieve courses
app.get('/api/getCourses', async (req, res) => {
  try {
    const coursesSnapshot = await coursesCollection.get();
    const courses = [];

    coursesSnapshot.forEach(doc => {
      const course = doc.data();
      courses.push(course);
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses from Firestore:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Route to retrieve course details by fId
app.get('/api/details/:fId', async(req, res) => {
  try {
    const courseName = req.params.fId; // Get the course name from the query parameter

    let coursesSnapshot;
    if (courseName) {
      // Search for courses with the provided course name
      coursesSnapshot = await coursesCollection.where('courseName', '==', courseName).get();
    } else {
      // If no course name provided, retrieve all courses
      coursesSnapshot = await coursesCollection.get();
    }

    const courses = [];

    coursesSnapshot.forEach(doc => {
      const course = doc.data();
      courses.push(course);
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses from Firestore:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

app.post('/api/deleteCourse/:id/:code', async (req, res) => {
  const id = parseInt(req.params.id);
  const code = req.params.code;

  // Find the course document in Firestore
  try {
    const courseSnapshot = await coursesCollection.where('fId', '==', id).where('courseCode', '==', code).get();

    // Check if the course document exists
    if (courseSnapshot.empty) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    // Delete the course document
    await courseSnapshot.docs[0].ref.delete();

    res.json({ success: true, data: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});