const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// GET /api/enrollments/me - Get current student's enrollments
router.get('/me', async (req, res) => {
  try {
    // Using dummy student ID as specified in requirements
    const studentId = 'dummyStudent123';
    
    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId', 'title description instructor duration category level')
      .sort({ enrollmentDate: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enrollments',
      message: error.message
    });
  }
});

// POST /api/enrollments - Create a new enrollment
router.post('/', async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = 'dummyStudent123'; // Using dummy student ID

    // Validate courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        error: 'Course ID is required'
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      courseId,
      studentId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        error: 'Already enrolled in this course'
      });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      courseId,
      studentId,
      enrollmentDate: new Date()
    });

    await enrollment.save();

    // Populate course details for response
    await enrollment.populate('courseId', 'title description instructor duration');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment
    });

  } catch (error) {
    console.error('Error creating enrollment:', error);
    
    // Handle duplicate key error (already enrolled)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Already enrolled in this course'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create enrollment',
      message: error.message
    });
  }
});

// DELETE /api/enrollments/:courseId - Unenroll from a course
router.delete('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = 'dummyStudent123';

    const enrollment = await Enrollment.findOneAndDelete({
      courseId,
      studentId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });

  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete enrollment',
      message: error.message
    });
  }
});

module.exports = router; 