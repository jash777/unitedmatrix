import React, { useState, useEffect } from 'react';
import { useTransaction } from '../context/transactionContext';
import './MT103Form.css';

const MT103Form = ({ onSubmit }) => {
    const { 
        setTransactionDate,
        setSenderBankName,
        setSenderAccountNumber,
        setSenderAccountName,
        setSenderBankAddress,
        setSenderSwiftCode,
        setReceiverBankName,
        setReceiverBankAddress,
        setReceiverSwiftCode,
        setReceiverAccountName,
        setReceiverAccountNumber,
        setAmount,
        setCurrency,
        setDescription,
        setChargeBearer,
        setRegulatoryInfo,
        setTRN
    } = useTransaction();

    const [formData, setFormData] = useState({
        field_20: '',           // TRN will be set on component mount
        field_23b: 'CRED',     // Bank Operation Code
        field_32a_1: '',       // Value Date
        field_32a_2: 'EUR',    // Currency
        field_32a_3: '',       // Amount
        field_33b_1: '',       // Original Currency
        field_33b_2: '',       // Original Amount

        // Ordering Customer (Section 4)
        field_50a_1: '',      // Sender Name
        field_50a_2: '',     // Sender Account/IBAN
        field_52a_1: '',     // Sender Bank BIC
        field_52a_2: '',      // Sender Bank Name
        field_52a_3: '',      // Sender Bank Address

        // Intermediary & Beneficiary Bank (Section 5)
        field_56a: '',         // Intermediary Bank
        field_57a_1: '',       // Beneficiary Bank Name
        field_57a_2: '',       // Beneficiary Bank Address
        field_57a_3: '',       // Beneficiary Bank BIC

        // Beneficiary Information (Section 6)
        field_59_1: '',        // Beneficiary Name
        field_59_2: '',        // Beneficiary Account/IBAN

        // Payment Details (Section 7)
        field_70: '',          // Remittance Information
        field_71a: 'OUR',       // Details of Charges
        field_72: '',          // Sender to Receiver Info
        field_77b: '',          // Regulatory Reporting
    });

    // Generate TRN on component mount
    useEffect(() => {
        const generateTRN = async () => {
            try {
                // Call backend API to generate TRN
                const response = await fetch('/api/generate-trn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'MT103',
                        date: new Date().toISOString()
                    })
                });
                
                const data = await response.json();
                if (data.trn) {
                    setFormData(prev => ({
                        ...prev,
                        field_20: data.trn
                    }));
                    setTRN(data.trn); // Store in context
                }
            } catch (error) {
                console.error('Error generating TRN:', error);
                // Fallback TRN generation if API fails
                const fallbackTRN = `TRN${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
                setFormData(prev => ({
                    ...prev,
                    field_20: fallbackTRN
                }));
                setTRN(fallbackTRN);
            }
        };

        generateTRN();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Update context with all form values
        setTransactionDate(formData.field_32a_1);
        setSenderBankName(formData.field_52a_2);
        setSenderAccountNumber(formData.field_50a_2);
        setSenderAccountName(formData.field_50a_1);
        setSenderBankAddress(formData.field_52a_3);
        setSenderSwiftCode(formData.field_52a_1);
        setReceiverBankName(formData.field_57a_1);
        setReceiverBankAddress(formData.field_57a_2);
        setReceiverSwiftCode(formData.field_57a_3);
        setReceiverAccountName(formData.field_59_1);
        setReceiverAccountNumber(formData.field_59_2);
        setAmount(formData.field_32a_3);
        setCurrency(formData.field_32a_2);
        setDescription(formData.field_70);
        setChargeBearer(formData.field_71a);
        setRegulatoryInfo(formData.field_77b);

        // Store transaction in database
        saveTRNToDatabase(formData);

        onSubmit();
    };

    const saveTRNToDatabase = async (formData) => {
        try {
            await fetch('/api/save-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trn: formData.field_20,
                    dateOfExecution: formData.field_32a_1,
                    s_SwiftCode: formData.field_52a_1,
                    r_SwiftCode: formData.field_57a_3,
                    transactionType: 'MT103',
                    amount: formData.field_32a_3,
                    currency: formData.field_32a_2,
                    s_AccountNumber: formData.field_50a_2,
                    r_AccountNumber: formData.field_59_2
                })
            });
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="form-container">
            <div className="status-bar">
                <div className="status-indicator">
                    <span className="status-dot"></span>
                    SWIFT Network: Connected
                </div>
                <div className="status-indicator">
                    <span className="status-dot"></span>
                    Banking System: Online
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Transaction Details Section */}
                <div className="section">
                    <div className="section-header">
                        <div className="section-icon">1</div>
                        <h3>TRANSACTION DETAILS</h3>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">:20: Transaction Reference Number (TRN)</label>
                            <input 
                                type="text"
                                name="field_20"
                                value={formData.field_20}
                                readOnly
                                className="readonly-field"
                            />
                            <div className="field-info">Auto-generated unique reference number</div>
                        </div>
                    </div>
                </div>

                {/* Amount Section */}
                <div className="section">
                    <div className="section-header">
                        <div className="section-icon">2</div>
                        <h3>AMOUNT AND CURRENCY</h3>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">Value Date</label>
                            <input 
                                type="date"
                                name="field_32a_1"
                                value={formData.field_32a_1}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="required">Currency</label>
                            <select 
                                name="field_32a_2"
                                value={formData.field_32a_2}
                                onChange={handleChange}
                                required
                            >
                                <option value="EUR">EUR - Euro</option>
                                <option value="USD">USD - US Dollar</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="JPY">JPY - Japanese Yen</option>
                                <option value="CHF">CHF - Swiss Franc</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="required">Amount</label>
                            <input 
                                type="number"
                                name="field_32a_3"
                                value={formData.field_32a_3}
                                onChange={handleChange}
                                required
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                {/* Sender Information */}
                <div className="section">
                    <div className="section-header">
                        <div className="section-icon">3</div>
                        <h3>SENDER INFORMATION</h3>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">Sender Name</label>
                            <input 
                                type="text"
                                name="field_50a_1"
                                value={formData.field_50a_1}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="required">Sender Account/IBAN</label>
                            <input 
                                type="text"
                                name="field_50a_2"
                                value={formData.field_50a_2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">Sender Bank BIC</label>
                            <input 
                                type="text"
                                name="field_52a_1"
                                value={formData.field_52a_1}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="required">Sender Bank Name</label>
                            <input 
                                type="text"
                                name="field_52a_2"
                                value={formData.field_52a_2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="required">Sender Bank Address</label>
                            <input 
                                type="text"
                                name="field_52a_3"
                                value={formData.field_52a_3}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Receiver Information */}
                <div className="section">
                    <div className="section-header">
                        <div className="section-icon">4</div>
                        <h3>RECEIVER INFORMATION</h3>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">Beneficiary Name</label>
                            <input 
                                type="text"
                                name="field_59_1"
                                value={formData.field_59_1}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="required">Beneficiary Account/IBAN</label>
                            <input 
                                type="text"
                                name="field_59_2"
                                value={formData.field_59_2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">Beneficiary Bank Name</label>
                            <input 
                                type="text"
                                name="field_57a_1"
                                value={formData.field_57a_1}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="required">Beneficiary Bank Address</label>
                            <input 
                                type="text"
                                name="field_57a_2"
                                value={formData.field_57a_2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="required">Beneficiary Bank BIC</label>
                            <input 
                                type="text"
                                name="field_57a_3"
                                value={formData.field_57a_3}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="section">
                    <div className="section-header">
                        <div className="section-icon">5</div>
                        <h3>PAYMENT DETAILS</h3>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="required">Remittance Information</label>
                            <input 
                                type="text"
                                name="field_70"
                                value={formData.field_70}
                                onChange={handleChange}
                                required
                            />
                            <div className="field-info">Purpose of payment</div>
                        </div>
                        <div className="form-group">
                            <label className="required">Details of Charges</label>
                            <select 
                                name="field_71a"
                                value={formData.field_71a}
                                onChange={handleChange}
                                required
                            >
                                <option value="OUR">OUR - All charges paid by sender</option>
                                <option value="SHA">SHA - Shared charges</option>
                                <option value="BEN">BEN - All charges paid by beneficiary</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="security-notice">
                    <strong>IMPORTANT:</strong> Please verify all details before submitting.
                    Bank transfers are final and cannot be reversed.
                </div>

                <div className="form-footer">
                    <button type="submit" className="btn-submit">
                        PROCESS TRANSFER
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MT103Form; 