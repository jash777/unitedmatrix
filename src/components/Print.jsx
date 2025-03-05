import React, { useEffect, useState } from 'react';
import { useTransaction } from '../context/transactionContext';
import { useNavigate } from 'react-router-dom';
import './Print.css';

const Print = () => {
  const transactionData = useTransaction();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (!transactionData) {
      navigate('/');
    }
  }, [transactionData, navigate]);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `transaction-${transactionData.referencecode || 'receipt'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="print-page">
      <div className="print-container">
        <div className="print-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          
          <h2>Transaction Completed Successfully</h2>
          
          <div className="transaction-details">
            <div className="detail-row">
              <span className="label">Reference Code</span>
              <span className="value">{transactionData?.referencecode || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Amount</span>
              <span className="value">
                {transactionData?.currency || ''} {transactionData?.amount || 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Date</span>
              <span className="value">
                {new Date(transactionData?.transactionDate).toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Status</span>
              <span className="value status-success">Completed</span>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleDownload}
              className="download-btn"
              disabled={isLoading}
            >
              <i className="fas fa-download"></i>
              Download Receipt
            </button>
            <button 
              onClick={() => navigate('/')}
              className="new-transaction-btn"
            >
              <i className="fas fa-plus"></i>
              New Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Print; 