import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useTransaction } from '../context/transactionContext'
import { PrintData } from '../utils/data'

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from './Navbar';

export const UserInputForm = () => {
    const [selectedSender, setSelectedSender] = useState('');
    const navigate = useNavigate();

    // States
    const {accountNumber, instructionType, transactionDate, iban, transactionFullDate, senderReference, senderBankName, senderAccountNumber, bic, receiverReference, receiverName, 
        receiverAgentClient, receiverAccountNumber, received, amount, currency, participant, isohk, keyedby, keyedbufulldate, releasedby, releasedbyfulldate, cancelledby, cancelledbyfulldate, receivedby, receivedbyfulldate, referencecode, 
        description, recipientcountry, needSignature, needBankStamp, senderAccountName, senderBankAddress, senderSwiftCode, receiverBankName, receiverBankAddress, receiverAccountName, receiverSwiftCode,
        relatedReferenceCode, bankOperationCode, trackingCode, networkDeliveryStatus, prioritydelivery, messageInputReference, messageOutputReference, uetrcode, messageReference,
        senderData, selectedSenderInfo, uploadSignature, uploadBank, printItems, letter, mt199, checkSum, to, cc
    } = useTransaction();

    // Setter Functions
    const { setAccountNumber, setInstructionType, setIBAN, setTransactionDate, setTransactionFullDate, setbic, setSenderReference, setSenderBankName, setSenderAccountNumber, setReceiverReference,
        setReceiverName, setReceiverAgentClient, setReceiverAccountNumber, setReceived, setAmount, setCurrency, setParticipant, setIsohk, setKeyedby, setKeyedyfulldate, setreleasedby,
        setreleasedbyfulldate, setCancelledby, setCancelledbyfulldate, setReceivedby, setReceivedbyfulldate, setReferencecode, setDescription, setRecipientCountry, setNeedSignature, setNeedBankStamp, setSenderBankAddress, setSenderAccountName, setSenderSwiftCode, setReceiverBankName,
        setReceiverBankAddress, setReceiverAccountName, setReceiverSwiftCode, setRelatedReferenceCode, setBankOperationCode, setTrackingCode, setNetworkDeliveryStatus, setPrioritydelivery, 
        setMessageInputReference, setMessageOutputReference, setUetrcode, setMessageReference, setSelectedSenderInfo, setUploadSignature, setUploadBank, setLetter, setMt199, setCheckSum, setTo, setCc, setPrintItems
    } = useTransaction();

    const handleSenderDataChange = (e) => {
        const selectedSenderAccountName = e.target.value;
        setSelectedSender(selectedSenderAccountName);
        setSelectedSenderInfo(senderData[selectedSenderAccountName]);

        const senderaccountnumber = document.getElementById("senderaccountnumber")
        console.log(senderaccountnumber)
    };

    // const addPdfSingle = (pdf, printingElement, scaleUnit) => {
    //     Promise.all([
    //         html2canvas(printingElement, {scale: scaleUnit})
    //     ]).then(([printingElementCanvas]) => {
    //         addSectionToPDF(pdf, printingElementCanvas, 0);
    //     });
    // }    


    // const addPdfDouble = (pdf, [printingElement, anotherPrintingElement], scaleUnit) => {
    //     Promise.all([
    //         html2canvas(printingElement, {scale: scaleUnit}),
    //         html2canvas(anotherPrintingElement, {scale: scaleUnit})
    //     ]).then(([printingElementCanvas, anotherPrintingElementCanvas]) => {
    //         addSectionToPDF(pdf, printingElementCanvas, 0);
    //         pdf.addPage('a4', 'p');
    //         addSectionToPDF(pdf, anotherPrintingElementCanvas, 0)
    //     });
    // }     



    // download
    const downloadPdf = () => {
        // First, check if printItems is empty
        if (printItems.length === 0) {
            alert("Please make a printing selection first");
            return;
        }

        const elements = {
            firstform: document.getElementById('print'),
            secondform: document.getElementById('another-form'),
            toPrintElement: document.getElementById('form3-part1'),
            anotherFormElement: document.getElementById('form3-part2'),
            form3part3: document.getElementById('form3-part3'),
            form3part4: document.getElementById('form3-part4'),
            letter: document.getElementById("letter"),
            mt199part1: document.getElementById("mt199-part1"),
            mt199part2: document.getElementById("mt199-part2")
        };

        // Check which elements are missing and log them specifically
        const missingElements = Object.entries(elements)
            .filter(([_, el]) => !el)
            .map(([name]) => name);
        
        if (missingElements.length > 0) {
            console.error('Missing elements:', missingElements);
            alert(`Some required elements are missing: ${missingElements.join(', ')}`);
            return;
        }

        // Make sure all elements are visible before capturing
        Object.values(elements).forEach(el => {
            if (el) {
                el.classList.remove("hidden");
                el.classList.add("printingclass");
            }
        });

        // Add a small delay to ensure DOM updates before capturing
        setTimeout(() => {
            Promise.all([
                html2canvas(elements.firstform, {scale: 1}),
                html2canvas(elements.secondform, {scale: 1.18}),
                html2canvas(elements.toPrintElement, { scale: 1 }),
                html2canvas(elements.anotherFormElement, { scale: 1 }),
                html2canvas(elements.form3part3, {scale: 1}),
                html2canvas(elements.form3part4, {scale: 1}),
                html2canvas(elements.letter, {scale: 1}),
                html2canvas(elements.mt199part1, {scale: 1}),
                html2canvas(elements.mt199part2, {scale: 1})
            ]).then(([firstFormCanvas, secondFormCanvas, toPrintCanvas, anotherFormElement, form3part3, form3part4, letterCanvas, mt199part1Canvas, mt199part2Canvas]) => {
                const pdf = new jsPDF();
                
                if(printItems.includes('debit')) {
                    const width1 = 214
                    const height1 = 163
                    pdf.addPage([width1, height1], 'l');
                    addSectionToPDF(pdf, firstFormCanvas, 0);
                }
                
                if(printItems.includes('remit')) {
                    const height2 = 212
                    const width2 = 259
                    pdf.addPage([width2, height2], 'l');
                    addSectionToPDF(pdf, secondFormCanvas, 0)
                }
                
                if(printItems.includes('white')) {
                    const width3 = 210
                    const height3 = 370
                    pdf.addPage([width3, height3], 'p');
                    addSectionToPDF(pdf, toPrintCanvas, 0)

                    const width4 = 210
                    const height4 = 297
                    pdf.addPage([width4, height4], 'p');
                    addSectionToPDF(pdf, anotherFormElement, 0)
                }
                
                if(printItems.includes('black')) {
                    const width5 = 210
                    const height5 = 370
                    pdf.addPage([width5, height5], 'p');
                    addSectionToPDF(pdf, form3part3, 0)

                    const width6 = 210
                    const height6 = 297
                    pdf.addPage([width6, height6], 'p');
                    addSectionToPDF(pdf, form3part4, 0)
                }

                if(printItems.includes('letter')) {
                    const width6 = 210
                    const height6 = 380
                    pdf.addPage([width6, height6], 'p');
                    addSectionToPDF(pdf, letterCanvas, 0)
                }

                if(printItems.includes('mt199')) {
                    const width7 = 210
                    const height7 = 390
                    pdf.addPage([width7, height7], 'p');
                    addSectionToPDF(pdf, mt199part1Canvas, 0)

                    const width8 = 210
                    const height8 = 297
                    pdf.addPage([width8, height8], 'p');
                    addSectionToPDF(pdf, mt199part2Canvas, 0)
                }

                pdf.deletePage(1)

                pdf.save('transfer-documents.pdf');
                alert("Transfer documents have been generated and downloaded.");
                
                // Hide elements after PDF generation
                Object.values(elements).forEach(el => {
                    if (el) {
                        el.classList.add("hidden");
                        el.classList.remove("printingclass");
                    }
                });
                
                // Show the not-to-print element
                const nottoprint = document.getElementById("not-to-print");
                if (nottoprint) nottoprint.classList.remove("hidden");
                document.body.style.backgroundColor = "black";
                
            }).catch(error => {
                console.error('Error generating PDF:', error);
                alert("Error generating transfer documents. Please try again.");
                
                // Make sure to hide elements even if there's an error
                Object.values(elements).forEach(el => {
                    if (el) {
                        el.classList.add("hidden");
                        el.classList.remove("printingclass");
                    }
                });
                
                const nottoprint = document.getElementById("not-to-print");
                if (nottoprint) nottoprint.classList.remove("hidden");
                document.body.style.backgroundColor = "black";
            });
        }, 300); // 300ms delay to ensure DOM updates
    }
        
    const addSectionToPDF = (pdf, canvas, topMargin) => {
        const imgData = canvas.toDataURL('image/jpeg');
        
        // Calculate coordinates to center the image
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imageWidth = canvas.width * 0.264583; // Convert canvas width from pixels to mm
        const imageHeight = canvas.height * 0.264583; // Convert canvas height from pixels to mm
        const x = (pageWidth - imageWidth) / 2;
        const y = (pageHeight - imageHeight) / 2
        
        pdf.addImage(imgData, 'JPEG', x, y + topMargin, imageWidth, imageHeight);
    };

    const handleKeyUp = (e) => {
        
    }
          
    // Document Printing Function
    const printDocument = () => {
        if(printItems.length === 0) {
            alert("Make Printing Selection");
            return;
        }

        const elements = {
            firstform: document.getElementById("print"),
            secondform: document.getElementById("another-form"),
            toprint: document.getElementById("form3-part1"),
            anotherform: document.getElementById("form3-part2"),
            form3part3: document.getElementById("form3-part3"),
            form3part4: document.getElementById("form3-part4"),
            letter: document.getElementById("letter"),
            mt199part1: document.getElementById("mt199-part1"),
            mt199part2: document.getElementById("mt199-part2")
        };
        
        const nottoprint = document.getElementById("not-to-print");
        
        // Check which elements are missing
        const missingElements = Object.entries(elements)
            .filter(([_, el]) => !el)
            .map(([name]) => name);
        
        if (missingElements.length > 0) {
            console.error('Missing elements for printing:', missingElements);
        }
        
        // Show only the elements that need to be printed based on printItems
        Object.entries(elements).forEach(([key, el]) => {
            if (!el) return;
            
            if (
                (key === 'firstform' && printItems.includes('debit')) ||
                (key === 'secondform' && printItems.includes('remit')) ||
                ((key === 'toprint' || key === 'anotherform') && printItems.includes('white')) ||
                ((key === 'form3part3' || key === 'form3part4') && printItems.includes('black')) ||
                (key === 'letter' && printItems.includes('letter')) ||
                ((key === 'mt199part1' || key === 'mt199part2') && printItems.includes('mt199'))
            ) {
                el.classList.remove("hidden");
                el.classList.add("printingclass");
            } else {
                el.classList.add("hidden");
                el.classList.remove("printingclass");
            }
        });
        
        if (nottoprint) nottoprint.classList.add("hidden");
        document.body.style.backgroundColor = "white";
        
        window.print();
        
        // After printing, hide all elements and show the not-to-print element
        Object.values(elements).forEach(el => {
            if (el) {
                el.classList.add("hidden");
                el.classList.remove("printingclass");
            }
        });
        
        if (nottoprint) nottoprint.classList.remove("hidden");
        document.body.style.backgroundColor = "black";
    }

    // Utility Function to send Data to Database
    const setValuesToDatabase = async () => {
        // if(!instructionType || !senderBankName || !senderAccountNumber || !receiverName || !receiverAccountNumber || !amount || !transactionDate) {
        //     window.alert("Fill all the details");
        //     return;
        // }

        const dataToSend = {
            TransactionType: instructionType,
            s_BankName: senderBankName,
            s_AccountNumber: senderAccountNumber,
            r_AccountName: receiverName,
            r_AccountNumber: receiverAccountNumber,
            Amount: amount,
            DateofExecution: transactionFullDate 
        };

        // try {
        //     const response = await axios.post('http://localhost:8080/postTransactionData', dataToSend);
        //     console.log('Success');
        // } catch (error) {
        //     console.error('Error');
        // }
        printDocument();
    }

    const getTransactionTime = (e) => {
        const convertedTime = convertTime(e);
        
        setTransactionDate(e.target.value);
        setTransactionFullDate(convertedTime);
    }

    const convertTime = (e) => {
        const date = new Date(e.target.value);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
    }

    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setUploadSignature(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }

        console.log(uploadSignature)
    }

    const handleStampChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setUploadBank(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }

        console.log(uploadBank)
    }

    const generatePDF = () => {
        // Set default print items
        setPrintItems(['debit', 'remit', 'white', 'black']);
        
        // Trigger PDF generation
        printDocument();
    };

  return (
    <>
        <div className="">
            <div id="not-to-print" className="">
                <div className="">
                    <div>
                        <h1 className="text-2xl text-white/90 text-left tracking-widest pb-2">MT103 SINGLE CREDIT TRANSFER</h1>
                        <div className="text-white/60 border-2 border-white/10 rounded-md p-16 pb-12 pt-0">
                            <Navbar />
                            <div className="grid grid-cols-2 gap-20">
                                <div>
                                    <div>
                                        <h4 className="pb-1 text-white/90 text-left ml-6 tracking-wider">Account Information</h4>
                                        <input id="accountnumber" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={accountNumber || ''} onChange={(e) => {setAccountNumber(e.target.value)}} placeholder={'Account Number'}/>
                                        <input id="instructiontype" required className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={instructionType} onChange={(e) => setInstructionType(e.target.value)} placeholder="Instruction Type"/>
                                    </div>

                                    <div>
                                        <h4 className="pt-4 pb-1 text-white/90 text-left ml-6 tracking-wider">Sender Details</h4>
                                        <input id="reference" type='text' className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={senderReference } onChange={(e) => setSenderReference(e.target.value)}  placeholder="Reference"/>
                                        <input id="senderbankname" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0"  value={selectedSenderInfo?.BankName || ''}  placeholder="Sender Bank Name"/> <br/>
                                        <input id="senderaccountnumber" className="bg-neutral-900 -ml-2 p-2 rounded-md mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 " value={selectedSenderInfo?.AccountNumber || ''}  placeholder="Sender Account Number"/>
                                        <input id="iban" className="bg-neutral-900 p-2 rounded-md ml-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 " value={iban} onChange={(e) => setIBAN(e.target.value)} placeholder="IBAN"/>
                                        <select onChange={handleSenderDataChange} className="bg-neutral-900 p-2 rounded-md -ml-1 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" placeholder="Select Account Name">
                                            {senderData && senderData.length > 0 ? (
                                                senderData.map((sender, index) => (
                                                    <option key={index} value={index}>
                                                        {sender.AccountName} - {sender.AccountNumber}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No accounts available</option>
                                            )}
                                        </select>
                                        <input id="senderbankaddress" className="bg-neutral-900 p-2 rounded-md ml-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 " value={selectedSenderInfo?.BankAddress || ''}  placeholder="Sender Bank Address"/>
                                        <div className='text-left ml-7'>
                                            <input id="senderswiftcode" className="bg-neutral-900 -ml-2 p-2 rounded-md mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 " value={selectedSenderInfo?.SwiftCode || ''}  placeholder="Sender Swift Code"/>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="pt-4 pb-1 text-white/90 text-left ml-6 tracking-wider">Instance Type and Transmission</h4>
                                        <input id="networkdeliverystatus" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={networkDeliveryStatus} onChange={(e) => setNetworkDeliveryStatus(e.target.value)} placeholder="Network Delivery Status"/>
                                        <input id="prioritydelivery" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={prioritydelivery}  onChange={(e) => setPrioritydelivery(e.target.value)}placeholder="Priority/Delivery"/> <br/>
                                        <input id="messageinputreference" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={messageInputReference} onChange={(e) => setMessageInputReference(e.target.value)} placeholder="Message Input Reference"/>
                                        <input id="messageoutputreference" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={messageOutputReference} onChange={(e) => setMessageOutputReference(e.target.value)} placeholder="Message Output Reference"/>
                                        <input id="uetrcode" className="bg-neutral-900 text-left p-2 rounded-md mt-4 mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={uetrcode} onChange={(e) => setUetrcode(e.target.value)} placeholder="UETR Code"/>
                                        <input id="messageReference" className="bg-neutral-900 text-left p-2 rounded-md mt-4 mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={messageReference} onChange={(e) => setMessageReference(e.target.value)} placeholder="Message Reference"/>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <div>
                                            <h4 className="pb-1 text-white/90 text-left ml-6 tracking-wider">GBS Screen</h4>
                                            <input id="date" type="datetime-local" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 -ml-[230px]" value={transactionDate} onChange={getTransactionTime} />
                                        </div>
                
                                        <div>
                                            <h4 className="pt-4 pb-1 text-white/90 text-left ml-6 tracking-wider">Receiver Details</h4>
                                            <input id="receiverreference" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receiverReference} onChange={(e) => setReceiverReference(e.target.value)} placeholder="Receiver Reference"/>
                                            <input id="reeivername" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receiverName}  onChange={(e) => setReceiverName(e.target.value)}placeholder="Receiver Name"/> <br/>
                                            <input id="receiveragentclient" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receiverAgentClient} onChange={(e) => setReceiverAgentClient(e.target.value)} placeholder="Receiver Agent Client"/>
                                            <input id="receiveraccountnumber" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receiverAccountNumber} onChange={(e) => setReceiverAccountNumber(e.target.value)} placeholder="Receiver Account Number"/>
                                            <input id="receiverbankname" className="bg-neutral-900 text-left p-2 rounded-md mt-4 mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receiverBankName} onChange={(e) => setReceiverBankName(e.target.value)} placeholder="Receiver Bank Name"/>
                                            <input id="bic" className="bg-neutral-900 text-left p-2 rounded-md mr-2 w-56 mt-4 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={bic} onChange={(e) => setbic(e.target.value)} placeholder="BIC"/>
                                            <input id="receiverbankaddress" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receiverBankAddress} onChange={(e) => setReceiverBankAddress(e.target.value)} placeholder="Receiver Bank Address"/>
                                            <input id="receiveraccountname" className="bg-neutral-900 text-left p-2 rounded-md mt-4 mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receiverAccountName} onChange={(e) => setReceiverAccountName(e.target.value)} placeholder="Receiver Bank Name"/>
                                            <div className='text-left ml-5'>
                                                <input id="receiverswiftcode" className="bg-neutral-900 text-left p-2 rounded-md mr-2 w-56 mt-4 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receiverSwiftCode} onChange={(e) => setReceiverSwiftCode(e.target.value)} placeholder="Receiver Swift Code"/>
                                            </div>

                                            <div>
                                                <h4 className="pt-4 pb-1 text-white/90 text-left ml-6 tracking-wider">INPUTS</h4>
                                                <textarea id="lettertext" className="bg-neutral-900 text-left p-2 rounded-md mr-3 w-56 mt-4 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={letter} onChange={(e) => setLetter(e.target.value)} placeholder="Letter Text"/>
                                                <textarea id="mt199text" className="bg-neutral-900 p-2 rounded-md mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={mt199} onChange={(e) => setMt199(e.target.value)} placeholder="MT199 Text"/>
                                                <input id="to" className="bg-neutral-900 text-left p-2 rounded-md mr-2 w-56 mt-4 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={to} onChange={(e) => setTo(e.target.value)} placeholder="TO"/>
                                                <input id="cc" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="CC"/>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <div>
                                            <h4 className="pb-1 text-white/90 text-left ml-6 tracking-wider">Transaction Status(1)</h4>
                                            <select id="received" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={received} onChange={(e) => setReceived(e.target.value)}>
                                                <option value="" disabled selected hidden>Received</option>
                                                <option value="internal">Internal</option>
                                                <option value="external">External</option>
                                            </select>
                                            <input id="amount" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount"/> <br/>
                                            <select id="received" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                                <option value="" disabled selected hidden>Currency</option>
                                                <option value="EURO">Euro</option>
                                                <option value="USD">USD</option>
                                            </select>
                                            <input id="participant" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={participant} onChange={(e) => setParticipant(e.target.value)} placeholder="Participant"/>
                                        </div>
                
                                        <div>
                                            <h4 className="pt-4 pb-1 text-white/90 text-left ml-6 tracking-wider">Transaction Status(2)</h4>
                                            <input id="isohk" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 -ml-[230px]" value={isohk} onChange={(e) => setIsohk(e.target.value)} placeholder="ISO HK:"/>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <div>
                                            <h4 className="pb-1 text-white/90 text-left ml-6 tracking-wider">User Activity</h4>
                                            <input id="keyedby" type="text" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={keyedby} onChange={(e) => setKeyedby(e.target.value)} placeholder="Select Keyed By Date"/>
                                            <input id="releasedby" type="text" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={releasedby} onChange={(e) => setreleasedby(e.target.value)} placeholder="Select Released By Date"/> <br/>
                                            <input id="cancelledby" type="text" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={cancelledby} onChange={(e) => setCancelledby(e.target.value)} placeholder="Select Cancelled By Date"/>
                                            <input id="receivedby" type="text" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={receivedby} onChange={(e) => setReceivedby(e.target.value)} placeholder="Select Received By Date"/>
                                        </div>
                
                                        <div>
                                            <h4 className="pt-4 pb-1 text-white/90 text-left ml-6 tracking-wider">Securities</h4>
                                            <input id="referencecode" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={referencecode} onChange={(e) => setReferencecode(e.target.value)} placeholder="Reference Code"/>
                                            <input id="relatedreferencecode" className="bg-neutral-900 p-2 rounded-md mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={relatedReferenceCode} onChange={(e) => setRelatedReferenceCode(e.target.value)} placeholder="Related Reference Code"/>
                                            <input id="bankoperationcode" className="bg-neutral-900 p-2 rounded-md mt-4 mr-2 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={bankOperationCode} onChange={(e) => setBankOperationCode(e.target.value)} placeholder="Bank Operation Code"/>
                                            <input id="description" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (TE/T)"/> <br/>
                                            <input id="recipientcountry" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 " value={recipientcountry} onChange={(e) => setRecipientCountry(e.target.value)} placeholder="Recipient Country"/>
                                            <input id="trackingcode" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 " value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} placeholder="Tracking Code"/>
                                            <input id="checksum" className="bg-neutral-900 p-2 rounded-md mr-2 mt-4 w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0 " value={checkSum} onChange={(e) => setCheckSum(e.target.value)} placeholder="Check Sum"/>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex gap-12 -mt-24 ml-5">
                                        {/* <div className="bg-black">
                                            <input id="signaturecheckbox" checked={needSignature}  type="checkbox" className="accent-black form-checkbox h-16 w-16 mr-8 border-2 border-white transparent" onChange={() => setNeedSignature((prev) => !prev)}/>
                                            <p className="text-white/90 -ml-8">Signature</p>
                                        </div>

                                        <div>
                                            <input id="bankcheckbox" checked={needBankStamp} type="checkbox" className="accent-black form-checkbox h-16 w-16 mr-8 border-2 border-white transparent" onChange={() => setNeedBankStamp((prev) => !prev)}/>
                                            <p className="text-white/90">Deutsche Bank</p>
                                        </div> */}

                                        <div className='text-left'>
                                            <h5 className="text-white/90 text-left ml-2 tracking-wider">Signature</h5>
                                            <input type='file' accept='image/*' onChange={handleSignatureChange} className="bg-neutral-900 p-2 rounded-md w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0"/> 
                                        </div>

                                        <div className='text-left'>
                                            <h5 className="text-white/90 text-left ml-2 tracking-wider">Bank Stamp</h5>
                                            <input type='file' accept='image/*' onChange={handleStampChange} className="bg-neutral-900 p-2 rounded-md w-56 placeholder:text-[11px] placeholder:text-neutral-500 focus:outline-0"/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center pt-12">
                                <button className="p-3 w-72 bg-neutral-900 rounded-md tracking-widest text-white/90" onClick={setValuesToDatabase}>MAKE A PAYMENT NOW!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default UserInputForm;