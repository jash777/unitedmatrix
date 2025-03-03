import React, { useEffect, useState } from 'react';
import { useTransaction } from '../context/transactionContext';
import { PrintForm3 } from './PrintForm3';
import { PrintForm2 } from './PrintForm2';
import PrintForm from './PrintForm';
import { generatePDF } from '../utils/pdfGenerator';

const Print = () => {
  const transactionData = useTransaction();
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedForm, setSelectedForm] = useState('form3');
  
  // Function to handle printing
  const handlePrint = async (formType) => {
    setIsPrinting(true);
    try {
      const formElement = document.getElementById(`${formType}-wrapper`);
      if (!formElement) {
        throw new Error('Form element not found');
      }

      // Call the generatePDF function from pdfGenerator.jsx
      const success = await generatePDF(formElement, {
        fileName: `Print_${formType.toUpperCase()}.pdf`,
        backgroundColor: '#ffffff'
      });

      if (success) {
        console.log(`${formType.toUpperCase()} PDF generated successfully`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Show user-friendly error message
      alert(`Failed to generate PDF: ${error.message}. Please try again or contact support if the issue persists.`);
    } finally {
      setIsPrinting(false);
    }
  };
  
  const styles = {
    container: {
      padding: '15px',
      maxWidth: '1200px',
      margin: '0 auto',
      '@media (max-width: 768px)': {
        padding: '10px'
      }
    },
    controls: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      '@media (max-width: 768px)': {
        padding: '10px'
      }
    },
    formSelection: {
      marginBottom: '20px',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      '@media (max-width: 576px)': {
        flexDirection: 'column'
      }
    },
    button: {
      flex: 1,
      minWidth: '100px',
      padding: '10px 20px',
      '@media (max-width: 576px)': {
        width: '100%'
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Transaction Completed Successfully</h2>
        <p><strong>Reference Code:</strong> {transactionData.referencecode || 'N/A'}</p>
        <p><strong>Amount:</strong> {transactionData.currency || ''} {transactionData.amount || 'N/A'}</p>
        
        <div style={styles.formSelection}>
          <button
            onClick={() => setSelectedForm('form1')}
            style={{
              ...styles.button,
              backgroundColor: selectedForm === 'form1' ? '#2980b9' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Form 1
          </button>
          <button
            onClick={() => setSelectedForm('form2')}
            style={{
              ...styles.button,
              backgroundColor: selectedForm === 'form2' ? '#2980b9' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Form 2
          </button>
          <button
            onClick={() => setSelectedForm('form3')}
            style={{
              ...styles.button,
              backgroundColor: selectedForm === 'form3' ? '#2980b9' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Form 3
          </button>
        </div>
        
        <div className="print-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handlePrint(selectedForm)} 
            disabled={isPrinting}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isPrinting ? 'not-allowed' : 'pointer',
              opacity: isPrinting ? 0.7 : 1
            }}
          >
            {isPrinting ? 'Generating PDF...' : `Generate ${selectedForm.toUpperCase()} Receipt`}
          </button>
        </div>
      </div>
      
      <div id="printable-content">
        <div 
          className="form-wrapper" 
          id="form1-wrapper" 
          style={{ display: selectedForm === 'form1' ? 'block' : 'none' }}
        >
          <PrintForm />
        </div>
        
        <div 
          className="form-wrapper" 
          id="form2-wrapper" 
          style={{ display: selectedForm === 'form2' ? 'block' : 'none' }}
        >
          <PrintForm2 />
        </div>
        
        <div 
          className="form-wrapper" 
          id="form3-wrapper" 
          style={{ display: selectedForm === 'form3' ? 'block' : 'none' }}
        >
          <PrintForm3 />
        </div>
      </div>
    </div>
  );
};

export default Print; 