import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './TransferReceipts.css';

const TransferReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'generated_at', direction: 'desc' });

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      console.log('Fetching from:', API_ENDPOINTS.PDF_LOGS);
      const response = await fetch(API_ENDPOINTS.PDF_LOGS, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw response:', data);
      
      if (data.status === 'success' && Array.isArray(data.logs)) {
        console.log('Processed receipts:', data.logs);
        setReceipts(data.logs);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching receipts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewPdf = (viewUrl) => {
    console.log('Opening PDF:', viewUrl);
    window.open(viewUrl, '_blank');
  };

  const downloadPdf = (downloadUrl, filename) => {
    console.log('Downloading PDF:', downloadUrl);
    window.open(downloadUrl, '_blank');
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedReceipts = React.useMemo(() => {
    const sorted = [...receipts];
    sorted.sort((a, b) => {
      if (sortConfig.key === 'generated_at') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.generated_at) - new Date(b.generated_at)
          : new Date(b.generated_at) - new Date(a.generated_at);
      }
      if (sortConfig.key === 'file_size') {
        return sortConfig.direction === 'asc' 
          ? a.file_size - b.file_size
          : b.file_size - a.file_size;
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });
    return sorted;
  }, [receipts, sortConfig]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading receipts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading receipts</h3>
        <p>{error}</p>
        <button onClick={fetchReceipts} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="transfer-receipts-container">
      <div className="receipts-header">
        <h2>Transfer Receipts</h2>
        <div className="header-actions">
          <span>Total Receipts: {receipts.length}</span>
          <button onClick={fetchReceipts} className="refresh-btn">
            <i className="fas fa-sync"></i> Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="receipts-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('filename')}>
                Filename {sortConfig.key === 'filename' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('generated_at')}>
                Generated Date {sortConfig.key === 'generated_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('file_size')}>
                Size {sortConfig.key === 'file_size' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReceipts.map((receipt) => (
              <tr key={receipt.filename}>
                <td className="filename-cell">{receipt.filename}</td>
                <td>{new Date(receipt.generated_at).toLocaleString()}</td>
                <td>{receipt.file_size ? `${(receipt.file_size / 1024).toFixed(2)} KB` : 'N/A'}</td>
                <td className="actions-cell">
                  <button 
                    onClick={() => viewPdf(receipt.view_url)}
                    className="view-btn"
                    title="View PDF"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    onClick={() => downloadPdf(receipt.download_url, receipt.filename)}
                    className="download-btn"
                    title="Download PDF"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransferReceipts; 