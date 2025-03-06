import React, { useState, useRef, useEffect } from 'react';
import { useTransaction } from '../context/transactionContext';
import './Signatures.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { jsPDF } from 'jspdf';
import '../utils/pdfWorker'; // Import the worker configuration
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PDFDocument } from 'pdf-lib';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Constants for image sizes (in pixels)
const SIGNATURE_WIDTH = 120; // Reduced from 200 to 120px
const SIGNATURE_HEIGHT = 50; // Reduced from 80 to 50px
const STAMP_WIDTH = 100; // Reduced from 200 to 100px
const STAMP_HEIGHT = 100; // Reduced from 120 to 100px (making it square for stamps)
const RENDER_SCALE = 3; // Keep high quality rendering

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
  const canvasRef = useRef(null);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [sanitizeMetadata, setSanitizeMetadata] = useState(false);

  // Function to handle successful PDF load
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Handle PDF preview with PDF.js
  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Please upload a valid PDF file');
      }

      // Create a blob URL for preview
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfPreview(fileUrl);
      setPageNumber(1); // Reset to first page
      
      // Store the PDF bytes
      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(arrayBuffer);

    } catch (error) {
      console.error('PDF Upload Error:', error);
      alert(error.message);
      setPdfFile(null);
      setPdfPreview(null);
      setPdfBytes(null);
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

  const sanitizePDF = async (pdfBytes) => {
    try {
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Clear all metadata
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setCreator('');
      pdfDoc.setProducer('');
      
      // Remove creation and modification dates
      const info = pdfDoc.getInfoDict();
      if (info) {
        info.delete('CreationDate');
        info.delete('ModDate');
        info.delete('Producer');
        info.delete('Creator');
        info.delete('Title');
        info.delete('Author');
        info.delete('Subject');
        info.delete('Keywords');
      }

      // Save with minimal metadata
      const sanitizedBytes = await pdfDoc.save({
        updateMetadata: false,
        addDefaultPage: false,
        preservePDFForm: true
      });

      // Verify sanitization (using proper method)
      const verifyDoc = await PDFDocument.load(sanitizedBytes);
      const verifyInfo = verifyDoc.getInfoDict();
      
      // Log remaining metadata keys if any exist
      if (verifyInfo) {
        console.log('Remaining metadata keys:', {
          hasCreationDate: verifyInfo.has('CreationDate'),
          hasModDate: verifyInfo.has('ModDate'),
          hasProducer: verifyInfo.has('Producer'),
          hasCreator: verifyInfo.has('Creator'),
          hasTitle: verifyInfo.has('Title'),
          hasAuthor: verifyInfo.has('Author'),
          hasSubject: verifyInfo.has('Subject'),
          hasKeywords: verifyInfo.has('Keywords')
        });
      }

      return sanitizedBytes;
    } catch (error) {
      console.error('Error in sanitizePDF:', error);
      throw new Error(`Sanitization failed: ${error.message}`);
    }
  };

  const drawImageWithQuality = async (context, image, x, y, targetWidth, targetHeight) => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Set temp canvas size to source image size
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    
    // Draw original image to temp canvas
    tempCtx.drawImage(image, 0, 0, image.width, image.height);
    
    // Calculate aspect ratio
    const aspectRatio = image.width / image.height;
    
    // Calculate new dimensions maintaining aspect ratio
    let newWidth = targetWidth;
    let newHeight = targetHeight;
    
    if (aspectRatio > 1) {
      newHeight = targetWidth / aspectRatio;
    } else {
      newWidth = targetHeight * aspectRatio;
    }
    
    // Center the image
    const xOffset = (targetWidth - newWidth) / 2;
    const yOffset = (targetHeight - newHeight) / 2;
    
    // Enable high-quality image scaling
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    
    // Draw the image using the temporary canvas
    context.drawImage(
      tempCanvas,
      0,
      0,
      image.width,
      image.height,
      x + xOffset,
      y + yOffset,
      newWidth,
      newHeight
    );

    tempCanvas.remove();
  };

  const generatePDFWithSignatures = async () => {
    if (!pdfFile) {
      alert('Please upload a PDF file first');
      return;
    }

    setIsProcessing(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Load the original PDF
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument(arrayBuffer).promise;
      const totalPages = pdfDoc.numPages;

      // Process each page
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: RENDER_SCALE });

        // Create canvas with high resolution
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Enable high-quality rendering
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // Render PDF page
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Add signatures if on current page
        if (pageNum === pageNumber) {
          // Draw signatures
          await Promise.all(
            Object.entries(signatures).map(async ([key, value]) => {
              if (value && positions[key]) {
                const img = new Image();
                img.src = value;
                await new Promise((resolve) => {
                  img.onload = async () => {
                    const scaledX = positions[key].x * RENDER_SCALE;
                    const scaledY = positions[key].y * RENDER_SCALE;
                    await drawImageWithQuality(
                      context,
                      img,
                      scaledX,
                      scaledY,
                      SIGNATURE_WIDTH * RENDER_SCALE,
                      SIGNATURE_HEIGHT * RENDER_SCALE
                    );
                    resolve();
                  };
                });
              }
            })
          );

          // Draw stamps
          await Promise.all(
            Object.entries(stamps).map(async ([key, value]) => {
              if (value && positions[key]) {
                const img = new Image();
                img.src = value;
                await new Promise((resolve) => {
                  img.onload = async () => {
                    const scaledX = positions[key].x * RENDER_SCALE;
                    const scaledY = positions[key].y * RENDER_SCALE;
                    await drawImageWithQuality(
                      context,
                      img,
                      scaledX,
                      scaledY,
                      STAMP_WIDTH * RENDER_SCALE,
                      STAMP_HEIGHT * RENDER_SCALE
                    );
                    resolve();
                  };
                });
              }
            })
          );
        }

        // Add page to PDF with maximum quality
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        if (pageNum > 1) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89, '', 'FAST');

        // Clean up
        canvas.remove();
      }

      // Get the PDF as bytes
      let finalPdfBytes = await pdf.output('arraybuffer');

      // Sanitize if requested
      if (sanitizeMetadata) {
        try {
          console.log('Starting PDF sanitization...');
          finalPdfBytes = await sanitizePDF(finalPdfBytes);
          console.log('PDF sanitization completed successfully');
        } catch (sanitizeError) {
          console.error('Sanitization error:', sanitizeError);
          const continueWithoutSanitization = window.confirm(
            'Metadata sanitization failed. Would you like to download the PDF without sanitization?'
          );
          if (!continueWithoutSanitization) {
            setIsProcessing(false);
            return;
          }
        }
      }

      // Download the PDF
      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `${pdfFile.name.replace('.pdf', '')}-${
        sanitizeMetadata ? 'secured' : 'signed'
      }.pdf`;

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add a function to verify sanitization
  const verifySanitization = async (pdfBytes) => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      console.log('Metadata after sanitization:', {
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        keywords: pdfDoc.getKeywords(),
        creator: pdfDoc.getCreator(),
        producer: pdfDoc.getProducer()
      });
    } catch (error) {
      console.error('Error verifying sanitization:', error);
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

  // Update the preview rendering of signatures and stamps
  const renderSignaturePreview = (signature, key) => {
    if (!signature) return null;
    
    const style = positions[key] ? {
      position: 'absolute',
      left: positions[key].x,
      top: positions[key].y,
      width: `${SIGNATURE_WIDTH}px`,
      height: `${SIGNATURE_HEIGHT}px`,
      cursor: 'move',
      objectFit: 'contain',
      imageRendering: 'high-quality',
      backgroundColor: 'rgba(255, 255, 255, 0.01)', // More transparent background
      border: '1px dashed #ccc'
    } : {};

    return (
      <img
        src={signature}
        alt="Signature"
        className="signature-preview"
        draggable="true"
        onDragStart={(e) => handleDragStart(e, key)}
        onDrag={(e) => handleDrag(e, key)}
        onDragEnd={handleDragEnd}
        style={style}
      />
    );
  };

  const renderStampPreview = (stamp, key) => {
    if (!stamp) return null;
    
    const style = positions[key] ? {
      position: 'absolute',
      left: positions[key].x,
      top: positions[key].y,
      width: `${STAMP_WIDTH}px`,
      height: `${STAMP_HEIGHT}px`,
      cursor: 'move',
      objectFit: 'contain',
      imageRendering: 'high-quality',
      backgroundColor: 'rgba(255, 255, 255, 0.01)', // More transparent background
      border: '1px dashed #ccc'
    } : {};

    return (
      <img
        src={stamp}
        alt="Stamp"
        className="stamp-preview"
        draggable="true"
        onDragStart={(e) => handleDragStart(e, key)}
        onDrag={(e) => handleDrag(e, key)}
        onDragEnd={handleDragEnd}
        style={style}
      />
    );
  };

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
                  <div className="download-options">
                    <label className="sanitize-option">
                      <input
                        type="checkbox"
                        checked={sanitizeMetadata}
                        onChange={(e) => setSanitizeMetadata(e.target.checked)}
                      />
                      <span className="checkbox-label">
                        <i className="fas fa-shield-alt"></i>
                        Remove Metadata
                      </span>
                      <div className="tooltip">
                        Removes sensitive information like author, creation date, and other metadata
                      </div>
                    </label>

                    <button 
                      className={`process-btn ${isProcessing ? 'processing' : ''}`}
                      onClick={generatePDFWithSignatures}
                      disabled={isProcessing || !pdfFile}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner"></span>
                          <span>
                            {sanitizeMetadata ? 'Processing & Sanitizing...' : 'Processing...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-file-download"></i>
                          <span style={{color: 'red'}}>
                            {sanitizeMetadata ? 'Download Secure PDF' : 'Download Signed PDF'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
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
                    {Object.entries(signatures).map(([key, value]) => 
                      renderSignaturePreview(value, key)
                    )}
                    {Object.entries(stamps).map(([key, value]) => 
                      renderStampPreview(value, key)
                    )}
                  </div>
                </div>
              ) : (
                <div className="preview-placeholder">
                  <i className="fas fa-file-pdf"></i>
                  <p>Upload a PDF file to preview</p>
                </div>
              )}
            </div>

            {/* Hidden canvas for PDF generation */}
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signatures; 