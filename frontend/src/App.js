import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import CourseCard from './components/CourseCard';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState({});

  // API Base URL - Use relative URL in production for same-domain requests
  const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

  // Fetch all courses
  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data.data || []);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
    }
  }, [API_BASE_URL]);

  // Fetch user enrollments
  const fetchEnrollments = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments/me`);
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }
      const data = await response.json();
      setEnrollments(data.data || []);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  }, [API_BASE_URL]);

  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    setEnrolling(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enroll in course');
      }

      const data = await response.json();
      
      // Add new enrollment to state
      setEnrollments(prev => [...prev, data.data]);
      
      // Show success message (you could add a toast notification here)
      console.log('Successfully enrolled in course:', data.message);
      
    } catch (err) {
      setError(err.message);
      console.error('Error enrolling in course:', err);
    } finally {
      setEnrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Unenroll from a course
  const unenrollFromCourse = async (courseId) => {
    setEnrolling(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to unenroll from course');
      }

      // Remove enrollment from state
      setEnrollments(prev => prev.filter(enrollment => {
        // Handle both populated and unpopulated enrollment objects
        const enrollmentCourseId = enrollment.courseId._id || enrollment.courseId;
        return enrollmentCourseId !== courseId;
      }));
      
      console.log('Successfully unenrolled from course');
      
    } catch (err) {
      setError(err.message);
      console.error('Error unenrolling from course:', err);
    } finally {
      setEnrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Check if user is enrolled in a course
  const isEnrolled = (courseId) => {
    return enrollments.some(enrollment => {
      // Handle both populated and unpopulated enrollment objects
      const enrollmentCourseId = enrollment.courseId._id || enrollment.courseId;
      return enrollmentCourseId === courseId;
    });
  };

  // Get enrollment for a course
  const getEnrollment = (courseId) => {
    return enrollments.find(enrollment => {
      // Handle both populated and unpopulated enrollment objects
      const enrollmentCourseId = enrollment.courseId._id || enrollment.courseId;
      return enrollmentCourseId === courseId;
    });
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchCourses(), fetchEnrollments()]);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchCourses, fetchEnrollments]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
          
          <div className="courses-header">
            <h1>Available Courses</h1>
            <p>Discover and enroll in courses to expand your knowledge</p>
          </div>

          {courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No courses available</h3>
              <p>Check back later for new courses!</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={isEnrolled(course._id)}
                  enrollment={getEnrollment(course._id)}
                  onEnroll={() => enrollInCourse(course._id)}
                  onUnenroll={() => unenrollFromCourse(course._id)}
                  isLoading={enrolling[course._id]}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App; 