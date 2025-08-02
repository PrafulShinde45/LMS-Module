import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon">🎓</div>
            <h1 className="brand-title">LMS</h1>
            <span className="brand-subtitle">Learning Management System</span>
          </div>
          
          <nav className="header-nav">
            <div className="nav-item">
              <span className="nav-label">Student:</span>
              <span className="nav-value">Demo Student</span>
            </div>
            <div className="nav-item">
              <span className="nav-label">ID:</span>
              <span className="nav-value">dummyStudent123</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 