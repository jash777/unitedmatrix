import React from 'react';
import { useTransaction } from '../context/transactionContext';
import Barcode from 'react-barcode';
import logo from '../assets/banklogo.png';
import './PrintMT103Form.css';

const PrintMT103Form = () => {
  const {
    referencecode,
    instructionType,
    transactionDate,
    senderSwiftCode,
    senderBankName,
    senderBankAddress,
    senderAccountName,
    senderAccountNumber,
    receiverSwiftCode,
    receiverBankName,
    receiverBankAddress,
    receiverName,
    receiverAccountNumber,
    currency,
    amount,
    bankOperationCode,
    remittanceInfo,
    detailsOfCharges,
    description,
    selectedSenderInfo,
    senderSignature,
    receiverSignature,
    bankOfficerSignature,
    bankManagerSignature,
    uetrcode,
    messageReference,
    networkDeliveryStatus,
    prioritydelivery,
    messageInputReference,
    messageOutputReference,
    trackingCode,
    isohk
  } = useTransaction();

  const transactionFullDate = transactionDate ? transactionDate.substring(0, 10) : '';
  const transactionFullTime = transactionDate ? transactionDate.substring(11, 19) : '';

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
        {/* White version - First page */}
        <div id="mt103-part1" className='mt103-page'>
          <div className='h-[350mm] w-[210mm] bg-white text-left px-8 mt-6'>
            <div className='flex justify-between mt-3'>
              <div className='flex items-center gap-4'>
                <div className='w-56'>
                  <img src={logo} alt="Bank Logo"/>
                </div>
              </div>
              <div className='mt-2'>
                <Barcode 
                  value={referencecode} 
                  height={40} 
                  font='Courier New' 
                  fontSize={12} 
                  background={'transparent'} 
                  width={1} 
                  marginTop={'25px'}
                />
              </div>
            </div>

            <div className="mt103-header">
              <p>FROM: <span className='ml-[40px]'>{selectedSenderInfo?.SwiftCode || senderSwiftCode}</span><span className='ml-4'>{transactionFullDate}</span></p>
              <p className='-mt-1'>TO: <span className='ml-[52px]'>{receiverSwiftCode}</span><span className='ml-4'>{transactionFullTime}</span></p>
            </div>

            <div className="mt103-section">
              <p>---------------------------------------------------------------------------------------------</p>
              <div className='flex justify-between'>
                <p>MESSAGE REFERENCE: <span>{messageReference}</span></p>
                <p>CUSTOMER'S COPY</p>
              </div>
              <p>---------------------------------------------------------------------------------------------</p>
            </div>

            <div className="mt103-section">
              <p>--------------------------------INSTANCE TYPE AND TRANSMISSION-------------------------------</p>
              <p><span className='font-normal'>***</span> NOTIFICATION (TRANSMISSION) OF ORIGINAL SENT TO SWIFT (ACK)</p>
              <p className='-mt-1'><span className='font-normal'>***</span> NETWORK DELIVERY STATUS<span className='text-white'>------</span>: <span className='uppercase'>{networkDeliveryStatus}</span></p>
              <p className='-mt-1'><span className='font-normal'>***</span> PRIORITY/DELIVERY<span className='text-white'>------------</span>: <span>{prioritydelivery}</span></p>
              <p className='-mt-1'><span className='font-normal'>***</span> MESSAGE INPUT REFERENCE<span className='text-white'>------</span>: <span>{messageInputReference}</span></p>
              <p className='-mt-1'><span className='font-normal'>***</span> MESSAGE OUTPUT REFERENCE<span className='text-white'>-----</span>: <span>{messageOutputReference}</span></p>
              <p className='-mt-1'><span className='font-normal'>***</span> MESSAGE UETR PRIVATE CODE<span className='text-white'>----</span>: <span>{uetrcode}</span></p>
            </div>

            <div className="mt103-section">
              <p>------------------------------------SWIFT MESSAGE READER------------------------------------</p>
              <p className='-mt-1'>SWIFT INPUT: <span className='mr-2'>{instructionType}</span></p>
              
              <div className="mt103-subsection">
                <p className='-mt-1'>FROM:</p>
                <p className='-mt-1'>***SENDER<span className='text-white'>-------------</span>: <span>{selectedSenderInfo?.SwiftCode}</span></p>
                <p className='-mt-1'>***BANK NAME<span className='text-white'>----------</span>: <span>{selectedSenderInfo?.BankName}</span></p>
                <p className='-mt-1'>***BANK ADDRESS<span className='text-white'>-------</span>: <span>{selectedSenderInfo?.BankAddress}</span></p>
                <p className='-mt-1'>***ACCOUNT NAME<span className='text-white'>-------</span>: <span>{selectedSenderInfo?.AccountName}</span></p>
                <p className='-mt-1'>***ACCOUNT NUMBER<span className='text-white'>-----</span>: <span>{selectedSenderInfo?.AccountNumber}</span></p>
                <p className='-mt-1'>***SWIFT CODE<span className='text-white'>---------</span>: <span>{selectedSenderInfo?.SwiftCode}</span></p>
              </div>

              <div className="mt103-subsection">
                <p className='-mt-1'>TO:</p>
                <p className='-mt-1'>***BANK NAME<span className='text-white'>----------</span>: <span>{receiverBankName}</span></p>
                <p className='-mt-1'>***BANK ADDRESS<span className='text-white'>-------</span>: <span>{receiverBankAddress}</span></p>
                <p className='-mt-1'>***ACCOUNT NAME<span className='text-white'>-------</span>: <span>{receiverName}</span></p>
                <p className='-mt-1'>***ACCOUNT NUMBER<span className='text-white'>-----</span>: <span>{receiverAccountNumber}</span></p>
                <p className='-mt-1'>***SWIFT CODE<span className='text-white'>---------</span>: <span>{receiverSwiftCode}</span></p>
              </div>
            </div>

            <div className="mt103-section">
              <p>----------------------------------------MESSAGE TEXT-----------------------------------------</p>
              <p className='-mt-1'>*** F20: <span className='text-white'>------</span>TRANSACTION REFERENCE CODE<span className='text-white'>---------</span>: <span>{referencecode}</span></p>
              <p className='-mt-1'>*** F32A: <span className='text-white'>-----</span>CURRENCY/INSTRUCTED</p>
              <p className='-mt-1'><span className='text-white'>--------------</span>DATE<span className='text-white'>-------------------------------</span>: <span>{transactionFullDate}</span></p>
              <p className='-mt-1'><span className='text-white'>--------------</span>CURRENCY<span className='text-white'>---------------------------</span>: <span className='uppercase'>{currency}</span></p>
              <p className='-mt-1'><span className='text-white'>--------------</span>AMOUNT<span className='text-white'>-----------------------------</span>: <span>{amount}</span></p>
              
              <p className='-mt-1'>*** F50K: <span className='text-white'>-----</span>ORDERING CUSTOMER-NAME & ADDRESS</p>
              <p className='-mt-1'><span className='text-white'>--------------</span>ACCOUNT NUMBER<span className='text-white'>---------------------</span>: <span>{senderAccountNumber}</span></p>
              <p className='-mt-1'><span className='text-white'>--------------</span>ACCOUNT NAME<span className='text-white'>-----------------------</span>: <span>{senderAccountName}</span></p>
              <p className='-mt-1'><span className='text-white'>--------------</span>ADDRESS<span className='text-white'>----------------------------</span>: <span>{senderBankAddress}</span></p>

              <p className='-mt-1'>*** F59: <span className='text-white'>------</span>BENEFICIARY CUSTOMER</p>
              <p className='-mt-1'><span className='text-white'>--------------</span>ACCOUNT NAME<span className='text-white'>-----------------------</span>: <span>{receiverName}</span></p>
              <p className='-mt-1'><span className='text-white'>--------------</span>ACCOUNT NUMBER<span className='text-white'>---------------------</span>: <span>{receiverAccountNumber}</span></p>

              <p className='-mt-1'>*** F70: <span className='text-white'>-----</span>REMITTANCE INFORMATION<span className='text-white'>----------</span>: <span>{remittanceInfo}</span></p>
              <p className='-mt-1'>*** F71A: <span className='text-white'>----</span>DETAILS OF CHARGES<span className='text-white'>-----------------</span>: <span>{detailsOfCharges}</span></p>
            </div>

            <div className="mt103-section">
              <p>---------------------------------------MESSAGE TRAILER---------------------------------------</p>
              <p className='-mt-1'>CHK: {isohk}</p>
              <p className='-mt-1'>TRACKING CODE: {trackingCode}</p>
            </div>

            <SignatureSection />
          </div>
        </div>

        {/* Black version - Second page */}
        <div id="mt103-part2" className='mt103-page'>
          <div className='h-[297mm] w-[210mm] bg-black text-white uppercase text-left px-8 mt-8'>
            {/* Same content as above but with inverted colors */}
            {/* ... Copy the same structure but add bg-black and text-white classes ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintMT103Form;
