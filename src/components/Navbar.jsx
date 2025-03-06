import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComingSoon from './ComingSoon';
import './Navbar.css';

const Navbar = ({ userName = "John Smith", userRole = "Senior Transfer Officer", onLogout }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedTransferType, setSelectedTransferType] = useState('');
  const [activeCategory, setActiveCategory] = useState('swift');

  const bankingCategories = {
    swift: {
      title: 'SWIFT Messages',
      items: [
        { id: 'mt103', name: 'MT103 Standard', route: '/mt103' },
        { id: 'mt103gpi', name: 'MT103 GPI', route: '/mt103gpi' },
        { id: 'mt103tt', name: 'MT103 TT', route: '/mt103tt' },
        { id: 'mt103eft', name: 'MT103 EFT', route: '/mt103eft' },
        { id: 'mt103202', name: 'MT103/202', route: '/mt103202' },
        { id: 'mt202cov', name: 'MT202 COV', route: '/mt202cov' },
        { id: 'mt760', name: 'MT760', route: '/mt760' },
        { id: 'mt110', name: 'MT110', route: '/mt110' },
        { id: 'mt700', name: 'MT700', route: '/mt700' },
        { id: 'mt199', name: 'MT199', route: '/mt199' },
        { id: 'mt799', name: 'MT799', route: '/mt799' },
        { id: 'mt999', name: 'MT999', route: '/mt999' }
      ]
    },
    transfers: {
      title: 'Transfer Systems',
      items: [
        { id: 'ledger', name: 'Ledger to Ledger', route: '/ledger' },
        { id: 'server', name: 'Server to Server', route: '/server' },
        { id: 'dropbox', name: 'Dropbox Uploader', route: '/dropbox' }
      ]
    },
    monitoring: {
      title: 'Monitoring & Tracking',
      items: [
        { id: 'tracing', name: 'Advanced Tracing System', route: '/tracing' },
        { id: 'tracking', name: 'Global Transaction Tracking', route: '/tracking' },
        { id: 'blackscreen', name: 'Blackscreen Monitor', route: '/ssh-connect' },
        { id: 'interbank', name: 'Interbank Screen', route: '/ssh-connect' }
      ]
    }
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Close dropdowns when clicking outside
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
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
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

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleItemClick = (route) => {
    if (route === '/mt103') {
      navigate(route);
    } else {
      setSelectedTransferType(route.substring(1).toUpperCase());
      setShowComingSoon(true);
    }
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
            >
              <span className="menu-icon"></span>
            </button>
            
            <ul className={`bank-nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              <li className="bank-nav-item">
                <a href="/dashboard">Dashboard</a>
              </li>
              <li className="bank-nav-item">
                <a href="/transfer-receipts">Transfer Receipts</a>
              </li>
              <li className="bank-nav-item">
                <a href="/print">Print Receipt</a>
              </li>
              <li className="bank-nav-item">
                <a href="/signatures">Signatures</a>
              </li>
              <li className="bank-nav-item">
                <a href="/trace">Trace Transaction</a>
              </li>
              <li className="bank-nav-item">
                <a href="/ssh-connect" style={{color: 'green'}}>InterBank</a>
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

        <div className="banking-subnav">
          <div className="banking-subnav-container">
            <div className="banking-categories">
              {Object.entries(bankingCategories).map(([key, category]) => (
                <div key={key} className="banking-category">
                  <button
                    className={`category-button ${activeCategory === key ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(key)}
                  >
                    {category.title}
                  </button>
                </div>
              ))}
            </div>
            <div className="transfer-types-container">
              {bankingCategories[activeCategory].items.map((item) => (
                <button
                  key={item.id}
                  className="transfer-type-btn"
                  onClick={() => handleItemClick(item.route)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {showComingSoon && (
        <ComingSoon 
          transferType={selectedTransferType}
          onClose={() => setShowComingSoon(false)}
        />
      )}
    </>
  );
};

export default Navbar;