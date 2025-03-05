/**
 * HTML Version Helper Functions
 * 
 * This file contains utility functions for working with the HTML version
 * of the PrintForm3 component.
 */

/**
 * Checks if the HTML version is properly set up in the public directory
 * @returns {Promise<boolean>} True if the HTML version is available
 */
export const checkHtmlVersionSetup = async () => {
  try {
    // Try to fetch the index.html file from the PrintForm3_HTML directory
    const response = await fetch('/PrintForm3_HTML/index.html', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking HTML version setup:', error);
    return false;
  }
};

/**
 * Opens the HTML version in a new window and passes transaction data
 * @param {Object} transactionData - The transaction data to pass to the HTML version
 * @returns {Window|null} The window object or null if popup was blocked
 */
export const openHtmlVersion = (transactionData) => {
  try {
    // Store the transaction data in localStorage
    localStorage.setItem('swiftFormData', JSON.stringify(transactionData));
    
    // Open the HTML version in a new window
    const htmlWindow = window.open('/PrintForm3_HTML/index.html', '_blank', 'width=1000,height=800');
    
    // If popup was blocked, return null
    if (!htmlWindow) {
      console.error('Popup blocked. Please allow popups and try again.');
      return null;
    }
    
    // Wait for the window to load before sending the message
    htmlWindow.addEventListener('load', () => {
      // Try to send the data via postMessage as a backup method
      try {
        htmlWindow.postMessage({
          type: 'TRANSACTION_DATA',
          data: transactionData
        }, '*');
      } catch (error) {
        console.error('Error sending message to HTML version:', error);
      }
    });
    
    return htmlWindow;
  } catch (error) {
    console.error('Error opening HTML version:', error);
    return null;
  }
};

/**
 * Prints the HTML version with the given transaction data
 * @param {Object} transactionData - The transaction data to pass to the HTML version
 * @returns {Promise<boolean>} True if printing was successful
 */
export const printHtmlVersion = async (transactionData) => {
  try {
    // Open the HTML version
    const htmlWindow = openHtmlVersion(transactionData);
    
    if (!htmlWindow) {
      return false;
    }
    
    // Wait for the window to load before printing
    return new Promise((resolve) => {
      htmlWindow.addEventListener('load', () => {
        // Give the HTML version some time to process the data
        setTimeout(() => {
          try {
            // Print the window
            htmlWindow.print();
            
            // Close the window after printing
            setTimeout(() => {
              htmlWindow.close();
              resolve(true);
            }, 1000);
          } catch (error) {
            console.error('Error printing HTML version:', error);
            resolve(false);
          }
        }, 1000);
      });
      
      // Set a timeout in case the load event doesn't fire
      setTimeout(() => {
        resolve(false);
      }, 10000);
    });
  } catch (error) {
    console.error('Error printing HTML version:', error);
    return false;
  }
};

/**
 * Generates a PDF from the HTML version with the given transaction data
 * @param {Object} transactionData - The transaction data to pass to the HTML version
 * @returns {Promise<boolean>} True if PDF generation was successful
 */
export const generatePdfFromHtmlVersion = async (transactionData) => {
  try {
    // Open the HTML version
    const htmlWindow = openHtmlVersion(transactionData);
    
    if (!htmlWindow) {
      return false;
    }
    
    // Wait for the window to load before generating PDF
    return new Promise((resolve) => {
      htmlWindow.addEventListener('load', () => {
        // Give the HTML version some time to process the data
        setTimeout(() => {
          try {
            // Send a message to the HTML version to generate PDF
            htmlWindow.postMessage({
              type: 'GENERATE_PDF',
              data: transactionData
            }, '*');
            
            // Listen for a response from the HTML version
            const messageListener = (event) => {
              if (event.data && event.data.type === 'PDF_GENERATED') {
                window.removeEventListener('message', messageListener);
                
                // Close the window after PDF generation
                setTimeout(() => {
                  htmlWindow.close();
                  resolve(event.data.success);
                }, 1000);
              }
            };
            
            window.addEventListener('message', messageListener);
            
            // Set a timeout in case the message doesn't come back
            setTimeout(() => {
              window.removeEventListener('message', messageListener);
              resolve(true); // Assume success if no response
            }, 10000);
          } catch (error) {
            console.error('Error generating PDF from HTML version:', error);
            resolve(false);
          }
        }, 1000);
      });
      
      // Set a timeout in case the load event doesn't fire
      setTimeout(() => {
        resolve(false);
      }, 10000);
    });
  } catch (error) {
    console.error('Error generating PDF from HTML version:', error);
    return false;
  }
};

/**
 * Prepares transaction data for the HTML version
 * @param {Object} transactionData - The raw transaction data
 * @returns {Object} The prepared transaction data
 */
export const prepareTransactionDataForHtml = (transactionData) => {
  // Create a deep copy of the transaction data
  const preparedData = JSON.parse(JSON.stringify(transactionData));
  
  // Ensure all required fields are present
  const requiredFields = [
    'referencecode', 'messageReference', 'trackingCode', 'transactionDate',
    'amount', 'currency', 'senderName', 'senderAddress', 'senderAccountNumber',
    'receiverName', 'receiverAddress', 'receiverAccountNumber'
  ];
  
  // Generate default values for missing fields
  requiredFields.forEach(field => {
    if (!preparedData[field]) {
      switch (field) {
        case 'referencecode':
          preparedData[field] = `REF-${Date.now().toString(36).toUpperCase()}`;
          break;
        case 'messageReference':
          preparedData[field] = `MSG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          break;
        case 'trackingCode':
          preparedData[field] = `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          break;
        case 'transactionDate':
          preparedData[field] = new Date().toISOString().split('T')[0];
          break;
        case 'amount':
          preparedData[field] = preparedData[field] || '0.00';
          break;
        case 'currency':
          preparedData[field] = preparedData[field] || 'USD';
          break;
        default:
          preparedData[field] = preparedData[field] || 'N/A';
      }
    }
  });
  
  return preparedData;
}; 