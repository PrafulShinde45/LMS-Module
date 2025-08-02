import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-text">
          <h4>Error</h4>
          <p>{message}</p>
        </div>
        <button className="error-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage; 