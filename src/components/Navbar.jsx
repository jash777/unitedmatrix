import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComingSoon from './ComingSoon';
import './Navbar.css';

const Navbar = ({ userName = "John Smith", userRole = "Senior Transfer Officer", onLogout }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTransferType, setActiveTransferType] = useState('mt103');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedTransferType, setSelectedTransferType] = useState('');
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.bank-user-profile')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  // Format time
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  // Handle logout click
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleTransferTypeClick = (type) => {
    if (type === 'mt103') {
      setActiveTransferType(type);
      navigate('/mt103');
    } else {
      setSelectedTransferType(type.toUpperCase());
      setShowComingSoon(true);
    }
  };
  
  const handleCloseComingSoon = () => {
    setShowComingSoon(false);
    setActiveTransferType('mt103');
    navigate('/mt103');
  };
  
  return (
    <>
      <header className="bank-header">
        <nav className="bank-navbar-nav">
          <div className="bank-nav-container">
            <div className="bank-nav-logo">
              <a href="/dashboard">
                <img 
                  src="src\assets\unitedlogo.png" 
                  alt="United Bank Logo"
                  loading="eager"
                />
                <span></span>
              </a>
            </div>
            
            <button 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              style={{
                display: 'none',
                '@media (max-width: 768px)': {
                  display: 'block'
                }
              }}
            >
              <span className="menu-icon"></span>
            </button>
            
            <ul className={`bank-nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              <li className="bank-nav-item">
                <a href="/dashboard">Dashboard</a>
              </li>
              <li className="bank-nav-item">
                <a href="/dashboard">Transfer</a>
              </li>
              <li className="bank-nav-item">
                <a href="/print">Print Receipt</a>
              </li>
            </ul>
            
            <div className="bank-nav-actions">
              <div className="bank-status-indicators">
                <div className="bank-status-indicator">
                  <span className="status-dot online"></span>
                  <span className="status-text">SWIFT: Online</span>
                </div>
                <div className="bank-status-indicator">
                  <span className="status-dot active"></span>
                  <span className="status-text">System: OK</span>
                </div>
              </div>
              
              <div className="bank-time-display">{formattedTime}</div>
              
              <div className="bank-user-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="bank-user-avatar">
                  {userName.split(' ').map(name => name[0]).join('')}
                </div>
                
                {isDropdownOpen && (
                  <div className="bank-user-dropdown">
                    <div className="user-info-header">
                      <div className="user-name">{userName}</div>
                      <div className="user-role">{userRole}</div>
                    </div>
                    <ul>
                      <li><a href="#profile">My Profile</a></li>
                      <li><a href="#settings">Settings</a></li>
                      <li><a href="#help">Help Center</a></li>
                      <li className="dropdown-divider"></li>
                      <li><a href="#logout" className="logout-link" onClick={handleLogoutClick}>Sign Out</a></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Transfer Types Navigation */}
        <div className="transfer-types-nav">
          <div className="transfer-types-container">
            <button 
              className={`transfer-type-btn ${activeTransferType === 'mt103' ? 'active' : ''}`}
              onClick={() => handleTransferTypeClick('mt103')}
            >
              <span className="transfer-icon">🔄</span>
              MT103
            </button>

            <button 
              className={`transfer-type-btn ${activeTransferType === 'mt199' ? 'active' : ''}`}
              onClick={() => handleTransferTypeClick('mt199')}
            >
              <span className="transfer-icon">📨</span>
              MT199
            </button>

            <button 
              className={`transfer-type-btn ${activeTransferType === 'mt103gpi' ? 'active' : ''}`}
              onClick={() => handleTransferTypeClick('mt103gpi')}
            >
              <span className="transfer-icon">🌐</span>
              MT103 GPI
            </button>

            <button 
              className={`transfer-type-btn ${activeTransferType === 'ledger' ? 'active' : ''}`}
              onClick={() => handleTransferTypeClick('ledger')}
            >
              <span className="transfer-icon">📒</span>
              Ledger to Ledger
            </button>

            <button 
              className={`transfer-type-btn ${activeTransferType === 'dropbox' ? 'active' : ''}`}
              onClick={() => handleTransferTypeClick('dropbox')}
            >
              <span className="transfer-icon">📦</span>
              DropBox
            </button>

            <button 
              className={`transfer-type-btn ${activeTransferType === 'mt103202' ? 'active' : ''}`}
              onClick={() => handleTransferTypeClick('mt103202')}
            >
              <span className="transfer-icon">💱</span>
              MT103/202
            </button>
          </div>
        </div>
      </header>

      {/* Coming Soon Popup */}
      {showComingSoon && (
        <ComingSoon 
          transferType={selectedTransferType}
          onClose={handleCloseComingSoon}
        />
      )}
    </>
  );
};

export default Navbar;