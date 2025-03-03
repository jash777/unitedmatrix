// Remove all imports and React PDF components
export const generatePDF = async (formElement, options = {}) => {
  const {
    fileName = 'Print_Receipt.pdf',
    backgroundColor = '#ffffff'
  } = options;

  try {
    console.log('Starting PDF generation process...');
    
    // Get all form3 parts
    const pages = formElement.querySelectorAll('div[id^="form3-part"]');
    console.log(`Found ${pages.length} pages to process`);
    
    // Create container for styles
    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

      @page {
        size: 210mm 370mm;
        margin: 0;
      }
      
      @media print {
        html, body {
          margin: 0;
          padding: 0;
          width: 210mm;
          height: 370mm;
        }
      }
      
      body {
        margin: 0;
        padding: 0;
        background-color: ${backgroundColor};
        font-family: "Courier Prime", monospace;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-size: 12px;
        font-weight: bold;
      }
      
      #pdf-container {
        width: 210mm;
        margin: 0 auto;
        position: relative;
      }
      
      .page {
        width: 210mm;
        height: 370mm;
        box-sizing: border-box;
        position: relative;
        page-break-after: always;
        padding: 20px 30px;
        font-family: "Courier Prime", monospace;
        font-size: 12px;
        font-weight: bold;
        background-color: inherit;
      }
      
      .page:first-child {
        padding-top: 15px;
      }
      
      .page:last-child {
        page-break-after: auto;
      }
      
      .flex {
        display: flex !important;
      }
      
      .justify-between {
        justify-content: space-between !important;
      }
      
      .items-center {
        align-items: center !important;
      }
      
      .gap-4 {
        gap: 1rem !important;
      }
      
      .w-56 {
        width: 14rem !important;
      }
      
      .w-60 {
        width: 15rem !important;
      }
      
      .mt-2 {
        margin-top: 0.3125rem !important;
      }
      
      .mt-4 {
        margin-top: 0.625rem !important;
      }
      
      .mt-8 {
        margin-top: 1.25rem !important;
      }
      
      .-mt-1 {
        margin-top: -0.25rem !important;
      }
      
      .-mb-2 {
        margin-bottom: -0.5rem !important;
      }
      
      .ml-4 {
        margin-left: 1rem !important;
      }
      
      .mr-2 {
        margin-right: 0.5rem !important;
      }
      
      .px-8 {
        padding-left: 2rem !important;
        padding-right: 2rem !important;
      }
      
      .text-left {
        text-align: left !important;
      }
      
      .text-center {
        text-align: center !important;
      }
      
      .text-white {
        color: transparent !important;
      }
      
      .bg-black {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      
      .bg-white {
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      
      .uppercase {
        text-transform: uppercase !important;
      }
      
      img {
        max-width: 200px !important;
        height: auto !important;
        display: block !important;
      }
      
      p {
        margin: 0 !important;
        line-height: 1.5 !important;
        font-family: "Courier Prime", monospace !important;
        font-size: 12px !important;
        font-weight: bold !important;
      }
      
      .barcode-container {
        margin: 10px auto !important;
        text-align: right !important;
      }
      
      .barcode-container svg {
        display: inline-block !important;
        width: 200px !important;
        height: 40px !important;
      }
      
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      /* Form3 specific styles */
      .form3-container {
        width: 210mm;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
      }
      
      .form3-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #333;
      }
      
      .form3-section {
        margin-bottom: 10px !important;
        padding: 6px !important;
      }
      
      .form3-row {
        margin-bottom: 3px !important;
      }
      
      .form3-label {
        width: 200px;
        font-weight: bold;
      }
      
      .form3-value {
        flex: 1;
      }

      /* Custom break points */
      .message-trailer {
        page-break-after: avoid !important;
        margin-bottom: 0 !important;
      }

      /* Logo styles */
      .logo-container {
        width: 100% !important;
        margin-bottom: 15px !important;
        padding-left: 30px !important;
        position: relative !important;
      }

      .logo-container img {
        width: 200px !important;
        height: auto !important;
        object-fit: contain !important;
        display: block !important;
      }

      /* Interventions section */
      div[data-section="interventions"] {
        page-break-before: avoid !important;
      }

      /* Content sections */
      .content-section {
        margin-bottom: 10px;
      }

      /* Message trailer specific */
      // .message-trailer-section {
      //   position: relative;
      //   margin-top: auto;
      //   margin-bottom: 20px;
      // }

      /* Ensure proper page breaks */
      .page-break-before {
        page-break-before: always !important;
      }
      
      .page-break-after {
        page-break-after: always !important;
      }
    `;

    // Process pages and create content
    const pagesContent = Array.from(pages).map((page, index) => {
      const clone = page.cloneNode(true);
      
      // Process barcodes
      const barcodes = clone.querySelectorAll('.barcode-container');
      barcodes.forEach(barcode => {
        const svg = barcode.querySelector('svg');
        if (svg) {
          svg.style.display = 'inline-block';
          svg.setAttribute('width', '200');
          svg.setAttribute('height', '40');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }
      });

      // Add logo at the start of the page
      const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Deutsche_Bank_logo.svg/2560px-Deutsche_Bank_logo.svg.png';
      const logoContainer = document.createElement('div');
      logoContainer.className = 'logo-container';
      logoContainer.innerHTML = `<img src="${logoUrl}" alt="Deutsche Bank Logo" />`;
      clone.insertBefore(logoContainer, clone.firstChild);

      // Organize content into sections
      const sections = clone.querySelectorAll('div[class*="section"]');
      sections.forEach((section, sectionIndex) => {
        section.classList.add('content-section');
      });

      // Find message trailer and interventions using standard DOM methods
      const paragraphs = clone.querySelectorAll('p');
      paragraphs.forEach(p => {
        // Handle message trailer
        // if (p.textContent && p.textContent.trim() === 'MESSAGE TRAILER') {
        //   const trailerDiv = p.closest('div');
        //   if (trailerDiv) {
        //     trailerDiv.classList.add('message-trailer-section');
        //   }
        // }
        
        // Handle interventions
        if (p.textContent && p.textContent.trim() === 'INTERVENTIONS') {
          const interventionsDiv = p.closest('div');
          if (interventionsDiv) {
            interventionsDiv.classList.add('page-break-before');
          }
        }
      });

      // Set background color based on page index
      const isBlackPage = index >= 2; // First two pages white, last two black
      const backgroundColor = isBlackPage ? 'black' : 'white';
      const textColor = isBlackPage ? 'white' : 'black';

      return `
        <div class="page" style="background-color: ${backgroundColor}; color: ${textColor}">
          ${clone.innerHTML}
        </div>
      `;
    }).join('');

    // Construct final HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">
          <style>${styles}</style>
        </head>
        <body>
          <div id="pdf-container">
            ${pagesContent}
          </div>
        </body>
      </html>
    `;
    
    console.log('Sending request to server...');
    // Send to server for PDF generation
    const response = await fetch('http://localhost:3001/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html,
        options: {
          format: 'A4',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
          preferCSSPageSize: true,
          scale: 1,
          displayHeaderFooter: false,
          height: '370mm',
          width: '210mm'
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.details || 'Failed to generate PDF');
    }
    
    // Get the PDF as a blob directly
    const pdfBlob = await response.blob();
    console.log('PDF blob size:', pdfBlob.size, 'bytes');
    
    // Validate PDF blob
    if (pdfBlob.size === 0) {
      throw new Error('Generated PDF is empty');
    }
    
    // Create blob URL for both preview and download
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Open PDF in new tab
    const newWindow = window.open(blobUrl, '_blank');
    if (!newWindow) {
      console.warn('Popup blocked - falling back to direct navigation');
      window.location.href = blobUrl;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);
    
    console.log('PDF generation completed successfully');
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    console.error("Error stack:", error.stack);
    throw new Error(`PDF Generation Failed: ${error.message}`);
  }
};

// Helper function to ensure proper dimensions
export const getPageDimensions = (type) => {
  const dimensions = {
    'form3-part1': { width: 210, height: 370 },
    'form3-part2': { width: 210, height: 297 },
    'form3-part3': { width: 210, height: 370 },
    'form3-part4': { width: 210, height: 297 }
  };
  return dimensions[type] || { width: 210, height: 297 }; // Default to A4
};

// Helper function to format text for PDF
export const formatTextForPDF = (text) => {
  // Remove extra whitespace and normalize line breaks
  return text.replace(/\s+/g, ' ').trim();
}; 