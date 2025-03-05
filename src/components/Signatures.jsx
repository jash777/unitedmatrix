import React, { useState, useRef, useEffect } from 'react';
import { useTransaction } from '../context/transactionContext';
import './Signatures.css';

const Signatures = () => {
  const transactionData = useTransaction();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [signatures, setSignatures] = useState({
    sender: null,
    receiver: null,
    bankOfficer: null,
    bankManager: null
  });
  const [stamps, setStamps] = useState({
    bankOfficer: null,
    bankManager: null
  });
  const [positions, setPositions] = useState({
    sender: { x: 0, y: 0 },
    receiver: { x: 0, y: 0 },
    bankOfficer: { x: 0, y: 0 },
    bankManager: { x: 0, y: 0 }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdfUrl, setProcessedPdfUrl] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const fileInputRef = useRef(null);

  // Handle PDF upload
  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file);

    if (file) {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          console.log('PDF loaded successfully');
          const pdfDataUrl = e.target.result;
          console.log('PDF data URL length:', pdfDataUrl.length);
          
          setPdfFile(file);
          setPdfPreview(pdfDataUrl);
          
          // Reset positions when new PDF is uploaded
          setPositions({});
        };

        reader.onerror = (error) => {
          console.error('Error reading PDF:', error);
          alert('Error reading PDF file');
        };

        reader.readAsDataURL(file);
      } else {
        console.error('Invalid file type:', file.type);
        alert('Please upload a valid PDF file');
      }
    } else {
      console.error('No file selected');
      alert('Please select a PDF file');
    }
  };

  // Handle signature and stamp uploads
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type.includes('stamp')) {
          setStamps(prev => ({
            ...prev,
            [type.replace('Stamp', '')]: reader.result
          }));
        } else {
          setSignatures(prev => ({
            ...prev,
            [type]: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e, element) => {
    e.preventDefault();
    setIsDragging(true);
    setSelectedElement(element);
    
    const elementRect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.parentElement.getBoundingClientRect();
    
    setPositions(prev => ({
      ...prev,
      [element]: {
        x: elementRect.left - containerRect.left,
        y: elementRect.top - containerRect.top
      }
    }));
  };

  const handleDrag = (e) => {
    if (isDragging && selectedElement) {
      e.preventDefault();
      
      const container = e.currentTarget;
      const containerRect = container.getBoundingClientRect();
      
      const newX = e.clientX - containerRect.left;
      const newY = e.clientY - containerRect.top;
      
      setPositions(prev => ({
        ...prev,
        [selectedElement]: {
          x: newX,
          y: newY
        }
      }));
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setSelectedElement(null);
  };

  const handleProcessPDF = async () => {
    if (!pdfFile) {
      alert('Please upload a PDF file first');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('signatures', JSON.stringify(signatures));
      formData.append('stamps', JSON.stringify(stamps));
      formData.append('positions', JSON.stringify(positions));

      const response = await fetch('http://127.0.0.1:5005/api/process-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedPdfUrl) {
      const link = document.createElement('a');
      link.href = processedPdfUrl;
      link.download = `signed-transaction-${transactionData?.referencecode || 'receipt'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleScroll = (direction) => {
    console.log('Scroll button clicked:', direction);
    
    const pdfFrame = document.querySelector('.pdf-frame');
    const embed = document.querySelector('.pdf-iframe');
    
    console.log('PDF Frame found:', !!pdfFrame);
    console.log('Embed found:', !!embed);
    
    if (pdfFrame && embed) {
      const scrollAmount = 100;
      const currentScroll = pdfFrame.scrollTop;
      const maxScroll = pdfFrame.scrollHeight - pdfFrame.clientHeight;
      
      console.log('Current scroll position:', currentScroll);
      console.log('Max scroll:', maxScroll);
      
      let newScroll;
      if (direction === 'up') {
        newScroll = Math.max(0, currentScroll - scrollAmount);
      } else {
        newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
      }
      
      console.log('New scroll position:', newScroll);
      
      // Use scrollTo with smooth behavior
      pdfFrame.scrollTo({
        top: newScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    console.log('PDF Preview state changed:', {
      hasPdfFile: !!pdfFile,
      hasPdfPreview: !!pdfPreview,
      previewType: pdfPreview ? typeof pdfPreview : 'null'
    });
  }, [pdfPreview, pdfFile]);

  return (
    <div className="signatures-page">
      <div className="signatures-container">
        <h2>Add Signatures and Process PDF</h2>
        
        <div className="signatures-grid">
          <div className="signatures-panel">
            <h3>Upload PDF</h3>
            <div className="upload-section">
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handlePdfUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="pdf-upload" className="upload-btn">
                <i className="fas fa-upload"></i> Choose PDF File
              </label>
              {pdfFile && (
                <p className="file-info">
                  Selected file: {pdfFile.name}
                  <button 
                    className="remove-file"
                    onClick={() => {
                      setPdfFile(null);
                      setPdfPreview(null);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </p>
              )}
            </div>

            <h3>Upload Signatures</h3>
            <div className="upload-section">
              <div className="upload-item">
                <label>Sender Signature</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'sender')}
                />
              </div>
              <div className="upload-item">
                <label>Receiver Signature</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'receiver')}
                />
              </div>
              <div className="upload-item">
                <label>Bank Officer Signature</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bankOfficer')}
                />
              </div>
              <div className="upload-item">
                <label>Bank Manager Signature</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bankManager')}
                />
              </div>
            </div>

            <h3>Upload Stamps</h3>
            <div className="upload-section">
              <div className="upload-item">
                <label>Bank Officer Stamp</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bankOfficerStamp')}
                />
              </div>
              <div className="upload-item">
                <label>Bank Manager Stamp</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bankManagerStamp')}
                />
              </div>
            </div>
          </div>

          <div className="preview-panel">
            <div className="preview-header">
              <h3>PDF Preview</h3>
              {pdfFile && (
                <div className="preview-controls">
                  <button 
                    className="process-btn"
                    onClick={handleProcessPDF}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cog"></i>
                        Process PDF
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="pdf-preview-container">
              {pdfPreview ? (
                <div className="pdf-viewer">
                  <div className="pdf-frame">
                    <embed
                      src={pdfPreview}
                      type="application/pdf"
                      className="pdf-iframe"
                    />
                  </div>
                  <div className="scroll-controls">
                    <button 
                      className="scroll-btn scroll-up"
                      onClick={() => handleScroll('up')}
                      aria-label="Scroll up"
                    >
                      <i className="fas fa-chevron-up"></i>
                    </button>
                    <button 
                      className="scroll-btn scroll-down"
                      onClick={() => handleScroll('down')}
                      aria-label="Scroll down"
                    >
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </div>
                  <div className="signatures-layer">
                    {Object.entries(signatures).map(([key, value]) => (
                      value && (
                        <div
                          key={key}
                          className={`signature-element ${isDragging && selectedElement === key ? 'dragging' : ''}`}
                          style={{
                            left: `${positions[key].x}px`,
                            top: `${positions[key].y}px`,
                            cursor: 'move',
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            zIndex: isDragging && selectedElement === key ? 1000 : 10
                          }}
                          draggable="false"
                          onMouseDown={(e) => handleDragStart(e, key)}
                        >
                          <img src={value} alt={`${key} signature`} />
                        </div>
                      )
                    ))}
                    
                    {Object.entries(stamps).map(([key, value]) => (
                      value && (
                        <div
                          key={key}
                          className={`stamp-element ${isDragging && selectedElement === key ? 'dragging' : ''}`}
                          style={{
                            left: `${positions[key].x}px`,
                            top: `${positions[key].y}px`,
                            cursor: 'move',
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            zIndex: isDragging && selectedElement === key ? 1000 : 10
                          }}
                          draggable="false"
                          onMouseDown={(e) => handleDragStart(e, key)}
                        >
                          <img src={value} alt={`${key} stamp`} />
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ) : (
                <div className="preview-placeholder">
                  <i className="fas fa-file-pdf"></i>
                  <p>Upload a PDF file to preview</p>
                </div>
              )}
            </div>

            {processedPdfUrl && (
              <div className="preview-actions">
                <button 
                  className="download-btn"
                  onClick={handleDownload}
                >
                  <i className="fas fa-download"></i>
                  Download Processed PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signatures; 