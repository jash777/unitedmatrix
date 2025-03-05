import React, { useState } from 'react';
import './TraceTransaction.css';
import { API_ENDPOINTS } from '../config/api';

const TraceTransaction = () => {
  const [searchType, setSearchType] = useState('trn');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);

  const handleTrace = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setError('Please enter a valid search value');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactionData(null);

    const requestBody = {
      type: searchType,
      value: searchValue.trim()
    };

    try {
      const response = await fetch(API_ENDPOINTS.TRACE_TRANSACTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to trace transaction');
      }

      setTransactionData(data);
    } catch (err) {
      setError(err.message || 'An error occurred while tracing the transaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trace-page">
      <div className="trace-container">
        <h2>Trace Transaction</h2>

        <div className="trace-content">
          <div className="trace-panel">
            <div className="search-section">
              <form onSubmit={handleTrace} className="trace-form">
                <div className="form-group">
                  <label htmlFor="searchType">Search By</label>
                  <select
                    id="searchType"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="form-select"
                  >
                    <option value="trn">Transaction Reference Number (TRN)</option>
                    <option value="uetr">UETR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="searchValue">
                    {searchType === 'trn' ? 'Enter TRN' : 'Enter UETR'}
                  </label>
                  <div className="input-with-icon">
                    {/* <i className="fas fa-search"></i> */}
                    <input
                      type="text"
                      id="searchValue"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={searchType === 'trn' ? 'Enter TRN...' : 'Enter UETR...'}
                      className="form-input"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="trace-button"
                  disabled={isLoading || !searchValue.trim()}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Tracing Transaction...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search"></i>
                      Trace Transaction
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {transactionData && (
              <div className="transaction-details">
                <h3>
                  <i className="fas fa-info-circle"></i>
                  Transaction Details
                </h3>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Transaction Reference</span>
                    <span className="detail-value">{transactionData.referencecode}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">UETR</span>
                    <span className="detail-value">{transactionData.uetr}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`detail-value status-${transactionData.status.toLowerCase()}`}>
                      {transactionData.status}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value amount">
                      {transactionData.currency} {transactionData.amount}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Transaction Date</span>
                    <span className="detail-value">{transactionData.transactionDate}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Sender</span>
                    <span className="detail-value">{transactionData.senderAccountName}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Sender Bank</span>
                    <span className="detail-value">{transactionData.senderBankName}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Receiver</span>
                    <span className="detail-value">{transactionData.receiverName}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Receiver Bank</span>
                    <span className="detail-value">{transactionData.receiverBankName}</span>
                  </div>
                  
                  <div className="detail-item full-width">
                    <span className="detail-label">Description</span>
                    <span className="detail-value">{transactionData.description}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraceTransaction; 