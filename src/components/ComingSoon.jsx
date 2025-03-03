import React from 'react';
import './ComingSoon.css';

const ComingSoon = ({ transferType, onClose }) => {
  return (
    <div className="coming-soon-overlay">
      <div className="coming-soon-modal">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">🚀</div>
          <h2>Coming Soon!</h2>
          <p>{transferType} transfer feature is under development.</p>
          <div className="coming-soon-details">
            <p>We're working hard to bring you:</p>
            <ul>
              <li>Enhanced {transferType} capabilities</li>
              <li>Streamlined transfer process</li>
              <li>Advanced security features</li>
            </ul>
          </div>
          <button className="close-button" onClick={onClose}>
            Return to MT103
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 