import React, { useState, useRef, useEffect } from 'react';
import { useTransaction } from '../context/transactionContext';
import './Signatures.css';
import { Document, Page } from 'react-pdf';
import '../utils/pdfWorker'; // Import the worker configuration
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

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
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfError, setPdfError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef(null);

  // Function to handle successful PDF load
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Handle PDF preview with PDF.js
  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    setPdfError(null);
    setIsLoading(true);

    try {
      if (!file) {
        throw new Error('No file selected');
      }

      if (file.type !== 'application/pdf') {
        throw new Error('Please upload a valid PDF file');
      }

      // Create array buffer from file
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(blob);
      
      setPdfFile(file);
      setPdfPreview(fileUrl);
      setPageNumber(1);
      
    } catch (error) {
      console.error('PDF Upload Error:', error);
      setPdfError(error.message);
      setPdfFile(null);
      setPdfPreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Improved file upload handler for signatures and stamps
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

      const reader = new FileReader();
    reader.onload = () => {
      if (type.includes('Stamp')) {
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
  };

  const handleDragStart = (e, element) => {
    e.preventDefault();
    const elementRect = e.currentTarget.getBoundingClientRect();
    const containerRect = previewRef.current.getBoundingClientRect();

    setDragOffset({
      x: e.clientX - elementRect.left,
      y: e.clientY - elementRect.top
    });

    setIsDragging(true);
    setSelectedElement(element);
  };

  const handleDragMove = (e) => {
    if (!isDragging || !selectedElement || !previewRef.current) return;

    const containerRect = previewRef.current.getBoundingClientRect();
    const scrollTop = previewRef.current.scrollTop;
    
    // Calculate new position relative to container
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y + scrollTop;

    // Update positions with boundaries
    setPositions(prev => ({
      ...prev,
      [selectedElement]: {
        x: Math.max(0, Math.min(newX, containerRect.width)),
        y: Math.max(0, newY)
      }
    }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setSelectedElement(null);
  };

  // Add mouse move and up listeners
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        e.preventDefault();
        handleDragMove(e);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedElement]);

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

  // Zoom controls
  const handleZoom = (delta) => {
    setScale(prevScale => Math.max(0.5, Math.min(2.0, prevScale + delta)));
  };

  // Page navigation
  const changePage = (offset) => {
    setPageNumber(prevPageNumber => Math.max(1, Math.min(numPages, prevPageNumber + offset)));
  };

  useEffect(() => {
    console.log('PDF Preview state changed:', {
      hasPdfFile: !!pdfFile,
      hasPdfPreview: !!pdfPreview,
      previewType: pdfPreview ? typeof pdfPreview : 'null'
    });
  }, [pdfPreview, pdfFile]);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup object URL when component unmounts or when preview changes
      if (pdfPreview) {
        URL.revokeObjectURL(pdfPreview);
      }
    };
  }, [pdfPreview]);

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
            <div className="upload-section signatures-grid">
              <div className="upload-item">
                <label htmlFor="sender-signature" className="upload-label">
                  <span>Sender Signature</span>
                  <div className="upload-placeholder">
                    {signatures.sender ? (
                      <img src={signatures.sender} alt="Sender Signature" />
                    ) : (
                      <i className="fas fa-plus"></i>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="sender-signature"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'sender')}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="upload-item">
                <label htmlFor="receiver-signature" className="upload-label">
                  <span>Receiver Signature</span>
                  <div className="upload-placeholder">
                    {signatures.receiver ? (
                      <img src={signatures.receiver} alt="Receiver Signature" />
                    ) : (
                      <i className="fas fa-plus"></i>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="receiver-signature"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'receiver')}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="upload-item">
                <label htmlFor="bankOfficer-signature" className="upload-label">
                  <span>Bank Officer Signature</span>
                  <div className="upload-placeholder">
                    {signatures.bankOfficer ? (
                      <img src={signatures.bankOfficer} alt="Bank Officer Signature" />
                    ) : (
                      <i className="fas fa-plus"></i>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="bankOfficer-signature"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bankOfficer')}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="upload-item">
                <label htmlFor="bankManager-signature" className="upload-label">
                  <span>Bank Manager Signature</span>
                  <div className="upload-placeholder">
                    {signatures.bankManager ? (
                      <img src={signatures.bankManager} alt="Bank Manager Signature" />
                    ) : (
                      <i className="fas fa-plus"></i>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="bankManager-signature"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bankManager')}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <h3>Upload Stamps</h3>
            <div className="upload-section stamps-grid">
              <div className="upload-item">
                <label htmlFor="bankOfficer-stamp" className="upload-label">
                  <span>Bank Officer Stamp</span>
                  <div className="upload-placeholder">
                    {stamps.bankOfficer ? (
                      <img src={stamps.bankOfficer} alt="Bank Officer Stamp" />
                    ) : (
                      <i className="fas fa-plus"></i>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="bankOfficer-stamp"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bankOfficerStamp')}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="upload-item">
                <label htmlFor="bankManager-stamp" className="upload-label">
                  <span>Bank Manager Stamp</span>
                  <div className="upload-placeholder">
                    {stamps.bankManager ? (
                      <img src={stamps.bankManager} alt="Bank Manager Stamp" />
                    ) : (
                      <i className="fas fa-plus"></i>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="bankManager-stamp"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bankManagerStamp')}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="preview-panel">
            <div className="preview-header">
              <h3>PDF Preview</h3>
              {pdfFile && !pdfError && (
                <div className="preview-controls">
                  <div className="zoom-controls">
                    <button 
                      onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                      disabled={scale <= 0.5}
                    >
                      <i className="fas fa-search-minus"></i>
                    </button>
                    <span>{Math.round(scale * 100)}%</span>
                    <button 
                      onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                      disabled={scale >= 2}
                    >
                      <i className="fas fa-search-plus"></i>
                    </button>
                  </div>
                  {numPages > 1 && (
                    <div className="page-controls">
                      <button 
                        onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                        disabled={pageNumber <= 1}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span>Page {pageNumber} of {numPages}</span>
                      <button 
                        onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                        disabled={pageNumber >= numPages}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
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

            <div className="pdf-preview-container" ref={previewRef}>
              {isLoading ? (
                <div className="pdf-loading">
                  <div className="spinner"></div>
                  <p>Loading PDF...</p>
                </div>
              ) : pdfError ? (
                <div className="pdf-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>{pdfError}</p>
                </div>
              ) : pdfPreview ? (
                <div className="pdf-viewer">
                  <Document
                    file={pdfPreview}
                    onLoadSuccess={({ numPages }) => {
                      setNumPages(numPages);
                      setPdfError(null);
                    }}
                    onLoadError={(error) => {
                      console.error('PDF Load Error:', error);
                      setPdfError('Failed to load PDF. Please try again.');
                    }}
                    loading={
                      <div className="pdf-loading">
                        <div className="spinner"></div>
                        <p>Loading PDF...</p>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={
                        <div className="page-loading">
                          <div className="spinner"></div>
                        </div>
                      }
                    />
                  </Document>
                  <div className="signatures-overlay">
                    {Object.entries(signatures).map(([key, value]) => (
                      value && (
                        <div
                          key={key}
                          className={`signature-element ${isDragging && selectedElement === key ? 'dragging' : ''}`}
                          style={{
                            left: `${positions[key]?.x || 0}px`,
                            top: `${positions[key]?.y || 0}px`,
                            cursor: 'move',
                            position: 'absolute',
                            transform: 'translate(0, 0)',
                            zIndex: isDragging && selectedElement === key ? 1000 : 10,
                            touchAction: 'none'
                          }}
                          onMouseDown={(e) => handleDragStart(e, key)}
                          onTouchStart={(e) => {
                            const touch = e.touches[0];
                            handleDragStart({
                              preventDefault: () => {},
                              clientX: touch.clientX,
                              clientY: touch.clientY,
                              currentTarget: e.currentTarget
                            }, key);
                          }}
                        >
                          <img 
                            src={value} 
                            alt={`${key} signature`}
                            style={{
                              maxWidth: '150px',
                              maxHeight: '60px',
                              userSelect: 'none',
                              pointerEvents: 'none'
                            }}
                            draggable="false"
                          />
                        </div>
                      )
                    ))}

                    {Object.entries(stamps).map(([key, value]) => (
                      value && (
                        <div
                          key={key}
                          className={`stamp-element ${isDragging && selectedElement === key ? 'dragging' : ''}`}
                          style={{
                            left: `${positions[key]?.x || 0}px`,
                            top: `${positions[key]?.y || 0}px`,
                            cursor: 'move',
                            position: 'absolute',
                            transform: 'translate(0, 0)',
                            zIndex: isDragging && selectedElement === key ? 1000 : 10,
                            touchAction: 'none'
                          }}
                          onMouseDown={(e) => handleDragStart(e, key)}
                          onTouchStart={(e) => {
                            const touch = e.touches[0];
                            handleDragStart({
                              preventDefault: () => {},
                              clientX: touch.clientX,
                              clientY: touch.clientY,
                              currentTarget: e.currentTarget
                            }, key);
                          }}
                        >
                          <img 
                            src={value} 
                            alt={`${key} stamp`}
                            style={{
                              maxWidth: '150px',
                              maxHeight: '80px',
                              userSelect: 'none',
                              pointerEvents: 'none'
                            }}
                            draggable="false"
                          />
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