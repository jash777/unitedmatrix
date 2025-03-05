import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useTransaction } from '../context/transactionContext';
import { API_ENDPOINTS } from '../config/api';
import './SwiftMT103Form.css';
import accounts from '../config/accounts.json';

const SwiftMT103Form = ({ onSubmit, selectedSenderInfo }) => {
  const navigate = useNavigate();
  const { setTransactionData } = useTransaction();
  
  // Simple hash function to simulate CRC32 used in PHP
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  };

  // State for sender accounts
  const [senderAccounts, setSenderAccounts] = useState([]);
  const [selectedSender, setSelectedSender] = useState(selectedSenderInfo || null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Auto-generated fields
    field_20: '', // TRN - Transaction Reference Number
    uetr: '', // UETR - Unique End-to-End Transaction Reference
    
    // User input fields
    field_23b: 'CRED', // Bank Operation Code
    field_32a_1: '', // Value Date (YYYYMMDD)
    field_32a_2: '', // Currency
    field_32a_3: '', // Amount
    field_33b_1: '', // Currency (Original Ordered Amount)
    field_33b_2: '', // Amount (Original Ordered Amount)
    
    // Signature fields
    senderSignature: null,
    receiverSignature: null,
    bankOfficerSignature: null,
    bankManagerSignature: null,
    
    // Sender fields (pre-filled from selectedSenderInfo)
    field_50a_1: selectedSenderInfo?.AccountName || '', // Ordering Customer Name
    field_50a_2: selectedSenderInfo?.AccountNumber || '', // Ordering Customer Account
    field_52a_1: selectedSenderInfo?.SwiftCode || '', // Ordering Institution Swift Code
    field_52a_2: selectedSenderInfo?.BankName || '', // Ordering Institution Bank Name
    field_52a_3: selectedSenderInfo?.BankAddress || '', // Ordering Institution Bank Address
    
    // Correspondent banks
    field_53a: '', // Sender's Correspondent
    field_54a: '', // Receiver's Correspondent
    field_56a: '', // Intermediary
    
    // Beneficiary bank
    field_57a_1: '', // Account with Institution Name
    field_57a_2: '', // Account with Institution Address
    field_57a_3: '', // Account with Institution Swift Code
    
    // Beneficiary
    field_59_1: '', // Beneficiary Name
    field_59_2: '', // Beneficiary Account
    
    // Additional information
    field_70: '', // Remittance Information
    field_71a: 'SHA', // Details of Charges
    field_72: '', // Sender to Receiver Information
    field_77b: '' // Regulatory Reporting
  });

  // Add loading state at the top with other states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add this function after other state declarations
  const saveTransaction = async (transactionData) => {
    try {
      const response = await fetch('http://127.0.0.1:5005/api/save-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });
      
      const result = await response.json();
      console.log('Transaction saved:', result);
      return result;
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  };

  // Add new state for loading
  const [isConnecting, setIsConnecting] = useState(false);

  // Add new state for Swift connection
  const [isSwiftConnected, setIsSwiftConnected] = useState(false);

  // Update the handleSwiftConnect function
  const handleSwiftConnect = async () => {
    if (!selectedSender) {
      alert('Please select a sender account first');
      return;
    }

    setIsConnecting(true);
    try {
      const transactionData = {
        trn: formData.field_20,
        uetr: formData.uetr,
        senderInfo: {
          accountName: selectedSender.AccountName,
          accountNumber: selectedSender.AccountNumber,
          swiftCode: selectedSender.SwiftCode,
          bankName: selectedSender.BankName
        },
        timestamp: new Date().toISOString()
      };

      const result = await saveTransaction(transactionData);
      setIsSwiftConnected(true);
      alert('Successfully connected to SWIFT network');
    } catch (error) {
      alert('Failed to connect to SWIFT network. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Remove fetchSenderAccounts function and replace useEffect
  useEffect(() => {
    // Set accounts directly from imported JSON
    setSenderAccounts(accounts);
    
    // If there's a selectedSenderInfo, find and select that account
    if (selectedSenderInfo) {
      const selectedAccount = accounts.find(account => 
        account.id === selectedSenderInfo.id || 
        account.AccountNumber === selectedSenderInfo.AccountNumber
      );
      if (selectedAccount) {
        setSelectedSender(selectedAccount);
        updateFormWithSenderInfo(selectedAccount);
      }
    }
  }, []);

  // Update the handleSenderSelect function to show more account details
  const handleSenderSelect = (e) => {
    const selectedAccountId = e.target.value;
    console.log('Selected account ID:', selectedAccountId);

    const selectedAccount = accounts.find(account => 
      account.id.toString() === selectedAccountId.toString()
    );
    
    console.log('Selected account:', selectedAccount);

    if (selectedAccount) {
      setSelectedSender(selectedAccount);
      updateFormWithSenderInfo(selectedAccount);
    }
  };

  // Add function to update form with sender info
  const updateFormWithSenderInfo = (senderInfo) => {
    setFormData(prevData => ({
      ...prevData,
      field_50a_1: senderInfo.AccountName || '',
      field_50a_2: senderInfo.AccountNumber || '',
      field_52a_1: senderInfo.SwiftCode || '',
      field_52a_2: senderInfo.BankName || '',
      field_52a_3: senderInfo.BankAddress || '',
      field_20: generateTRN(senderInfo.SwiftCode)
    }));
  };

  // Generate TRN (Transaction Reference Number) similar to doMT103.php
  const generateTRN = (swiftCode) => {
    const dateX = new Date().getTime(); // Use timestamp for numeric values
    const dateY = new Date().getTime() + Math.floor(Math.random() * 1000000);
    
    // Extract first 2 characters from swift code
    const swiftPrefix = (swiftCode || '').substring(0, 2);
    
    // Generate a 14-digit number using timestamp and random values
    // This ensures we get only numbers, not alphanumeric hash
    const timestamp = dateX.toString().slice(-10);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const numericPart = (timestamp + random).slice(0, 14);
    
    return swiftPrefix + numericPart;
  };

  // Generate TRN and UETR on component mount or when Swift code changes
  useEffect(() => {
    const swiftCode = formData.field_52a_1 || selectedSenderInfo?.SwiftCode || '';
    
    setFormData(prev => ({
      ...prev,
      field_20: generateTRN(swiftCode),
      uetr: uuidv4()
    }));
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle signature file upload
  const handleSignatureUpload = (e, signatureType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [signatureType]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSwiftConnected) {
      alert('Please connect to SWIFT network before proceeding with the payment');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a timestamp for the transaction
      const now = new Date().toISOString();
      
      // Format date for display
      const transactionFullDate = now.substring(0, 10);
      const transactionFullTime = now.substring(11, 19);
      
      // Prepare transaction data
      const transactionData = {
        // Transaction reference and details
        referencecode: formData.field_20,
        uetr: formData.uetr,
        uetrcode: formData.uetr, // Add this for PrintForm3
        instructionType: 'MT103',
        transactionDate: now,
        
        // Sender information
        senderSwiftCode: formData.field_52a_1,
        senderBankName: formData.field_52a_2,
        senderBankAddress: formData.field_52a_3,
        senderAccountName: formData.field_50a_1,
        senderAccountNumber: formData.field_50a_2,
        
        // Receiver information
        receiverSwiftCode: formData.field_57a_3,
        receiverBankName: formData.field_57a_1,
        receiverBankAddress: formData.field_57a_2,
        receiverName: formData.field_59_1,
        receiverAccountNumber: formData.field_59_2,
        receiverAccountName: formData.field_59_1, // Add this for PrintForm3
        
        // Transaction details
        currency: formData.field_32a_2,
        amount: formData.field_32a_3,
        bankOperationCode: formData.field_23b,
        transactionFullDate: transactionFullDate,
        transactionFullTime: transactionFullTime,
        
        // Additional information
        remittanceInfo: formData.field_70,
        detailsOfCharges: formData.field_71a,
        description: formData.field_70,
        
        // Selected sender info
        selectedSenderInfo: selectedSender,
        
        // For PrintForm2
        iban: selectedSender?.IBAN || '',
        bic: formData.field_57a_3,
        senderReference: formData.field_50a_1,
        receiverReference: formData.field_59_1,
        isohk: hashString(formData.field_20 + now).substring(0, 8).toUpperCase(),
        
        // Generate additional fields needed for PrintForm3
        swiftCoverageInternalNumber: `SCN${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        confirmedAck: `ACK${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        debitAuthorized: `DA${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        accountDebited: `AD${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        
        // Additional fields for PrintForm3
        messageReference: `MR${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        networkDeliveryStatus: 'DELIVERED',
        prioritydelivery: 'URGENT',
        messageInputReference: `I${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        messageOutputReference: `O${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        trackingCode: `TC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        
        // Additional fields for PrintForm
        keyedby: 'SYSTEM',
        keyedbyfulldate: now,
        releasedby: 'SYSTEM',
        releasedbyfulldate: now,
        cancelledby: '',
        cancelledbyfulldate: now,
        receivedby: 'SYSTEM',
        receivedbyfulldate: now,
        relatedReferenceCode: `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        recipientcountry: 'INTERNATIONAL',
        
        // Add signatures
        senderSignature: formData.senderSignature,
        receiverSignature: formData.receiverSignature,
        bankOfficerSignature: formData.bankOfficerSignature,
        bankManagerSignature: formData.bankManagerSignature,
      };
      
      // First save the transaction to the database
      const saveResponse = await fetch('http://127.0.0.1:5005/api/save-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save transaction');
      }

      // Then generate the PDF
      const pdfResponse = await fetch(API_ENDPOINTS.PDF_GENERATOR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      const pdfResult = await pdfResponse.json();
      
      // Update transaction context with both transaction data and PDF URL
      setTransactionData({
        ...transactionData,
        pdfUrl: pdfResult.pdfUrl // Assuming the backend returns the PDF URL
      });
      
      // Navigate to print page
      navigate('/print');
    } catch (error) {
      console.error("Error in form submission:", error);
      alert('Error processing transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="swift-mt103-form">
      <h2 className="form-title">MT103 SWIFT TRANSFER</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Sender Selection Section */}
        <div className="form-row">
          <div className="form-section">
            <h3>Sender Information</h3>
            <div className="form-group">
              <label htmlFor="senderAccount">Select Sender Account</label>
              <select 
                id="senderAccount" 
                className="form-select"
                value={selectedSender?.id || ''}
                onChange={handleSenderSelect}
              >
                <option value="">-- Select Sender Account --</option>
                {senderAccounts.map(account => (
                  <option 
                    key={account.id} 
                    value={account.id}
                  >
                    {account.AccountName} - {account.AccountNumber} ({account.BankName})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Enhanced selected account details display */}
            {selectedSender && (
              <div className="selected-account-info">
                <div className="account-detail">
                  <strong>Bank Name:</strong> 
                  <span>{selectedSender.BankName}</span>
                </div>
                <div className="account-detail">
                  <strong>SWIFT:</strong> 
                  <span>{selectedSender.SwiftCode}</span>
                </div>
                <div className="account-detail">
                  <strong>Account Name:</strong> 
                  <span>{selectedSender.AccountName}</span>
                </div>
                <div className="account-detail">
                  <strong>Account Number:</strong> 
                  <span>{selectedSender.AccountNumber}</span>
                </div>
                <div className="account-detail">
                  <strong>Bank Address:</strong> 
                  <span>{selectedSender.BankAddress}</span>
                </div>
                <div className="account-detail">
                  <strong>Account Type:</strong> 
                  <span>{selectedSender.Types || 'Standard'}</span>
                </div>
                <div className="account-detail">
                  <strong>Balance:</strong> 
                  <span>{selectedSender.Balance_1}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-section">
            <h3>Transaction Reference</h3>
            <div className="form-group">
              <label htmlFor="field_20">:20: Transaction Reference Number (TRN)</label>
              <div className="input-with-button">
                <input 
                  type="text" 
                  id="field_20" 
                  name="field_20" 
                  value={formData.field_20} 
                  onChange={handleChange}
                  className="editable-input"
                />
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    field_20: generateTRN(formData.field_52a_1)
                  }))}
                  className="regenerate-btn"
                >
                  <i className="fas fa-sync-alt"></i>
                  Regenerate
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="uetr">UETR (Unique End-to-End Transaction Reference)</label>
              <div className="input-with-button">
                <input 
                  type="text" 
                  id="uetr" 
                  name="uetr" 
                  value={formData.uetr} 
                  onChange={handleChange}
                  className="editable-input"
                />
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    uetr: uuidv4()
                  }))}
                  className="regenerate-btn"
                >
                  <i className="fas fa-sync-alt"></i>
                  Regenerate
                </button>
              </div>
            </div>

            {/* Add the new Swift Connect button */}
            <div className="form-group swift-connect">
              <button 
                type="button" 
                className={`swift-connect-btn ${isConnecting ? 'connecting' : ''} ${isSwiftConnected ? 'connected' : ''}`}
                onClick={handleSwiftConnect}
                disabled={isConnecting || !selectedSender || isSwiftConnected}
              >
                {isConnecting ? (
                  <>
                    <span className="spinner"></span>
                    Connecting...
                  </>
                ) : isSwiftConnected ? (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Connected to SWIFT
                  </>
                ) : (
                  <>
                    <i className="fas fa-plug"></i>
                    Connect to SWIFT
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Transaction Details Section */}
        <div className="form-row">
          <div className="form-section">
            <h3>Transaction Details</h3>
            
            <div className="form-group">
              <label htmlFor="field_23b">:23B: Bank Operation Code</label>
              <input 
                type="text" 
                id="field_23b" 
                name="field_23b" 
                value={formData.field_23b} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_32a_1">:32A: Value Date (YYYYMMDD)</label>
              <input 
                type="text" 
                id="field_32a_1" 
                name="field_32a_1" 
                value={formData.field_32a_1} 
                onChange={handleChange} 
                placeholder="YYYYMMDD"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_32a_2">:32A: Currency</label>
              <input 
                type="text" 
                id="field_32a_2" 
                name="field_32a_2" 
                value={formData.field_32a_2} 
                onChange={handleChange} 
                placeholder="EUR"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_32a_3">:32A: Amount</label>
              <input 
                type="text" 
                id="field_32a_3" 
                name="field_32a_3" 
                value={formData.field_32a_3} 
                onChange={handleChange} 
                placeholder="1000.00"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Original Ordered Amount</h3>
            
            <div className="form-group">
              <label htmlFor="field_33b_1">:33B: Currency</label>
              <input 
                type="text" 
                id="field_33b_1" 
                name="field_33b_1" 
                value={formData.field_33b_1} 
                onChange={handleChange} 
                placeholder="EUR"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_33b_2">:33B: Amount</label>
              <input 
                type="text" 
                id="field_33b_2" 
                name="field_33b_2" 
                value={formData.field_33b_2} 
                onChange={handleChange} 
                placeholder="1000.00"
              />
            </div>
          </div>
        </div>
        
        {/* Sender Information Section */}
        <div className="form-row">
          <div className="form-section">
            <h3>Ordering Customer (Payer)</h3>
            
            <div className="form-group">
              <label htmlFor="field_50a_1">:50A: Ordering Customer Name</label>
              <input 
                type="text" 
                id="field_50a_1" 
                name="field_50a_1" 
                value={formData.field_50a_1} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_50a_2">:50A: Ordering Customer Account</label>
              <input 
                type="text" 
                id="field_50a_2" 
                name="field_50a_2" 
                value={formData.field_50a_2} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Ordering Institution</h3>
            
            <div className="form-group">
              <label htmlFor="field_52a_1">:52A: Ordering Institution Swift Code</label>
              <input 
                type="text" 
                id="field_52a_1" 
                name="field_52a_1" 
                value={formData.field_52a_1} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_52a_2">:52A: Ordering Institution Bank Name</label>
              <input 
                type="text" 
                id="field_52a_2" 
                name="field_52a_2" 
                value={formData.field_52a_2} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_52a_3">:52A: Ordering Institution Bank Address</label>
              <input 
                type="text" 
                id="field_52a_3" 
                name="field_52a_3" 
                value={formData.field_52a_3} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>
        
        {/* Correspondent Banks Section */}
        <div className="form-row">
          <div className="form-section">
            <h3>Correspondent Banks</h3>
            
            <div className="form-group">
              <label htmlFor="field_53a">:53A: Sender's Correspondent</label>
              <input 
                type="text" 
                id="field_53a" 
                name="field_53a" 
                value={formData.field_53a} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_54a">:54A: Receiver's Correspondent</label>
              <input 
                type="text" 
                id="field_54a" 
                name="field_54a" 
                value={formData.field_54a} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_56a">:56A: Intermediary</label>
              <input 
                type="text" 
                id="field_56a" 
                name="field_56a" 
                value={formData.field_56a} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Beneficiary Bank</h3>
            
            <div className="form-group">
              <label htmlFor="field_57a_1">:57A: Account with Institution Name</label>
              <input 
                type="text" 
                id="field_57a_1" 
                name="field_57a_1" 
                value={formData.field_57a_1} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_57a_2">:57A: Account with Institution Address</label>
              <input 
                type="text" 
                id="field_57a_2" 
                name="field_57a_2" 
                value={formData.field_57a_2} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_57a_3">:57A: Account with Institution Swift Code</label>
              <div className="input-with-button">
                <input 
                  type="text" 
                  id="field_57a_3" 
                  name="field_57a_3" 
                  value={formData.field_57a_3} 
                  onChange={handleChange} 
                />
                <button type="button" onClick={() => alert("Swift code validation would happen here")}>
                  Validate
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Beneficiary Section */}
        <div className="form-row">
          <div className="form-section">
            <h3>Beneficiary</h3>
            
            <div className="form-group">
              <label htmlFor="field_59_1">:59: Beneficiary Name</label>
              <input 
                type="text" 
                id="field_59_1" 
                name="field_59_1" 
                value={formData.field_59_1} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_59_2">:59: Beneficiary Account</label>
              <input 
                type="text" 
                id="field_59_2" 
                name="field_59_2" 
                value={formData.field_59_2} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="field_70">:70: Remittance Information</label>
              <input 
                type="text" 
                id="field_70" 
                name="field_70" 
                value={formData.field_70} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_71a">:71A: Details of Charges</label>
              <input 
                type="text" 
                id="field_71a" 
                name="field_71a" 
                value={formData.field_71a} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_72">:72: Sender to Receiver Information</label>
              <input 
                type="text" 
                id="field_72" 
                name="field_72" 
                value={formData.field_72} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="field_77b">:77B: Regulatory Reporting</label>
              <input 
                type="text" 
                id="field_77b" 
                name="field_77b" 
                value={formData.field_77b} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>
        
        {/* Signatures Section */}
        <div className="form-row">
          <div className="form-section">
            <h3>Left Side</h3>
            
            <div className="form-group">
              <label htmlFor="senderSignature">Left Signature</label>
              <input 
                type="file" 
                id="senderSignature" 
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, 'senderSignature')} 
              />
              {formData.senderSignature && (
                <img 
                  src={formData.senderSignature} 
                  alt="Left Signature" 
                  style={{ maxWidth: '150px', height: '60px', objectFit: 'contain', marginTop: '10px' }} 
                />
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="bankOfficerSignature">Left Stamp</label>
              <input 
                type="file" 
                id="bankOfficerSignature" 
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, 'bankOfficerSignature')} 
              />
              {formData.bankOfficerSignature && (
                <img 
                  src={formData.bankOfficerSignature} 
                  alt="Left Stamp" 
                  style={{ maxWidth: '150px', height: '80px', objectFit: 'contain', marginTop: '10px' }} 
                />
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Right Side</h3>
            
            <div className="form-group">
              <label htmlFor="receiverSignature">Right Signature</label>
              <input 
                type="file" 
                id="receiverSignature" 
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, 'receiverSignature')} 
              />
              {formData.receiverSignature && (
                <img 
                  src={formData.receiverSignature} 
                  alt="Right Signature" 
                  style={{ maxWidth: '150px', height: '60px', objectFit: 'contain', marginTop: '10px' }} 
                />
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="bankManagerSignature">Right Stamp</label>
              <input 
                type="file" 
                id="bankManagerSignature" 
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, 'bankManagerSignature')} 
              />
              {formData.bankManagerSignature && (
                <img 
                  src={formData.bankManagerSignature} 
                  alt="Right Stamp" 
                  style={{ maxWidth: '150px', height: '80px', objectFit: 'contain', marginTop: '10px' }} 
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">MAKE A PAYMENT NOW!</button>
        </div>
      </form>

      {/* Add this loader component right before the closing form tag */}
      {isSubmitting && (
        <div className="form-overlay">
          <div className="loader-container">
            <div className="loader"></div>
            <p className="loader-text">Processing Payment</p>
            <p className="loader-subtext">Please wait while we generate your receipt...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwiftMT103Form; 