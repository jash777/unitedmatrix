import React, { useEffect, createContext, useState, useContext } from 'react';
import {senderDatas} from '../utils'

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
    const [transactionData, setTransactionData] = useState({
        // Transaction reference and details
        referencecode: '',
        uetr: '',
        instructionType: 'MT103',
        transactionDate: new Date().toISOString(),
        
        // Sender information
        senderSwiftCode: '',
        senderBankName: '',
        senderBankAddress: '',
        senderAccountName: '',
        senderAccountNumber: '',
        
        // Receiver information
        receiverSwiftCode: '',
        receiverBankName: '',
        receiverBankAddress: '',
        receiverName: '',
        receiverAccountNumber: '',
        
        // Transaction details
        currency: '',
        amount: '',
        bankOperationCode: '',
        
        // Additional information
        remittanceInfo: '',
        detailsOfCharges: '',
        
        // Selected sender info
        selectedSenderInfo: null,
        
        // Additional fields for print forms
        messageReference: '',
        swiftCoverageInternalNumber: '',
        confirmedAck: '',
        debitAuthorized: '',
        accountDebited: '',
        
        // For PrintForm2
        iban: '',
        bic: '',
        senderReference: '',
        receiverReference: '',
        isohk: '',
        description: '',
        
        // Network delivery info
        networkDeliveryStatus: '',
        prioritydelivery: '',
        messageInputReference: '',
        messageOutputReference: '',
        uetrcode: '',
        trackingCode: ''
    });

    // Create a function to update the transaction data
    const updateTransactionData = (newData) => {
        console.log("Updating transaction data with:", newData);
        setTransactionData(prevData => ({
            ...prevData,
            ...newData
        }));
    };

    return (
        <TransactionContext.Provider value={{ 
            ...transactionData, 
            setTransactionData: updateTransactionData 
        }}>
            {children}
        </TransactionContext.Provider>
    );
};

export default TransactionProvider;
