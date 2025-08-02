const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  initializeSampleData();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  
  // Retry connection after 5 seconds
  setTimeout(() => {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('Connected to MongoDB on retry');
      initializeSampleData();
    }).catch((retryError) => {
      console.error('MongoDB connection failed on retry:', retryError);
    });
  }, 5000);
});

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LMS API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize sample data function
async function initializeSampleData() {
  const Course = require('./models/Course');
  const Enrollment = require('./models/Enrollment');
  
  try {
    // Check if courses already exist
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      const sampleCourses = [
        {
          title: 'Introduction to Web Development',
          description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
          instructor: 'Dr. Sarah Johnson',
          duration: '8 weeks',
          category: 'Programming',
          level: 'Beginner'
        },
        {
          title: 'Advanced React.js',
          description: 'Master React hooks, context API, and advanced state management techniques.',
          instructor: 'Prof. Michael Chen',
          duration: '10 weeks',
          category: 'Programming',
          level: 'Advanced'
        },
        {
          title: 'Data Science Fundamentals',
          description: 'Introduction to data analysis, statistics, and machine learning concepts.',
          instructor: 'Dr. Emily Rodriguez',
          duration: '12 weeks',
          category: 'Data Science',
          level: 'Intermediate'
        },
        {
          title: 'Digital Marketing Strategy',
          description: 'Learn modern digital marketing techniques including SEO, social media, and analytics.',
          instructor: 'Prof. David Kim',
          duration: '6 weeks',
          category: 'Business',
          level: 'Beginner'
        },
        {
          title: 'Mobile App Development',
          description: 'Build native and cross-platform mobile applications using React Native.',
          instructor: 'Dr. Lisa Wang',
          duration: '14 weeks',
          category: 'Programming',
          level: 'Intermediate'
        },
        {
          title: 'Cybersecurity Essentials',
          description: 'Understand security principles, threats, and protection strategies.',
          instructor: 'Prof. James Thompson',
          duration: '8 weeks',
          category: 'Security',
          level: 'Intermediate'
        }
      ];

      await Course.insertMany(sampleCourses);
      console.log('Sample courses initialized');
    }

    // Check if enrollments exist for dummy student
    const enrollmentCount = await Enrollment.countDocuments({ studentId: 'dummyStudent123' });
    if (enrollmentCount === 0) {
      // Enroll dummy student in first two courses
      const courses = await Course.find().limit(2);
      const enrollments = courses.map(course => ({
        courseId: course._id,
        studentId: 'dummyStudent123',
        enrollmentDate: new Date()
      }));

      await Enrollment.insertMany(enrollments);
      console.log('Sample enrollments initialized');
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 