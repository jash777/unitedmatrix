import React, { useEffect, useState } from 'react'
import "./PrintForm3.css"
import logo from '../assets/banklogo.png'
import Barcode from 'react-barcode';
import { v4 as uuidv4 } from 'uuid';
import { useTransaction } from '../context/transactionContext'
import { generateSwiftMessage } from '../utils/swiftMessageGenerator';

export const PrintForm3 = () => {
    const {
        accountNumber = '',
        instructionType = 'MT103',
        transactionDate = new Date().toISOString(),
        iban = '',
        senderReference = '',
        senderBankName = '',
        senderAccountNumber = '',
        bic = '',
        receiverReference = '',
        receiverName = '',
        receiverAgentClient = '',
        receiverAccountNumber = '',
        received = '',
        amount = '',
        currency = '',
        participant = '',
        isohk = '',
        keyedby = '',
        keyedbyfulldate = '',
        releasedby = '',
        releasedbyfulldate = '',
        cancelledby = '',
        cancelledbyfulldate = '',
        receivedby = '',
        receivedbyfulldate = '',
        referencecode = '',
        description = '',
        recipientcountry = '',
        needSignature = false,
        needBankStamp = false,
        senderAccountName = '',
        senderBankAddress = '',
        senderSwiftCode = '',
        receiverBankName = '',
        receiverBankAddress = '',
        receiverAccountName = '',
        receiverSwiftCode = '',
        relatedReferenceCode = '',
        bankOperationCode = '',
        trackingCode = '',
        networkDeliveryStatus = '',
        prioritydelivery = '',
        messageInputReference = '',
        messageOutputReference = '',
        uetrcode = '',
        messageReference = '',
        selectedSenderInfo = {},
        setSelectedSenderInfo = () => {},
        setReceiverSwiftCode = () => {},
        setReceiverBankName = () => {},
        setAmount = () => {},
        setCurrency = () => {},
        setTransactionDate = () => {},
        setReferencecode = () => {},
        setNetworkDeliveryStatus = () => {},
        setPrioritydelivery = () => {},
        setMessageInputReference = () => {},
        setMessageOutputReference = () => {},
        setUetrcode = () => {},
        setMessageReference = () => {},
        setTrackingCode = () => {},
        senderSignature = '',
        receiverSignature = '',
        bankOfficerSignature = '',
        bankManagerSignature = '',
    } = useTransaction();

    const [transferData, setTransferData] = useState(null);
    const [swiftCoverageInternalNumber, setSwiftCoverageInternalNumber] = useState('');
    const [confirmedAck, setConfirmedAck] = useState('');
    const [debitAuthorized, setDebitAuthorized] = useState('');
    const [accountDebited, setAccountDebited] = useState('');
    const [swiftMessage, setSwiftMessage] = useState('');

    const transactionFullDate = transactionDate ? transactionDate.substring(0, 10) : '';
    const transactionFullTime = transactionDate ? transactionDate.substring(11, transactionDate.length) : '';

    // Auto-generate all the required fields on component mount
    useEffect(() => {
        generateTransactionReferences();
    }, []);

    // Function to generate all transaction references and codes
    const generateTransactionReferences = () => {
        // Generate TRN (Transaction Reference Number) if not already set
        if (!referencecode) {
            const dateX = new Date().toISOString();
            const dateY = hashCode(dateX);
            const swiftCode = selectedSenderInfo?.SwiftCode || senderSwiftCode || 'SWIFT';
            const prefix = swiftCode.substring(0, 2);
            const trn = prefix + crc32(dateX).toString().substring(1, 15);
            setReferencecode(trn);
        }

        // Generate Message Reference
        const msgRef = `REF${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
        setMessageReference(msgRef);

        // Generate Tracking Code
        const trackCode = generateRandomString(10).toUpperCase();
        setTrackingCode(trackCode);

        // Generate Network Delivery Status
        setNetworkDeliveryStatus('NETWORK DELIVERY AUTHORIZED');

        // Generate Priority Delivery
        setPrioritydelivery('NORMAL');

        // Generate Message Input Reference (MIR)
        const dateV = formatDate(new Date());
        const mir = `${dateV} ${senderSwiftCode || selectedSenderInfo?.SwiftCode || 'SWIFT'} ${crc32(dateV)}`;
        setMessageInputReference(mir);

        // Generate Message Output Reference (MOR)
        const mor = `${dateV} ${receiverSwiftCode || 'SWIFT'} ${crc32(hashCode(dateV))}`;
        setMessageOutputReference(mor);

        // Generate UETR (Unique End-to-End Transaction Reference)
        const uetr = uuidv4();
        setUetrcode(uetr);

        // Generate SWIFT Coverage Internal Number
        const swiftCoverage = Math.floor(Math.random() * 9999999999).toString();
        setSwiftCoverageInternalNumber(swiftCoverage);

        // Generate Confirmed ACK
        const ack = Math.floor(Math.random() * 9999999999).toString();
        setConfirmedAck(ack);

        // Generate Debit Authorized
        const debit = Math.floor(Math.random() * 999999999).toString();
        setDebitAuthorized(debit);

        // Generate Account Debited
        const accDebited = Math.floor(Math.random() * 9999999999).toString();
        setAccountDebited(accDebited);
    };

    // Helper function to format date as YYYYMMDD HHMM
    const formatDate = (date) => {
        return date.getFullYear().toString() +
               (date.getMonth() + 1).toString().padStart(2, '0') +
               date.getDate().toString().padStart(2, '0') + ' ' +
               date.getHours().toString().padStart(2, '0') +
               date.getMinutes().toString().padStart(2, '0');
    };

    // Helper function to generate a simple hash code
    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    };

    // Simple CRC32 implementation for generating codes
    const crc32 = (str) => {
        let crc = 0 ^ (-1);
        for (let i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ crc32Table[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    };

    // CRC32 lookup table
    const crc32Table = (() => {
        let table = [];
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) {
                c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
            }
            table.push(c);
        }
        return table;
    })();

    // Generate random string of specified length
    const generateRandomString = (length) => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    useEffect(() => {
        // Listen for transfer data
        const handleTransferData = async (event) => {
            if (event.data.type === 'TRANSFER_DATA') {
                const data = event.data.data;
                setTransferData(data);
                
                // Update all the necessary context values
                setSelectedSenderInfo(data.senderInfo);
                setReceiverSwiftCode(data.beneficiaryInfo.bankBIC);
                setReceiverBankName(data.beneficiaryInfo.bankName);
                setAmount(data.amount);
                setCurrency(data.currency);
                setTransactionDate(data.valueDate);
                setReferencecode(data.transactionReference);
                
                // Generate all the other required fields
                generateTransactionReferences();

                // Generate PDF
                await generatePDF(data);
            }
        };

        window.addEventListener('message', handleTransferData);
        return () => window.removeEventListener('message', handleTransferData);
    }, []);

    const generatePDF = async (data) => {
        // Implementation of generatePDF function
    };

    // Generate SWIFT message when relevant data changes
    useEffect(() => {
        const message = generateSwiftMessage(
            senderSwiftCode || selectedSenderInfo?.SwiftCode,
            receiverSwiftCode,
            instructionType
        );
        setSwiftMessage(message);
    }, [senderSwiftCode, selectedSenderInfo?.SwiftCode, receiverSwiftCode, instructionType]);

    // Signature section component
    const SignatureSection = ({ isDarkBackground = false }) => (
        <div className='mt-4' style={{ pageBreakInside: 'avoid', width: '100%' }}>
            <div>
                <p>--------------------------------------------------------------------------------------------------------------</p>
            </div>
            <div className='flex justify-between mt-4' style={{ minHeight: '120px' }}>
                {/* Left side stamp and signature */}
                {(senderSignature || bankOfficerSignature) && (
                    <div className='text-center' style={{ width: '30%' }}>
                        {bankOfficerSignature && (
                            <img 
                                src={bankOfficerSignature} 
                                alt="Left Stamp" 
                                style={{ 
                                    maxWidth: '100%', 
                                    height: '80px', 
                                    objectFit: 'contain',
                                    marginBottom: '10px',
                                    filter: isDarkBackground ? 'invert(1)' : 'none'
                                }} 
                            />
                        )}
                        {senderSignature && (
                            <img 
                                src={senderSignature} 
                                alt="Left Signature" 
                                style={{ 
                                    maxWidth: '100%', 
                                    height: '60px', 
                                    objectFit: 'contain',
                                    filter: isDarkBackground ? 'invert(1)' : 'none'
                                }} 
                            />
                        )}
                    </div>
                )}

                {/* Right side stamp and signature */}
                {(receiverSignature || bankManagerSignature) && (
                    <div className='text-center' style={{ width: '30%' }}>
                        {bankManagerSignature && (
                            <img 
                                src={bankManagerSignature} 
                                alt="Right Stamp" 
                                style={{ 
                                    maxWidth: '100%', 
                                    height: '80px', 
                                    objectFit: 'contain',
                                    marginBottom: '10px',
                                    filter: isDarkBackground ? 'invert(1)' : 'none'
                                }} 
                            />
                        )}
                        {receiverSignature && (
                            <img 
                                src={receiverSignature} 
                                alt="Right Signature" 
                                style={{ 
                                    maxWidth: '100%', 
                                    height: '60px', 
                                    objectFit: 'contain',
                                    filter: isDarkBackground ? 'invert(1)' : 'none'
                                }} 
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className='flex justify-center items-center'>
            <div>
                <div id="form3-part1" className=''>
                    <div className='h-[350mm] w-[210mm] bg-white text-left px-8 mt-6'>
                        <div className='flex justify-between mt-3'>
                            <div className='flex items-center gap-4'>
                                <div className='w-56'>
                                    <img src={logo} alt=""/>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <Barcode value={referencecode} height={40} font='Courier New' fontSize={12} background={'transparent'} width={1} marginTop={'25px'}/>
                            </div>
                        </div>

                        <div>
                            <p><span>FROM: <span className='ml-[40px]'>{selectedSenderInfo?.SwiftCode || senderSwiftCode}</span><span className='ml-4'>{transactionFullDate}</span></span></p>
                            <p className='-mt-1'><span>TO: <span className='ml-[52px]'>{receiverSwiftCode}</span><span className='ml-4'>{transactionFullTime}</span></span></p>
                        </div>

                        <div>
                            <p>---------------------------------------------------------------------------------------------</p>
                        </div>

                        <div className='flex justify-between'>
                            <p>MESSAGE REFERENCE: <span>{messageReference}</span></p>
                            <p>CUSTOMER'S COPY</p>
                        </div>

                        <div>
                            <p>---------------------------------------------------------------------------------------------</p>
                        </div>

                        <div>
                            <p>--------------------------------INSTANCE TYPE AND TRANSMISSION-------------------------------</p>
                        </div>

                        <div>
                            <p><span className='font-normal'>***</span> <span>NOTIFICATION (TRANSMISSION) OF ORIGINAL SENT TO SWIFT (ACK)</span></p>
                            <p className='-mt-1'><span className='font-normal'>*** </span> <span>NETWORK DELIVERY STATUS</span><span className='text-white'>------</span><span className='mr-2'>:</span><span className='uppercase'>{networkDeliveryStatus}</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>PRIORITY/DELIVERY</span><span className='text-white'>------------</span><span className='mr-2'>:</span><span>{prioritydelivery}</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>MESSAGE INPUT REFERENCE</span><span className='text-white'>------</span><span className='mr-2'>:</span><span>{messageInputReference}</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>MESSAGE OUTPUT REFERENCE</span><span className='text-white'>-----</span><span className='mr-2'>:</span><span>{messageOutputReference}</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>MESSAGE UETR PRIVATE CODE</span><span className='text-white'>----</span><span className='mr-2'>:</span><span>{uetrcode}</span></p>
                        </div>

                        <div>
                            <p>------------------------------------SWIFT MESSAGE READER------------------------------------</p>
                        </div>
                        
                        <div>
                            <p className='-mt-1'>SWIFT INPUT: <span className='mr-2'>{instructionType}</span></p>
                            <div>
                                <p className='-mt-1'>FROM:</p>
                                <p className='-mt-1'>***SENDER<span className='text-white'>-------------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.SwiftCode}</span></p>
                                <p className='-mt-1'>***BANK NAME<span className='text-white'>----------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.BankName}</span></p>
                                <p className='-mt-1'>***BANK ADDRESS<span className='text-white'>-------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.BankAddress}</span></p>
                                <p className='-mt-1'>***ACCOUNT NAME<span className='text-white'>-------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.AccountName}</span></p>
                                <p className='-mt-1'>***ACCOUNT NUMBER<span className='text-white'>-----</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.AccountNumber}</span></p>
                                <p className='-mt-1'>***SWIFT CODE<span className='text-white'>---------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.SwiftCode}</span></p>
                            </div>
                            <div>
                                <p className='-mt-1'>TO:</p>
                                <p className='-mt-1'>***BANK NAME<span className='text-white'>----------</span><span className='mr-2'>:</span><span>{receiverBankName}</span></p>
                                <div className="flex">
                                    <p className='-mt-1 inline'>***BANK&nbsp;ADDRESS<span className='text-white'>-------</span><span className='mr-2'>:</span></p>
                                    <span className='inline-block'>{receiverBankAddress}</span>
                                </div>
                                <p className='-mt-1'>***ACCOUNT NAME<span className='text-white'>-------</span><span className='mr-2'>:</span><span>{receiverAccountName}</span></p>
                                <p className='-mt-1'>***ACCOUNT NUMBER<span className='text-white'>-----</span><span className='mr-2'>:</span><span>{receiverAccountNumber}</span></p>
                                <p className='-mt-1'>***SWIFT CODE<span className='text-white'>---------</span><span className='mr-2'>:</span><span>{receiverSwiftCode}</span></p>
                            </div>
                        </div>

                        <div>
                            <p>----------------------------------------MESSAGE TEXT-----------------------------------------</p>
                        </div>

                        <div>
                            <p className='-mt-1'>*** F20:<span className='text-white'>------</span><span>TRANSACTION REFERENCE CODE</span><span className='text-white'>---------</span><span className='mr-2'>:</span><span>{referencecode}</span></p>
                            <p className='-mt-1'>*** F21:<span className='text-white'>------</span><span>RELATED REFERENCE</span><span className='text-white'>------------------</span><span className='mr-2'>:</span><span>{relatedReferenceCode}</span></p>
                            <p className='-mt-1'>*** F32B:<span className='text-white'>-----</span><span>BANK OPERATION CODE</span><span className='text-white'>----------------</span><span className='mr-2'>:</span><span>{bankOperationCode}</span></p>
                            <p className='-mt-1'>*** F32A:<span className='text-white'>-----</span><span>CURRENCY/INSTRUCTED</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span >DATE</span><span className='text-white'>-------------------------------</span><span className='mr-2'>:</span><span>{transactionFullDate}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>CURRENCY</span><span className='text-white'>---------------------------</span><span className='mr-2 uppercase'>:</span><span>{currency}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>AMOUNT</span><span className='text-white'>-----------------------------</span><span className='mr-2'>:</span><span>{amount}</span></p>

                            <p className='-mt-1'>*** F33B:<span className='text-white'>-----</span><span>CURRENCY/ORIGINAL ORDERED AMOUNT</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>CURRENCY</span><span className='text-white'>---------------------------</span><span className='mr-2 uppercase'>:</span><span>{currency}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>AMOUNT</span><span className='text-white'>-----------------------------</span><span className='mr-2'>:</span><span>{amount}</span></p>

                            <p className='-mt-1'>*** F50K:<span className='text-white'>-----</span><span>ORDERING CUSTOMER-NAME & ADDRESS</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>ACCOUNT NUMBER</span><span className='text-white'>---------------------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.AccountNumber}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>ACCOUNT NAME</span><span className='text-white'>-----------------------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.AccountName}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>ADDRESS</span><span className='text-white'>----------------------------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.BankAddress}</span></p>

                            <p className='-mt-1'>*** F52A:<span className='text-white'>-----</span><span>ORDERING INSTITUTION</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>SENDER</span><span className='text-white'>-----------------------------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.SwiftCode}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>BANK NAME</span><span className='text-white'>--------------------------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.BankName}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>BANK ADDRESS</span><span className='text-white'>-----------------------</span><span className='mr-2'>:</span><span>{selectedSenderInfo?.BankAddress}</span></p>

                            <p className='-mt-1'>*** F57A:<span className='text-white'>-----</span><span>ACCOUNT WITH INSTITUTION</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>RECEIVER SWIFT</span><span className='text-white'>---------------------</span><span className='mr-2'>:</span><span>{receiverSwiftCode}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>BANK RECEIVER</span><span className='text-white'>----------------------</span><span className='mr-2'>:</span><span>{receiverBankName}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>RECEIVER BANK ADDRESS</span><span className='text-white'>--------------</span><span className='mr-2'>:</span><span>{receiverBankAddress}</span></p>

                            <p className='-mt-1'>*** F59:<span className='text-white'>------</span><span>BENEFICIARY CUSTOMER</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>ACCOUNT NAME</span><span className='text-white'>-----------------------</span><span className='mr-2'>:</span><span>{receiverName}</span></p>
                            <p className='-mt-1'><span className='text-white'>--------------</span><span>ACCOUNT NUMBER</span><span className='text-white'>---------------------</span><span className='mr-2'>:</span><span>{receiverAccountNumber}</span></p>

                            <p className='-mt-1'>*** F70: <span className='text-white'>-----</span><span>REMITTANCE OF INFORMATION</span><span className='text-white'>----------</span><span className='mr-2'>:</span><span>INVESTMENT</span></p>
                            <p className='-mt-1'>*** F71A: <span className='text-white'>----</span><span>DETAILS OF CHARGES</span><span className='text-white'>-----------------</span><span className='mr-2'>:</span><span>OUR</span></p>
                            <p className='-mt-1'>*** F77B: <span className='text-white'>----</span><span>REGULATORY REPORTING</span><span className='text-white'>---------------</span><span className='mr-2'>:</span></p>
                            <div className='ml-[92px] -mt-1'>
                                <p className='uppercase'>
                                FUNDS ARE CLEAN AND CLEAR, OF NON-CRIMINAL ORIGIN AND ARE PAYABLE IN CASH IMMEDIATELY UPON RECEIPT BY THE BANK.
                                </p>
                            </div>
                        </div>

                        <div className='mt-2'>
                            <p>---------------------------------------MESSAGE TRAILER---------------------------------------</p>
                        </div>

                        <div className='mb-4'>
                            <p className='-mt-1'>CHK: {isohk}</p>
                            <p className='-mt-1'>PKI-SIGNATURE: 0</p>
                            <p className='-mt-1'>TRACKING CODE: {trackingCode}</p>
                        </div>

                        {/* First page Break here end of first page */}
                        <div style={{ 
                            position: 'relative',
                            marginTop: 'auto',
                            bottom: '20px',
                            width: '100%',
                            pageBreakAfter: 'always'
                        }}>
                            <SignatureSection />
                        </div>
                    </div>
                </div>

                {/* Start of second page with INTERVENTIONS */}
                <div id="form3-part2" className=''>
                    <div className='h-[297mm] w-[210mm] bg-white text-left px-8 mt-8'>
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='w-60'>
                                    <img src={logo}/>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <Barcode value={referencecode} height={40} font='Courier New' fontSize={12} background={'transparent'} width={1} marginTop={'25px'}/>
                            </div>
                        </div>

                        <div>
                            <p>----------------------------------------INTERVENTIONS-------------------------------------------</p>
                        </div>
                        
                        <div>
                            <p className='-mt-1 mr-2 uppercase'>CONFIRMED AND RECEIVED</p>
                            <p className='-mt-1 mr-2'>TRANSACTION STATUS: <span>{'APPROVED'}</span></p>
                            <p className='-mt-1 mr-2'>SWIFT MESSAGE: <span>{instructionType}</span></p>
                            <p className='-mt-1 mr-2'>SWIFT COVERAGE: <span>{'YES'}</span></p>
                            <p className='-mt-1 mr-2'>CATEGORY: <span>{'NETWORK REPORT'}</span></p>
                            <p className='-mt-1 mr-2'>CREATION DATE & TIME: <span>{transactionFullDate} T {transactionFullTime}</span></p>
                            <p className='-mt-1 mr-2'>APPLICATION: <span>{'SWIFT'}</span></p>
                            <p className='-mt-1 mr-2'>OPERATION: <span>{'SYSTEM'}</span></p>
                            <p className='-mt-1 mr-2'>RECEIVER: <span>{receiverSwiftCode}</span></p>
                            <p className='-mt-1 mr-2'>TEXT: <span>{swiftMessage}</span></p>
                        </div>

                        <div className='text-center mt-4'>
                            <p>ANSWERBACK AND ACKNOWLEDGMENT MESSAGE AUTOMATED FILE TRANSFER (AFT) GATEWAY RESPONSE VALIDATION
                                SERVICE PROVIDER LOG/APPLICATION GENERATED REPORT ACKNOWLEDGMENT AND AUTHENTICATION
                                ACK/NAG DELIVERY FTA/FTI CONFIRMATION STATEMENT PASS/ACK STATUS
                            </p>
                        </div>

                        <div className='mt-4'>
                            <p>0050 CNT, ------------------------------------------------------------------- VALID</p>
                            <p>0060 RFF-DTM, --------------------------------------------------------------- VALID</p>
                            <p>0070 RFF, ------------------------------------------------------------------- VALID</p>
                            <p>0080 DTM, ------------------------------------------------------------------- VALID</p>
                            <p>0090 NAD-CTA-COM, ----------------------------------------------------------- VALID</p>
                            <p>0100 NAD, ------------------------------------------------------------------- VALID</p>
                            <p>0120 COM, ------------------------------------------------------------------- VALID</p>
                            <p>0130 ERC-FTX-5G4, ----------------------------------------------------------- VALID</p>
                            <p>0140 ERC, ------------------------------------------------------------------- VALID</p>
                            <p>0150 FTX, ------------------------------------------------------------------- VALID</p>
                            <p>0160 RFF-FTX, --------------------------------------------------------------- VALID</p>
                            <p>0170 REF, ------------------------------------------------------------------- VALID</p>
                            <p>0180 FTX, ------------------------------------------------------------------- VALID</p>
                            <p>0190 UNT, ------------------------------------------------------------------- VALID</p>
                        </div>

                        <div className='mt-4'>
                            <p className='-mt-1 mr-2'>{'{XMT DELIVERY REPORT}'} <span>{}</span></p>
                            <p className='-mt-1 mr-2'>MESSAGE TYPE: <span>{instructionType || 'MT103'}</span></p>
                            <p className='-mt-1 mr-2'>PRIORITY: <span>{'URGENT'}</span></p>
                            <p className='-mt-1 mr-2'>RECEIVED: <span>{receiverSwiftCode}</span></p>
                            <p className='-mt-1 mr-2'>TRANSACTION REFERENCE NUMBER: <span>{referencecode}</span></p>
                            <p className='-mt-1 mr-2'>TRANSACTION STATUS: <span>{'APPROVED'}</span></p>
                            <p className='-mt-1 mr-2'>AMOUNT TRANSFERRED: <span>{amount}</span></p>
                            <p className='-mt-1 mr-2'>INPUT-OUTPUT: <span>{'ACK NAK DUP AUTH'}</span></p>
                            <p className='-mt-1 mr-2'>SWIFT COVERAGE INTERNAL NUMBER: <span>{swiftCoverageInternalNumber}</span></p>
                            <p className='-mt-1 mr-2'>CONFIRMED ACK: <span>{confirmedAck}</span></p>
                            <p className='-mt-1 mr-2'>DEBIT AUTHORIZED: <span>{debitAuthorized}</span></p>
                            <p className='-mt-1 mr-2'>ACCOUNT DEBITED: <span>{accountDebited}</span></p>
                        </div>

                        <div>
                            <p>---------------------------------CONFIRMED---------------------------------</p>
                        </div>

                        <div>
                            <p className='-mt-1 mr-2'>TRANSACTION STATUS: <span>{'APPROVED'}</span></p>
                            <p className='-mt-1 mr-2'>AMOUNT TRANSFERRED: <span>{amount}</span></p>
                            <p className='-mt-1 mr-2'>DATE OF EXECUTION: <span>{transactionFullDate} T {transactionFullTime}</span></p>
                        </div>

                        <div>
                            <p>---------------------------------END OF TRANSMISSION---------------------------------</p>
                        </div>
                        <SignatureSection />
                    </div>
                </div>

                <div id="form3-part3" className=''>
                    <div className='h-[350mm] w-[210mm] bg-black text-white uppercase text-left px-8 mt-8'>
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='w-60'>
                                    <img src={logo}/>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <Barcode value={referencecode} height={40} font='Courier New' fontSize={12} width={1} background={'transparent'} lineColor='#ffffff' marginTop={'25px'}/>
                            </div>
                        </div>

                        <div>
                            <p><span>FROM: <span className='ml-[40px]'>{senderSwiftCode || selectedSenderInfo?.SwiftCode}</span><span className='ml-4'>{transactionFullDate}</span></span></p>
                            <p className='-mt-1'><span>TO: <span className='ml-[52px]'>{receiverSwiftCode}</span><span className='ml-4'>{transactionFullTime}</span></span></p>
                        </div>

                        <div>
                            <p>---------------------------------------------------------------------------------------------</p>
                        </div>

                        <div className='flex justify-between'>
                            <p>MESSAGE REFERENCE: <span>{messageReference}</span></p>
                            <p>CUSTOMER'S COPY</p>
                        </div>

                        <div>
                            <p>---------------------------------------------------------------------------------------------</p>
                        </div>

                        <div>
                            <p>---------------------------------INSTANCE TYPE AND TRANSMISSION---------------------------------</p>
                        </div>

                        <div>
                            <p><span className='font-normal'>***</span> <span>NOTIFICATION (TRANSMISSION) OF ORIGINAL SENT TO SWIFT (ACK)</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>NETWORK DELIVERY STATUS</span><span className='text-black'>------</span><span className='mr-2'>:</span><span className='uppercase'>{networkDeliveryStatus}</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>PRIORITY/DELIVERY</span><span className='text-black'>------------</span><span className='mr-2'>:</span><span>{prioritydelivery}</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>MESSAGE INPUT REFERENCE</span><span className='text-black'>------</span><span className='mr-2'>:</span><span>{messageInputReference}</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>MESSAGE OUTPUT REFERENCE</span><span className='text-black'>-----</span><span className='mr-2'>:</span><span>{messageOutputReference}</span></p>
                            <p className='-mt-1'><span className='font-normal'>***</span> <span>MESSAGE UETR PRIVATE CODE</span><span className='text-black'>----</span><span className='mr-2'>:</span><span>{uetrcode}</span></p>
                        </div>

                        <div>
                            <p>---------------------------------SWIFT MESSAGE READER---------------------------------</p>
                        </div>
                        
                        <div>
                            <p className='-mt-1'>SWIFT INPUT: <span className='mr-2'>{instructionType}</span></p>
                            <div>
                                <p className='-mt-1'>FROM:</p>
                                <p className='-mt-1'>***SENDER<span className='text-black'>-------------</span><span className='mr-2'>:</span><span>{senderSwiftCode || selectedSenderInfo?.SwiftCode}</span></p>
                                <p className='-mt-1'>***BANK NAME<span className='text-black'>----------</span><span className='mr-2'>:</span><span>{senderBankName || selectedSenderInfo?.BankName}</span></p>
                                <p className='-mt-1'>***BANK ADDRESS<span className='text-black'>-------</span><span className='mr-2'>:</span><span>{senderBankAddress || selectedSenderInfo?.BankAddress}</span></p>
                                <p className='-mt-1'>***ACCOUNT NAME<span className='text-black'>-------</span><span className='mr-2'>:</span><span>{senderAccountName || selectedSenderInfo?.AccountName}</span></p>
                                <p className='-mt-1'>***ACCOUNT NUMBER<span className='text-black'>-----</span><span className='mr-2'>:</span><span>{senderAccountNumber || selectedSenderInfo?.AccountNumber}</span></p>
                                <p className='-mt-1'>***SWIFT CODE<span className='text-black'>---------</span><span className='mr-2'>:</span><span>{senderSwiftCode || selectedSenderInfo?.SwiftCode}</span></p>
                            </div>
                            <div>
                                <p className='-mt-1'>TO:</p>
                                <p className='-mt-1'>***BANK NAME<span className='text-black'>----------</span><span className='mr-2'>:</span><span>{receiverBankName}</span></p>
                                <div className="flex">
                                    <p className='-mt-1 inline'>***BANK&nbsp;ADDRESS<span className='text-black'>--------</span><span className='mr-2'>:</span></p>
                                    <span className='inline-block'>{receiverBankAddress}</span>
                                </div>
                                <p className='-mt-1'>***ACCOUNT NAME<span className='text-black'>-------</span><span className='mr-2'>:</span><span>{receiverAccountName}</span></p>
                                <p className='-mt-1'>***ACCOUNT NUMBER<span className='text-black'>-----</span><span className='mr-2'>:</span><span>{receiverAccountNumber}</span></p>
                                <p className='-mt-1'>***SWIFT CODE<span className='text-black'>---------</span><span className='mr-2'>:</span><span>{receiverSwiftCode}</span></p>
                            </div>
                        </div>

                        <div>
                            <p>---------------------------------MESSAGE TEXT---------------------------------</p>
                        </div>

                        <div>
                            <p className='-mt-1'>*** F20:<span className='text-black'>------</span><span>TRANSACTION REFERENCE CODE</span><span className='text-black'>---------</span><span className='mr-2'>:</span><span>{referencecode}</span></p>
                            <p className='-mt-1'>*** F21:<span className='text-black'>------</span><span>RELATED REFERENCE</span><span className='text-black'>------------------</span><span className='mr-2'>:</span><span>{relatedReferenceCode}</span></p>
                            <p className='-mt-1'>*** F32B:<span className='text-black'>-----</span><span>BANK OPERATION CODE</span><span className='text-black'>----------------</span><span className='mr-2'>:</span><span>{bankOperationCode || 'CRED'}</span></p>
                            <p className='-mt-1'>*** F32A:<span className='text-black'>-----</span><span>CURRENCY/INSTRUCTED</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span >DATE</span><span className='text-black'>-------------------------------</span><span className='mr-2'>:</span><span>{transactionFullDate}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>CURRENCY</span><span className='text-black'>---------------------------</span><span className='mr-2 uppercase'>:</span><span>{currency}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>AMOUNT</span><span className='text-black'>-----------------------------</span><span className='mr-2'>:</span><span>{amount}</span></p>

                            <p className='-mt-1'>*** F33B:<span className='text-black'>-----</span><span>CURRENCY/ORIGINAL ORDERED AMOUNT</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>CURRENCY</span><span className='text-black'>---------------------------</span><span className='mr-2 uppercase'>:</span><span>{currency}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>AMOUNT</span><span className='text-black'>-----------------------------</span><span className='mr-2'>:</span><span>{amount}</span></p>

                            <p className='-mt-1'>*** F50K:<span className='text-black'>-----</span><span>ORDERING CUSTOMER-NAME & ADDRESS</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>ACCOUNT NUMBER</span><span className='text-black'>---------------------</span><span className='mr-2'>:</span><span>{senderAccountNumber || selectedSenderInfo?.AccountNumber}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>ACCOUNT NAME</span><span className='text-black'>-----------------------</span><span className='mr-2'>:</span><span>{senderAccountName || selectedSenderInfo?.AccountName}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>ADDRESS</span><span className='text-black'>----------------------------</span><span className='mr-2'>:</span><span>{senderBankAddress || selectedSenderInfo?.BankAddress}</span></p>

                            <p className='-mt-1'>*** F52A:<span className='text-black'>-----</span><span>ORDERING INSTITUTION</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>SENDER</span><span className='text-black'>-----------------------------</span><span className='mr-2'>:</span><span>{senderSwiftCode || selectedSenderInfo?.SwiftCode}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>BANK NAME</span><span className='text-black'>--------------------------</span><span className='mr-2'>:</span><span>{senderBankName || selectedSenderInfo?.BankName}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>BANK ADDRESS</span><span className='text-black'>-----------------------</span><span className='mr-2'>:</span><span>{senderBankAddress || selectedSenderInfo?.BankAddress}</span></p>

                            <p className='-mt-1'>*** F57A:<span className='text-black'>-----</span><span>ACCOUNT WITH INSTITUTION</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>RECEIVER SWIFT</span><span className='text-black'>---------------------</span><span className='mr-2'>:</span><span>{receiverSwiftCode}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>BANK RECEIVER</span><span className='text-black'>----------------------</span><span className='mr-2'>:</span><span>{receiverBankName}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>RECEIVER BANK ADDRESS</span><span className='text-black'>--------------</span><span className='mr-2'>:</span><span>{receiverBankAddress}</span></p>

                            <p className='-mt-1'>*** F59:<span className='text-black'>------</span><span>BENEFICIARY CUSTOMER</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>ACCOUNT NAME</span><span className='text-black'>-----------------------</span><span className='mr-2'>:</span><span>{receiverName}</span></p>
                            <p className='-mt-1'><span className='text-black'>--------------</span><span>ACCOUNT NUMBER</span><span className='text-black'>---------------------</span><span className='mr-2'>:</span><span>{receiverAccountNumber}</span></p>

                            <p className='-mt-1'>*** F70: <span className='text-black'>-----</span><span>REMITTANCE OF INFORMATION</span><span className='text-black'>----------</span><span className='mr-2'>:</span><span>INVESTMENT</span></p>
                            <p className='-mt-1'>*** F71A: <span className='text-black'>----</span><span>DETAILS OF CHARGES</span><span className='text-black'>-----------------</span><span className='mr-2'>:</span><span>OUR</span></p>
                            <p className='-mt-1'>*** F77B: <span className='text-black'>----</span><span>REGULATORY REPORTING</span><span className='text-black'>---------------</span><span className='mr-2'>:</span></p>
                            <div className='ml-[99px] -mt-1'>
                                <p className='uppercase'>
                                FUNDS ARE CLEAN AND CLEAR, OF NON-CRIMINAL ORIGIN AND ARE PAYABLE IN CASH IMMEDIATELY UPON RECEIPT BY THE BANK.
                                </p>
                            </div>
                        </div>

                        <div>
                            <p>---------------------------------MESSAGE TRAILER---------------------------------</p>
                        </div>

                        <div className='mb-4'>
                            <p className='-mt-1'>CHK: {isohk}</p>
                            <p className='-mt-1'>PKI-SIGNATURE: 0</p>
                            <p className='-mt-1'>TRACKING CODE: {trackingCode}</p>
                        </div>

                        {/* First page Break here end of first page */}
                        <div style={{ 
                            position: 'relative',
                            marginTop: 'auto',
                            bottom: '20px',
                            width: '100%',
                            pageBreakAfter: 'always'
                        }}>
                            <SignatureSection isDarkBackground={true} />
                        </div>
                    </div>
                </div>

                {/* Start of second black page with INTERVENTIONS */}
                <div id="form3-part4" className=''>
                    <div className='h-[297mm] w-[210mm] bg-black text-white uppercase text-left px-8 mt-8'>
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='w-60'>
                                    <img src={logo}/>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <Barcode value={referencecode} height={40} font='Courier New' fontSize={12} background={'transparent'} width={1} lineColor='#ffffff' marginTop={'25px'}/>
                            </div>
                        </div>

                        <div>
                            <p>---------------------------------INTERVENTIONS---------------------------------</p>
                        </div>

                        <div>
                            <p className='-mt-1 mr-2 uppercase'>CONFIRMED AND RECEIVED</p>
                            <p className='-mt-1 mr-2'>TRANSACTION STATUS: <span>{'APPROVED'}</span></p>
                            <p className='-mt-1 mr-2'>SWIFT MESSAGE: <span>{instructionType}</span></p>
                            <p className='-mt-1 mr-2'>SWIFT COVERAGE: <span>{'YES'}</span></p>
                            <p className='-mt-1 mr-2'>CATEGORY: <span>{'NETWORK REPORT'}</span></p>
                            <p className='-mt-1 mr-2'>CREATION DATE & TIME: <span>{transactionFullDate} T {transactionFullTime}</span></p>
                            <p className='-mt-1 mr-2'>APPLICATION: <span>{'SWIFT'}</span></p>
                            <p className='-mt-1 mr-2'>OPERATION: <span>{'SYSTEM'}</span></p>
                            <p className='-mt-1 mr-2'>RECEIVER: <span>{receiverSwiftCode}</span></p>
                            <p className='-mt-1 mr-2'>TEXT: <span>{swiftMessage}</span></p>
                        </div>

                        <div className='text-center mt-4'>
                            <p>ANSWERBACK AND ACKNOWLEDGMENT MESSAGE AUTOMATED FILE TRANSFER (AFT) GATEWAY RESPONSE VALIDATION
                                SERVICE PROVIDER LOG/APPLICATION GENERATED REPORT ACKNOWLEDGMENT AND AUTHENTICATION
                                ACK/NAG DELIVERY FTA/FTI CONFIRMATION STATEMENT PASS/ACK STATUS
                            </p>
                        </div>

                        <div className='mt-4'>
                            <p>0050 CNT, ------------------------------------------------------------------- VALID</p>
                            <p>0060 RFF-DTM, --------------------------------------------------------------- VALID</p>
                            <p>0070 RFF, ------------------------------------------------------------------- VALID</p>
                            <p>0080 DTM, ------------------------------------------------------------------- VALID</p>
                            <p>0090 NAD-CTA-COM, ----------------------------------------------------------- VALID</p>
                            <p>0100 NAD, ------------------------------------------------------------------- VALID</p>
                            <p>0120 COM, ------------------------------------------------------------------- VALID</p>
                            <p>0130 ERC-FTX-5G4, ----------------------------------------------------------- VALID</p>
                            <p>0140 ERC, ------------------------------------------------------------------- VALID</p>
                            <p>0150 FTX, ------------------------------------------------------------------- VALID</p>
                            <p>0160 RFF-FTX, --------------------------------------------------------------- VALID</p>
                            <p>0170 REF, ------------------------------------------------------------------- VALID</p>
                            <p>0180 FTX, ------------------------------------------------------------------- VALID</p>
                            <p>0190 UNT, ------------------------------------------------------------------- VALID</p>
                        </div>

                        <div className='mt-4'>
                            <p className='-mt-1 mr-2'>{'{XMT DELIVERY REPORT}'} <span>{}</span></p>
                            <p className='-mt-1 mr-2'>MESSAGE TYPE: <span>{instructionType || 'MT103'}</span></p>
                            <p className='-mt-1 mr-2'>PRIORITY: <span>{'URGENT'}</span></p>
                            <p className='-mt-1 mr-2'>RECEIVED: <span>{receiverSwiftCode}</span></p>
                            <p className='-mt-1 mr-2'>TRANSACTION REFERENCE NUMBER: <span>{referencecode}</span></p>
                            <p className='-mt-1 mr-2'>TRANSACTION STATUS: <span>{'APPROVED'}</span></p>
                            <p className='-mt-1 mr-2'>AMOUNT TRANSFERRED: <span>{amount}</span></p>
                            <p className='-mt-1 mr-2'>INPUT-OUTPUT: <span>{'ACK NAK DUP AUTH'}</span></p>
                            <p className='-mt-1 mr-2'>SWIFT COVERAGE INTERNAL NUMBER: <span>{swiftCoverageInternalNumber}</span></p>
                            <p className='-mt-1 mr-2'>CONFIRMED ACK: <span>{confirmedAck}</span></p>
                            <p className='-mt-1 mr-2'>DEBIT AUTHORIZED: <span>{debitAuthorized}</span></p>
                            <p className='-mt-1 mr-2'>ACCOUNT DEBITED: <span>{accountDebited}</span></p>
                        </div>

                        <div>
                            <p>---------------------------------CONFIRMED---------------------------------</p>
                        </div>

                        <div>
                            <p className='-mt-1 mr-2'>TRANSACTION STATUS: <span>{'APPROVED'}</span></p>
                            <p className='-mt-1 mr-2'>AMOUNT TRANSFERRED: <span>{amount}</span></p>
                            <p className='-mt-1 mr-2'>DATE OF EXECUTION: <span>{transactionFullDate} T {transactionFullTime}</span></p>
                        </div>

                        <div>
                            <p>---------------------------------END OF TRANSMISSION---------------------------------</p>
                        </div>
                        <SignatureSection isDarkBackground={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}