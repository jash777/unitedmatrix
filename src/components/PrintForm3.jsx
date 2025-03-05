import React, { useEffect } from 'react';
import { useTransaction } from '../context/transactionContext';
import JsBarcode from 'jsbarcode';

export const PrintForm3 = () => {
  const transactionData = useTransaction();

  useEffect(() => {
    // Generate barcodes
    const generateBarcodes = () => {
      try {
        ['barcode1', 'barcode2', 'barcode3', 'barcode4'].forEach(id => {
          JsBarcode(`#${id}`, transactionData.referencecode || 'NO-REF', {
            format: "CODE128",
            width: 1,
            height: 40,
            displayValue: true
          });
        });
      } catch (error) {
        console.error('Error generating barcodes:', error);
      }
    };

    // Populate form data
    const populateFormData = () => {
      const fieldMappings = {
        // Sender Information
        senderSwiftCode: ['senderSwiftCode', 'senderSwiftCode2', 'senderSwiftCode3', 'senderSwiftCode4', 'senderSwiftCode5', 'senderSwiftCode6', 'senderSwiftCode7'],
        senderBankName: ['senderBankName', 'senderBankName2', 'senderBankName3', 'senderBankName4'],
        senderBankAddress: ['senderBankAddress', 'senderBankAddress2', 'senderBankAddress3', 'senderBankAddress4', 'senderBankAddress5', 'senderBankAddress6'],
        senderAccountName: ['senderAccountName', 'senderAccountName2', 'senderAccountName3', 'senderAccountName4'],
        senderAccountNumber: ['senderAccountNumber', 'senderAccountNumber2', 'senderAccountNumber3', 'senderAccountNumber4'],
        
        // Receiver Information
        receiverSwiftCode: ['receiverSwiftCode', 'receiverSwiftCode2', 'receiverSwiftCode3', 'receiverSwiftCode4', 'receiverSwiftCode5', 'receiverSwiftCode6', 'receiverSwiftCode7', 'receiverSwiftCode8', 'receiverSwiftCode9', 'receiverSwiftCode10'],
        receiverBankName: ['receiverBankName', 'receiverBankName2', 'receiverBankName3', 'receiverBankName4'],
        receiverBankAddress: ['receiverBankAddress', 'receiverBankAddress2', 'receiverBankAddress3', 'receiverBankAddress4'],
        receiverAccountName: ['receiverAccountName', 'receiverAccountName2', 'receiverAccountName3'],
        receiverAccountNumber: ['receiverAccountNumber', 'receiverAccountNumber2', 'receiverAccountNumber3', 'receiverAccountNumber4'],
        
        // Transaction Information
        amount: ['amount', 'amount2', 'amount3', 'amount4', 'amount5', 'amount6', 'amount7', 'amount8'],
        currency: ['currency', 'currency2', 'currency3', 'currency4'],
        referencecode: ['referencecode', 'referencecode2', 'referencecode3', 'referencecode4'],
        
        // Other Fields
        instructionType: ['instructionType', 'instructionType2', 'instructionType3', 'instructionType4', 'instructionType5', 'instructionType6'],
        messageReference: ['messageReference', 'messageReference2', 'messageReference3'],
        networkDeliveryStatus: ['networkDeliveryStatus', 'networkDeliveryStatus2', 'networkDeliveryStatus3'],
        transactionDateTime: ['transactionDateTime', 'transactionDateTime2', 'transactionDateTime3', 'transactionDateTime4'],
        transactionFullDate: ['transactionFullDate', 'transactionFullDate2', 'transactionFullDate3', 'transactionFullDate4'],
        transactionFullTime: ['transactionFullTime', 'transactionFullTime2', 'transactionFullTime3']
      };

      // Populate all fields
      Object.entries(fieldMappings).forEach(([dataKey, elementIds]) => {
        elementIds.forEach(id => {
          const element = document.getElementById(id);
          if (element && transactionData[dataKey]) {
            element.textContent = transactionData[dataKey];
          }
        });
      });

      // Handle signatures if they exist
      ['bankOfficerSignature', 'senderSignature', 'bankManagerSignature', 'receiverSignature'].forEach((signatureType, index) => {
        if (transactionData[signatureType]) {
          for (let i = 1; i <= 4; i++) {
            const imgElement = document.getElementById(`${signatureType}${i}`);
            if (imgElement) {
              imgElement.src = transactionData[signatureType];
              imgElement.style.display = 'block';
            }
          }
        }
      });
    };

    // Execute population and barcode generation
    if (transactionData) {
      populateFormData();
      generateBarcodes();
    }
  }, [transactionData]);

  // Use the existing HTML template structure
  return (
    <div id="printForm3" className="form3-container">
      {/* Copy the entire content from index.html here, starting from the flex-center div */}
      {}
    </div>
  );
};