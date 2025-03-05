/**
 * PDF Generator Utility
 * 
 * This file contains utility functions for generating PDFs from HTML elements.
 * It uses html2pdf.js library for PDF generation.
 */

/**
 * Generates a PDF from an HTML element
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {Object} options - Options for PDF generation
 * @returns {Promise<Blob>} A promise that resolves to a Blob containing the PDF
 */
export const generatePDF = async (element, options = {}) => {
  try {
    // Check if html2pdf is available
    if (!window.html2pdf) {
      // Try to load html2pdf dynamically
      await loadHtml2Pdf();
    }
    
    // Default options
    const defaultOptions = {
      margin: 10,
      filename: `document-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Generate PDF as blob
    return new Promise((resolve, reject) => {
      window.html2pdf()
        .set(mergedOptions)
        .from(element)
        .outputPdf('blob')
        .then(blob => {
          resolve(blob);
        })
        .catch(error => {
          console.error('Error generating PDF:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Loads the html2pdf.js library dynamically
 * @returns {Promise<void>} A promise that resolves when the library is loaded
 */
const loadHtml2Pdf = () => {
  return new Promise((resolve, reject) => {
    // Check if html2pdf is already loaded
    if (window.html2pdf) {
      resolve();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.integrity = 'sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    
    // Set up event listeners
    script.onload = () => {
      console.log('html2pdf.js loaded successfully');
      resolve();
    };
    
    script.onerror = (error) => {
      console.error('Error loading html2pdf.js:', error);
      reject(new Error('Failed to load html2pdf.js'));
    };
    
    // Append script to document
    document.head.appendChild(script);
  });
};

/**
 * Generates a PDF from a URL
 * @param {string} url - The URL to convert to PDF
 * @param {Object} options - Options for PDF generation
 * @returns {Promise<Blob>} A promise that resolves to a Blob containing the PDF
 */
export const generatePDFFromUrl = async (url, options = {}) => {
  try {
    // Create an iframe to load the URL
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '1024px';
    iframe.style.height = '1448px'; // A4 height at 96 DPI
    
    // Append iframe to document
    document.body.appendChild(iframe);
    
    // Load URL in iframe
    return new Promise((resolve, reject) => {
      iframe.onload = async () => {
        try {
          // Wait a bit for any JavaScript to execute
          await new Promise(r => setTimeout(r, 1000));
          
          // Generate PDF from iframe content
          const blob = await generatePDF(iframe.contentDocument.body, options);
          
          // Clean up
          document.body.removeChild(iframe);
          
          resolve(blob);
        } catch (error) {
          // Clean up
          document.body.removeChild(iframe);
          
          reject(error);
        }
      };
      
      iframe.onerror = (error) => {
        // Clean up
        document.body.removeChild(iframe);
        
        console.error('Error loading URL in iframe:', error);
        reject(new Error('Failed to load URL in iframe'));
      };
      
      // Set iframe source
      iframe.src = url;
    });
  } catch (error) {
    console.error('Error generating PDF from URL:', error);
    throw error;
  }
}; 