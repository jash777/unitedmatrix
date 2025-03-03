import React, { useState } from 'react';
import { PrintForm3 } from './PrintForm3';
import { generatePDF } from '../utils/pdfGenerator.jsx';

const TestPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const formElement = document.getElementById('form3-wrapper');
      if (!formElement) {
        throw new Error('Form element not found');
      }

      await generatePDF(formElement, {
        fileName: 'test_receipt.pdf',
        scale: 2,
        quality: 1.0,
        backgroundColor: '#ffffff'
      });

      alert('Test PDF generated successfully!');
    } catch (error) {
      console.error("Error generating test PDF:", error);
      alert("An error occurred while generating the test PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>PDF Generation Test</h2>
      <div style={{ marginBottom: '20px' }}>
        <p>This test will generate a PDF with the exact format from PrintForm3.</p>
        <p>Features:</p>
        <ul>
          <li>Exact A4 dimensions (210mm x 297mm)</li>
          <li>High quality output (2x scale)</li>
          <li>Proper page handling</li>
          <li>Maintains all styling and layout</li>
        </ul>
      </div>

      <button 
        onClick={handleGeneratePDF}
        disabled={isGenerating}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          opacity: isGenerating ? 0.7 : 1
        }}
      >
        {isGenerating ? 'Generating Test PDF...' : 'Generate Test PDF'}
      </button>

      {/* Hidden container for the form */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div id="form3-wrapper">
          <PrintForm3 />
        </div>
      </div>
    </div>
  );
};

export default TestPDF; 