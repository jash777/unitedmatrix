import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bank-footer">
      <div className="bank-footer-container">
        <div className="bank-footer-content">
          <div className="bank-footer-system-info">
            <h3>System Information</h3>
            <div className="system-info">
              <div className="info-item">
                <span className="info-label">Version:</span>
                <span className="info-value">3.5.2</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">June 15, 2023</span>
              </div>
              <div className="info-item">
                <span className="info-label">SWIFT Network:</span>
                <span className="info-value">
                  <span className="status-dot online"></span> Connected
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Maintenance:</span>
                <span className="info-value">Scheduled July 2, 2023</span>
              </div>
            </div>
          </div>
          
          <div className="bank-footer-legal">
            <p>&copy; {currentYear} UnitedMatrix Bank. All rights reserved.</p>
            <div className="legal-links">
              <a href="#terms">Terms</a>
              <a href="#privacy">Privacy</a>
              <a href="#security">Security</a>
            </div>
          </div>
        </div>
        
        <div className="bank-footer-compliance">
          <p>This system is for authorized users only. All activities are monitored and recorded.</p>
          <p>Compliant with ISO 27001, PCI DSS, and SWIFT CSP standards.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 