import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course, isEnrolled, enrollment, onEnroll, onUnenroll, isLoading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'badge-success';
      case 'intermediate':
        return 'badge-warning';
      case 'advanced':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'programming':
        return '💻';
      case 'data science':
        return '📊';
      case 'business':
        return '💼';
      case 'security':
        return '🔒';
      case 'design':
        return '🎨';
      default:
        return '📚';
    }
  };

  return (
    <div className="course-card card">
      <div className="course-header">
        <div className="course-icon">
          {getCategoryIcon(course.category)}
        </div>
        <div className="course-badges">
          <span className={`badge ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
          <span className="badge badge-primary">
            {course.category}
          </span>
        </div>
      </div>

      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        
        <div className="course-meta">
          <div className="meta-item">
            <span className="meta-label">👨‍🏫 Instructor:</span>
            <span className="meta-value">{course.instructor}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">⏱️ Duration:</span>
            <span className="meta-value">{course.duration}</span>
          </div>
          {isEnrolled && enrollment && (
            <div className="meta-item">
              <span className="meta-label">📅 Enrolled:</span>
              <span className="meta-value">{formatDate(enrollment.enrollmentDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="course-actions">
        {isEnrolled ? (
          <div className="enrollment-status">
            <div className="status-indicator enrolled">
              <span className="status-icon">✅</span>
              <span className="status-text">Enrolled</span>
            </div>
            <button
              className="btn btn-danger"
              onClick={onUnenroll}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading"></span>
              ) : (
                'Unenroll'
              )}
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={onEnroll}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading"></span>
            ) : (
              'Enroll'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard; 