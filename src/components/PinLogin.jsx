import React, { useState, useRef, useEffect } from 'react';
import './PinLogin.css';

const PinLogin = ({ onLogin }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  
  // Use import.meta.env instead of process.env for Vite
  const CORRECT_PIN = import.meta.env.VITE_CORRECT_PIN;
  
  useEffect(() => {
    // Log to verify environment variable is loaded (remove in production)
    console.log('PIN Environment Check:', !!import.meta.env.VITE_CORRECT_PIN);
    
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
  const handlePinChange = (index, value) => {
    if (value && !/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    if (error) setError('');
    
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
    
    if (newPin.every(digit => digit !== '') && index === 5) {
      validatePin(newPin.join(''));
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const validatePin = (enteredPin) => {
    // Add fallback PIN for development (remove in production)
    const validPin = CORRECT_PIN || '123456';
    
    console.log('Validating PIN:', { enteredPin, validPin }); // Debug log
    
    if (enteredPin === validPin) {
      console.log('PIN validated successfully'); // Debug log
      onLogin();
    } else {
      console.log('Invalid PIN'); // Debug log
      setError('Invalid PIN. Please try again.');
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    }
  };
  
  const handleSubmit = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length === 6) {
      validatePin(enteredPin);
    }
  };
  
  return (
    <div className="pin-login-container">
      <div className="pin-login-box">
        <div className="bank-branding">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/SWIFT_2021_logo.svg/2051px-SWIFT_2021_logo.svg.png" 
            alt="Bank Logo" 
            className="bank-logo"
          />
        </div>

        <div className="pin-login-header">
          <h2>Secure Login</h2>
          <p>Enter your 6-digit PIN to access the system</p>
        </div>
        
        <div className="pin-input-group">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="password"
              maxLength="1"
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="pin-input"
              aria-label={`PIN digit ${index + 1}`}
            />
          ))}
        </div>
        
        {error && <div className="pin-error-message">{error}</div>}
        
        <button 
          className="pin-submit-button"
          onClick={handleSubmit}
          disabled={pin.some(digit => digit === '')}
        >
          Login
        </button>

        <div className="security-indicators">
          <div className="security-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Secure Access</span>
          </div>
          <div className="security-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Encrypted</span>
          </div>
          <div className="security-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinLogin; 