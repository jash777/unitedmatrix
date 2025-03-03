import React from 'react'
import { useTransaction } from '../context/transactionContext'
import './Letter.css'
import dbcb from '../assets/dbcb.png'
import dblogo from '../assets/dblogo.png'

const letter = () => {
    const {accountNumber, instructionType, transactionDate, iban, senderReference, senderBankName, senderAccountNumber, bic, receiverReference, receiverName, 
        receiverAgentClient, receiverAccountNumber, received, amount, currency, participant, isohk, keyedby, keyedbufulldate, releasedby, releasedbyfulldate, cancelledby, cancelledbyfulldate, receivedby, receivedbyfulldate, referencecode, 
        description, recipientcountry, needSignature, needBankStamp, senderAccountName, senderBankAddress, senderSwiftCode, receiverBankName, receiverBankAddress, receiverAccountName, receiverSwiftCode,
        relatedReferenceCode, bankOperationCode, trackingCode, networkDeliveryStatus, prioritydelivery, messageInputReference, messageOutputReference, uetrcode, messageReference, selectedSenderInfo, mt199, letter, checkSum, to, cc,
        uploadSignature, uploadBank
    } = useTransaction();


    const transactiondate = transactionDate.substring(0, 10);
    const transactiontime = transactionDate.substring(11, transactionDate.length)

  return (
    <div  className='flex justify-center items-center'>
        <div id='letter' className='hidden'>
            <div className='bg-white h-auto w-[210mm] text-left px-16 pt-8 pb-32 text-black font-bold'>
                <div className='flex justify-between'>
                    <div className='w-60'>
                        <img src={dbcb}/>
                    </div>
                    <div className='w-16'>
                        <img src={dblogo}/>
                    </div>
                </div>

                <div className=''>
                    <div>
                        <p>DATE:<span className='text-white'>---</span>{transactiondate}</p>
                    </div>

                    <div className='flex mt-4'>
                        <p className='inline-block'>TO:<span className='text-white'>------</span></p>
                        <p className='inline-block h-20 w-96 overflow-hidden'>{to}</p>
                    </div>

                    <div className='mt-4'>
                        <p>CC:<span className='text-white'>------</span>{cc}</p>
                    </div>
                    
                    <div className='mt-4'>
                        <p>RE NO:<span className='text-white'>--</span>{referencecode}</p>
                    </div>

                    <div id='letterbody' className='mt-4 w-full text-justify'>
                        <p id='letterbody-content font-bold'>{letter}</p>
                    </div>

                    <div className='mt-8'>
                        <div className=''>
                            <div className='mb-12'>
                                <p>AUTHORISED SIGNATURE(S) OF THE INSTRUCTING COMPANY</p>
                            </div>

                            <div className='flex justify-between'>
                                <div className='relative'>
                                    <div className="absolute -top-16">
                                        <img src={uploadSignature} className="h-20" />
                                    </div>
                                    <div className="absolute -right-12 -top-20">
                                        <img src={uploadBank} className="h-40 right-0 top-0" />
                                    </div>

                                    <p>MR. ALEXANDRIE ILGEM</p>
                                    <p className='-mt-1'>CFO PRIVATE & COMMERCIAL BANK</p>
                                    <p className='-mt-1'>PIN: 33424</p>
                                    <p className='-mt-1'>TEL: +49 69 910 00</p>
                                    <p className='-mt-1'>EMAIL: ALEXANDER.ILGEN@DB.COM</p>
                                </div>

                                <div className='relative'>
                                    <div className="absolute -top-16">
                                        <img src={uploadSignature} className="h-20" />
                                    </div>
                                    <div className="absolute -right-12 -top-20">
                                        <img src={uploadBank} className="h-40 right-0 top-0" />
                                    </div>

                                    <p>MR. PETER MUELLER</p>
                                    <p className='-mt-1'>SENIOR CORPORATE OFFICER</p>
                                    <p className='-mt-1'>PIN: 29690</p>
                                    <p className='-mt-1'>TEL: +49 69 910 00</p>
                                    <p className='-mt-1'>EMAIL: PETER-E.MULLER@DB.COM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-2'>
                        <p className='text-[11px]'>*In case the guarantee shall be subject to the "Uniform Rules for Demand Guarantees" (URDG758) of the International Chamber of Commerce, Paris, Section 11 5.2 of the "Conditions on Guarantee Business” shall not apply.</p>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default letter