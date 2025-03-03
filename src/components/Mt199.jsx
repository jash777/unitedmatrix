import React from 'react'
import { useTransaction } from '../context/transactionContext'

import './Mt199.css'
import logo from '../assets/banklogo.png'
import Barcode from 'react-barcode';

const Mt199 = () => {
    const {accountNumber, instructionType, transactionDate, iban, senderReference, senderBankName, senderAccountNumber, bic, receiverReference, receiverName, 
        receiverAgentClient, receiverAccountNumber, received, amount, currency, participant, isohk, keyedby, keyedbufulldate, releasedby, releasedbyfulldate, cancelledby, cancelledbyfulldate, receivedby, receivedbyfulldate, referencecode, 
        description, recipientcountry, needSignature, needBankStamp, senderAccountName, senderBankAddress, senderSwiftCode, receiverBankName, receiverBankAddress, receiverAccountName, receiverSwiftCode,
        relatedReferenceCode, bankOperationCode, trackingCode, networkDeliveryStatus, prioritydelivery, messageInputReference, messageOutputReference, uetrcode, messageReference, selectedSenderInfo, mt199, checkSum
    } = useTransaction();

    const transactionFullDate = transactionDate.substring(0, 10);
    const transactionFullTime = transactionDate.substring(11, transactionDate.length)

  return (
    <div  className='flex justify-center items-center'>
        <div>
            <div id='mt199-part1' className='hidden'>
                <div className='bg-white h-auto w-[210mm] text-left px-12 pb-32 text-black uppercase font-semibold'>
                    <div className='flex justify-between'>
                        <div className='mt-8 -ml-2'>
                            <Barcode value={referencecode} height={40} font='Courier New' fontSize={12} background={'transparent'} width={1}/>
                        </div>
                        <div className='w-60'>
                            <img src={logo}/>
                        </div>
                    </div>

                    <div>
                        <p><span>FROM: <span className='ml-[40px]'>{selectedSenderInfo?.SwiftCode}</span><span className='ml-4'>{transactionFullDate}</span></span></p>
                        <p className='-mt-1'><span>TO: <span className='ml-[52px]'>{receiverSwiftCode}</span><span className='ml-4'>{transactionFullTime}</span></span></p>
                    </div>

                    <div>
                        <p>------------------------------------------------------------------------------------------------------</p>
                    </div>

                    <div className=''>
                        <p>LOCALSWIFTACKS: <span>{messageReference}***</span></p>
                    </div>

                    <div>
                        <p>---------------------------------------INSTANCE TYPE AND TRANSMISSION--------------------------------</p>
                    </div>

                    <div>
                        <p>*** <span>NOTIFICATION (TRANSMISSION) OF ORIGINAL SENT TO SWIFT (ACK)</span></p>
                        <p className='-mt-1'>*** <span>NETWORK DELIVERY STATUS</span><span className='text-white'>------</span><span className=' mr-2'>:</span><span className='uppercase'>{networkDeliveryStatus}</span></p>
                        <p className='-mt-1'>*** <span>PRIORITY/DELIVERY</span><span className='text-white'>------------</span><span className=' mr-2'>:</span><span>{prioritydelivery}</span></p>
                        <p className='-mt-1'>*** <span>MESSAGE INPUT REFERENCE</span><span className='text-white'>------</span><span className=' mr-2'>:</span><span>{messageInputReference}</span></p>
                    </div>

                    <div>
                        <p>--------------------------------------------SWIFT MESSAGE READER-------------------------------------</p>
                    </div>
                    
                    <div>
                        <p className='-mt-1'>SWIFT INPUT: <span className='mr-2'>{instructionType} - FUND CONFIRMATION</span></p>
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
                            <p className='-mt-1'>***BANK RECEIVER<span className='text-white'>------</span><span className='mr-2'>:</span><span>{receiverBankName}</span></p>
                            <div className="flex">
                                <p className='-mt-1 inline'>***BANK&nbsp;ADDRES<span className='text-white'>--------</span><span className='mr-2'>:</span></p>
                                <span className='inline-block'>{receiverBankAddress}</span>
                            </div>
                            <p className='-mt-1'>***ACCOUNT NAME<span className='text-white'>-------</span><span className='mr-2'>:</span><span>{receiverAccountName}</span></p>
                            <p className='-mt-1'>***ACCOUNT NUMBER<span className='text-white'>-----</span><span className='mr-2'>:</span><span>{receiverAccountNumber}</span></p>
                            <p className='-mt-1'>***SWIFT CODE<span className='text-white'>---------</span><span className='mr-2'>:</span><span>{receiverSwiftCode}</span></p>
                        </div>
                    </div>

                    <div>
                        <p>--------------------------------------------------MESSAGE TEXT---------------------------------------</p>
                    </div>

                    <div>
                        <p className='-mt-1'>:20: TRANSACTION REFERENCE NUMBER<span className='text-white'>----------</span><span className='mr-2'>:</span>{referencecode}</p>
                        <p className='-mt-1'>:20: RELATED REFERENCE<span className='text-white'>---------------------</span><span className='mr-2'>:</span>{relatedReferenceCode}</p>
                        <p className='-mt-1'>:79: NARRATIVE<span className='text-white'>-----------------------------</span><span className='mr-2'>:</span>{}</p>
                    </div>

                    <div id='mt199body' className='mt-4 w-full text-justify'>
                        <p>{mt199}</p>
                    </div>

                    <div>
                        <p>---------------------------------------------------------------------------------------------------</p>
                    </div>

                    <div>
                        <p className='-mt-1'>AUTHORIZED OFFICER 1: MR. PETER MUELLER, SENIOR BANK OFFICER (PIN: 29690)</p>
                        <p className='-mt-1'>AUTHORIZED OFFICER 2: MR. JAMES VON MOLTKE, CHIEF FINANCIAL OFFICER (PIN: 054082)</p>
                        <br />

                        <p>FOR AND ON BEHALF OF DEUTSCHE BANK AG</p>
                        <p className='-mt-1'>TAUNUSANLAGE 12 60325, FRANKFURT AM MAIN, GERMANY.</p>
                    </div>

                    <div>
                        <p>--------------------------------------------------MESSAGE TRAILER------------------------------------</p>
                    </div>

                    <div>
                        <p className='-mt-1'>CHK: {isohk}</p>
                        <p className='-mt-1'>PKI-Signature</p>
                        <p className='-mt-1'>DATE OF EXECUTION: {transactionFullDate} {transactionFullTime}</p>
                        <p className='-mt-1 -mb-2'>SERIAL NUMBER {trackingCode}</p>
                    </div>

                    <div>
                        <p>-----------------------------------------------INTERVENTIONS-----------------------------------------</p>
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
                        <p className='-mt-1 mr-2'>TEXT: <span>{description}</span></p>
                    </div>
                </div>
            </div>

            <div id='mt199-part2' className='hidden'>
                <div className='bg-white h-[297mm] w-[210mm] text-left px-12 pb-32 mt-8 text-black uppercase font-semibold'>
                    <div className='flex justify-between'>
                        <div className='mt-8 -ml-2'>
                            <Barcode value={referencecode} height={40} font='Courier New' fontSize={12} background={'transparent'} width={1}/>
                        </div>
                        <div className='w-60'>
                            <img src={logo}/>
                        </div>
                    </div>

                    <div className='text-center'>
                        <p>ANSWERBACK AND ACKNOW LEDGMENT MESSAGE AUTOMATED FILE TRANSFER (AFT) GATEWAY RESPONSE VALIDATION
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
                        <p className='-mt-1 mr-2'>MESSAGE TYPE: <span>{instructionType}</span></p>
                        <p className='-mt-1 mr-2'>PRIORITY: <span>{'URGENT'}</span></p>
                        <p className='-mt-1 mr-2'>RECEIVED: <span>{receiverSwiftCode}</span></p>
                        <p className='-mt-1 mr-2'>TRANSACTION REFERENCE NUMBER: <span>{referencecode}</span></p>
                        <p className='-mt-1 mr-2'>INPUT-OUTPUT: <span>{'ACK NAK DUP AUTH'}</span></p>
                    </div>

                    <div>
                        <p>--------------------------------------------CONFIRMED------------------------------------------------</p>
                    </div>

                    <div>
                        <p className='-mt-1 mr-2'>TRANSACTION STATUS: <span>{'APPROVED'}</span></p>
                        <p className='-mt-1 mr-2'>AMOUNT TRANSFERRED: <span>{amount}</span></p>
                        <p className='-mt-1 mr-2'>DATE OF EXECUTION: <span>{transactionFullDate} T {transactionFullTime}</span></p>
                    </div>

                    <div>
                        <p>------------------------------------------END OF TRANSMISSION----------------------------------------</p>
                    </div>
                </div>
            </div>
        </div>
            
    </div>
  )
}

export default Mt199