import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BankingMenu.css';

const BankingMenu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  const menuCategories = {
    swift: {
      title: 'SWIFT Messages',
      icon: '🔄',
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
        { id: 'mt999', name: 'MT999', route: '/mt999' },
      ]
    },
    transfers: {
      title: 'Transfer Systems',
      icon: '💱',
      items: [
        { id: 'ledger', name: 'Ledger to Ledger', route: '/ledger' },
        { id: 'server', name: 'Server to Server', route: '/server' },
        { id: 'dropbox', name: 'Dropbox Uploader', route: '/dropbox' },
      ]
    },
    monitoring: {
      title: 'Monitoring & Tracking',
      icon: '📊',
      items: [
        { id: 'tracing', name: 'Advanced Tracing System', route: '/tracing' },
        { id: 'tracking', name: 'Global Transaction Tracking', route: '/tracking' },
        { id: 'blackscreen', name: 'Blackscreen Monitor', route: '/blackscreen' },
        { id: 'interbank', name: 'Interbank Screen', route: '/interbank' },
      ]
    }
  };

  const handleMenuClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleItemClick = (route) => {
    navigate(route);
  };

  return (
    <div className="banking-menu">
      <div className="menu-categories">
        {Object.entries(menuCategories).map(([key, category]) => (
          <div key={key} className="menu-category">
            <div 
              className={`category-header ${activeCategory === key ? 'active' : ''}`}
              onClick={() => handleMenuClick(key)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-title">{category.title}</span>
              <span className="category-arrow">▼</span>
            </div>
            <div className={`category-items ${activeCategory === key ? 'expanded' : ''}`}>
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="menu-item"
                  onClick={() => handleItemClick(item.route)}
                >
                  <span className="item-name">{item.name}</span>
                  <span className="item-arrow">→</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankingMenu; 