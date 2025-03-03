import React from 'react'
import { useTransaction } from '../context/transactionContext'

import './PrintForm2.css'
import banklogo from '../assets/logo.svg'
import jamessign from '../assets/james.png'
import petersign from '../assets/peter sign.png'
import roundseal from '../assets/round seal.png'
import squareseal from '../assets/square seal.png'
import {QRCodeSVG} from 'qrcode.react';
import Barcode from 'react-barcode';



export const PrintForm2 = () => {

  const {
    accountNumber = '',
    instructionType = 'MT103',
    iban = '',
    transactionDate = new Date().toISOString(),
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
    selectedSenderInfo = {},
    uploadBank = '',
    uploadSignature = '',
    senderBankAddress = ''
  } = useTransaction();

  
    const transactiondate = transactionDate ? transactionDate.substring(0, 10) : '';
    const transactiontime = transactionDate ? transactionDate.substring(11, transactionDate.length) : '';
    const transactionFull = `${transactiondate} ${transactiontime}`

    const qrcodelink = referencecode ? `https://alphasec.cloud/dev/${referencecode}.html` : '';
  return (
    <>
        <div id="another-form" className="">
            <div className="another-form w-[864px] h-[710px] m-auto font-semibold leading-3 text-xs">
                <div className='pt-12 pl-20'>
                  <img src={banklogo} />
                  <p className='mt-4 text-xs'>{senderBankAddress || selectedSenderInfo?.BankAddress || ''}</p>
                </div>

                <div className='text-right mr-32 -mt-3'>
                  <div className='mr-[44px]'>
                    <p className=''>www.db.com</p>
                  </div>
                  <p className=''>BIC: DEUTDEFFXXX</p>
                </div>

                <div>
                  <div className='w-[850px] h-[650px]'>
                    <div className='flex'>
                      <div className='h-[600px] w-[70px] ml-2 flex items-end text-center'>
                        <h1 className='absolute transform -rotate-90 text-[46px] -ml-[195px] mb-[300px] font-sans font-bold opacity-35'>REMITTANCE ADVICE</h1>
                      </div>

                      <div>
                        <div className=''>
                          <div className='flex'>
                            <div className=' h-auto w-[370px] ml-[65px] mt-6 text-left'>
                              <div>
                              <p>IBAN <span className='ml-[100px]'>{senderAccountNumber ? senderAccountNumber.slice(-11) : ''}</span></p>

                                <p className='pt-1'>ACCOUNT <span className='ml-[78px]'>{
                                  senderAccountNumber || (iban ? iban.slice(-10) : '')
                                }</span></p>
                              </div>

                              <div className='mt-4'>
                                <p>IN THE NAME OF <span className='ml-[28px]'>{senderReference}</span></p>
                                <p className='pt-1'><span className='ml-[136px]'>{selectedSenderInfo?.BankName}</span></p>
                              </div>

                              <div className='mt-1'>
                                <p>CURRENCY <span className='ml-[71px]'>{currency}</span></p>
                                <p className='pt-1'>AMOUNT <span className='ml-[86px]'>  {amount}</span></p>
                              </div>

                              <div className='mt-4'>
                                <p>IN FAVOR <span className='ml-[67px]'>{""}</span></p>
                              </div>

                              <div className='mt-4'>
                                <p>BIC<span className='ml-[114px]'>{bic}</span></p>
                                <p className='pt-1'>IN THE NAME OF <span className='ml-[27px]'>{receiverName}</span></p>
                                <p className='pt-1'><span className='ml-[135px]'>{receiverReference}</span></p>
                                <p className='pt-1'>BANK<span className='ml-[106px]'>{"CHASE"}</span></p>
                              </div>

                            </div>

                            <div>
                              <div className='border mt-6 w-200 h-200 relative'>
                                <div className='ml-44 absolute'>
                                  {referencecode && <QRCodeSVG value={qrcodelink} size={100} bgColor={'transparent'} className='qr'/>}
                                </div>

                                <div className='absolute w-28 -ml-20 mt-32'>
                                  {uploadSignature && <img src={jamessign}/>}
                                </div>

                                <div className='absolute w-[165px] ml-7 mt-32'>
                                  {uploadSignature && <img src={squareseal} className='transform -rotate-6'/>}
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className=' ml-[65px] mt-4 w-[649px]'>
                            <div className='text-right'>
                              <p>{transactiondate}</p>
                            </div>

                            <div className='flex justify-between border-b border-black pb-3 pt-2'>
                              <p className='text-left'>SWIFT INPUT: {instructionType}</p>
                              <p className='text-right'>PAGE 1/1</p>
                            </div>

                            <div className='border-b pb-6 border-black'>
                            <table className="w-full">
                                <thead className='border-b border-black'>
                                    <tr className=''>
                                        <th style={{textAlign: "left", paddingTop: '4px', paddingBottom: '18px'}} >TRANSACTION REFERENCE</th>
                                        <th style={{textAlign: "left", paddingTop: '4px', paddingBottom: '18px', marginLeft: -4}} >CHK CODE</th>
                                        <th style={{textAlign: "left", paddingTop: '4px', paddingBottom: '18px'}} >EUR</th>
                                        <th style={{textAlign: "left", paddingTop: '4px', paddingBottom: '18px'}} >IN FAVOR</th>
                                        <th style={{textAlign: "right", paddingTop: '4px', paddingBottom: '18px'}} >VALUE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr className=''>
                                        <td style={{textAlign: "left", paddingTop: '2px', paddingBottom: '7px'}} >{referencecode}</td>
                                        <td style={{textAlign: "left", paddingTop: '2px', paddingBottom: '7px'}} >{isohk} </td>
                                        <td style={{textAlign: "left", paddingTop: '2px', paddingBottom: '7px'}} >0.0</td>
                                        <td style={{textAlign: "left", paddingTop: '2px', paddingBottom: '7px'}} >{bic}</td>
                                        <td style={{textAlign: "right", paddingTop: '2px', paddingBottom: '7px'}} >{amount}</td>
                                    </tr>
                                    
                                </tbody>
                              </table>
                            </div>

                            <div className='text-[11px] relative'>
                              <table className="w-full table-auto absolute">
                                <thead style={{marginBottom: '9px'}} className='border-b border-black'>
                                    <tr className='py-'>
                                        <th style={{textAlign: "left", paddingBottom: '15px', paddingTop: '2px', paddingRight: '9px'}}>CATEGORY</th>
                                        <th style={{textAlign: "left", paddingBottom: '15px', paddingTop: '2px', paddingRight: '9px', width: '100px'}} className="">CREATION TIME</th>
                                        <th style={{textAlign: "left", paddingBottom: '15px', paddingTop: '2px', paddingRight: '9px'}} >APPLICATION</th>
                                        <th style={{textAlign: "left", paddingBottom: '15px', paddingTop: '2px', paddingRight: '9px'}} >TE/T</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='relative'>
                                        <td style={{textAlign: "left", paddingTop: '2px', position: 'relative'}} className="text-left py-2 relative">{instructionType}</td>
                                        <td style={{textAlign: "left", paddingTop: '2px', position: 'relative'}} className="text-left py-2 relative">{transactionFull}</td>
                                        <td style={{textAlign: "left", paddingTop: '2px', position: 'relative'}} className="text-left py-2 relative">{senderReference}</td>
                                        <td style={{textAlign: "left", paddingTop: '2px', height: 'auto', position: 'relative'}} className="text-left py-2 relative h-auto">{description}</td>
                                    </tr>
                                </tbody>
                              </table>

                              <div className='-bottom-16 absolute w-full pt-20'>
                                <div className='text-left absolute -ml-2'>
                                  {referencecode && <Barcode value={referencecode} height={50} font='sans-serif' fontSize={12} background={'transparent'} width={1}/>}
                                </div>

                                <div className='-mt-4'>
                                  <div className='text-right absolute ml-[380px]'>
                                    {uploadSignature && <img src={uploadSignature} className='h-[100px]'/>}
                                  </div>

                                  <div className='text-right absolute ml-[510px] '>
                                    {uploadBank && <img src={uploadBank} className=' h-[130px]'/>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  </div>
                </div>
            </div>
        </div>
    </>
  )
}