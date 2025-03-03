import React from 'react';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';
import './PrintForm.css';

import logo from '../assets/logo.svg'
import signature from '../assets/james.png'
import swift from '../assets/Swift_logo.svg'
import squareseal from '../assets/square seal.png'
import roundseal from '../assets/round seal.png'
import petersign from '../assets/peter sign.png'

import { useTransaction } from '../context/transactionContext'

const PrintForm = () => {
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
    selectedSenderInfo = {}
  } = useTransaction();

  const qrcodelink = `https://alphasec.cloud/dev/${referencecode}.html`

  const keyedbydate = keyedbyfulldate ? keyedbyfulldate.substring(0, 10) : '';
  const keyedbytime = keyedbyfulldate ? keyedbyfulldate.substring(11, keyedbyfulldate.length) : '';

  const releaseddate = releasedbyfulldate ? releasedbyfulldate.substring(0, 10) : '';
  const releasedtime = releasedbyfulldate ? releasedbyfulldate.substring(11, releasedbyfulldate.length) : '';

  const cancelleddate = cancelledbyfulldate ? cancelledbyfulldate.substring(0, 10) : '';
  const cancelledtime = cancelledbyfulldate ? cancelledbyfulldate.substring(11, cancelledbyfulldate.length) : '';

  const receiveddate = receivedbyfulldate ? receivedbyfulldate.substring(0, 10) : '';
  const receivedtime = receivedbyfulldate ? receivedbyfulldate.substring(11, receivedbyfulldate.length) : '';

  const transactionDatedate = transactionDate ? transactionDate.substring(0, 10) : '';
  const transactionDatetime = transactionDate ? transactionDate.substring(11, transactionDate.length) : '';
  const transactionFullDate = `${transactionDatedate} ${transactionDatetime}`;

  return (
    <div className='print-form'>
      <div
        style={{
          backgroundColor: "#034694",
          height: '620px',
          width: '880.2px',
          margin: "auto",
          paddingTop: 55,
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <form className="form-body" style={{ border: "2px solid white" }}>
          <div className="form-content">
            <img src={logo} alt="Bank Logo"  style={{marginBottom: "30px"}}/>
            <div className="first-top-div">
              <div className="input-div">
                <p className="label-names">ACCOUNT</p>
                <input
                  type="text"
                  name="account"
                  className="account-input"
                  placeholder="" value={accountNumber || selectedSenderInfo?.AccountNumber || ''}
                  readOnly
                />
              </div>
              <div className="input-div">
                <p className="label-names">INSTRUCTION TYPE</p>
                <input
                  type="text"
                  name="account"
                  className="instructiontype-input"
                  placeholder="" value={instructionType}
                  readOnly
                />
              </div>
              <div className="input-div gbs-div">
                <div className="gbs-content-div">
                  <p className="label-names2">GBS SCREEN</p>
                  <input
                    type="datetime"
                    name="account"
                    className="gbsscreen-input"
                    placeholder="" value={transactionFullDate}
                    readOnly
                  />
                  {/* <img src={signature} id="signature" style={{position: "absolute",width: "auto",  height: "70px", marginTop: "-99px"}} alt="Signature" /> */}
                  {/* {selectedSenderInfo?.BankName && <img src={selectedSenderInfo.BankName} style={{position: "absolute",width: "65%", marginTop: "-90px", marginLeft: "80px"}} alt="Bank Logo" />} */}
                </div>
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", gap: 5, marginTop: 10 }}
            >
              <div>
                <div className="info1" style={{textTransform: "uppercase"}}>
                  <p style={{marginTop: "-7px"}}>REFERENCES: {senderReference || selectedSenderInfo?.AccountName || ''}</p>
                  <p style={{marginTop: "-5px"}}>SEND: {senderBankName || selectedSenderInfo?.BankName || ''}</p>
                  <p style={{marginTop: "-3px", marginBottom: '20px'}}>ACCOUNT: {senderAccountNumber || selectedSenderInfo?.AccountNumber || ''}</p>
                </div>
                <div className="info2" style={{ position: "relative" }}>
                  <p className="label-names">STATUS</p>
                  <div className="info2-content">
                    <p style={{ textDecoration: "underline", textAlign: "left", marginLeft: "-18px", marginTop: "-12px" }}>RECEIVED</p>
                    <p
                      style={{
                        marginLeft: 30,
                        textDecoration: "underline",
                        textTransform: "uppercase"
                      }}
                    >
                      {received || <br />}
                    </p>
                    <div style={{textAlign: "left", marginLeft: "-17px", marginRight: "70px", marginBottom: "-10px", textTransform: "uppercase"}}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "-3px" }}>
                        <div style={{borderBottom: '1px solid black', paddingBottom: '3px'}}>
                          <p style={{ textDecoration: "",  }} className=''>AMOUNT:</p>
                        </div>
                        <p>{amount}</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "-3px" }}>
                        <div style={{borderBottom: '1px solid black', paddingBottom: '3px'}}>
                          <p style={{ textDecoration: ""}} className=''>CURRENCY:</p>
                        </div>
                        <p>{currency}</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "-3px" }}>
                        <div style={{borderBottom: '1px solid black', paddingBottom: '3px'}}>
                          <p style={{ textDecoration: "",}} className=''>PARTICIPANT:</p>
                        </div>
                        <p>{participant}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="reference-div" style={{ position: "relative", textTransform: "uppercase" }}>
                    <p className="label-names" >REFERENCES {receiverReference}</p>
                    <div className="reference-div-content1" style={{ width: "420px", padding: "15px", paddingBottom: "10px" }}>
                      <div style={{marginLeft: "4px"}}>
                        <p style={{marginTop: "0", marginBottom: "0", fontSize: "12px", textAlign: "left" ,fontStyle:'bold'}}>REC: {receiverName || receiverAccountName || ''}</p>
                        <p style={{marginTop: "0", marginBottom: "0", fontSize: "12px", textAlign: "left" ,fontStyle:'bold'}}>AGENT CLIENT: {receiverAgentClient || receiverBankName || ''}</p>
                        <p style={{marginTop: "0", marginBottom: "0", fontSize: "12px", textAlign: "left" ,fontStyle:'bold'}}>ACCOUNT: {receiverAccountNumber || ''}</p>
                      </div>
                    </div>
                  </div>


                  <div
                    className="user-activity-div"
                    style={{ marginTop: 5, position: "relative" }}
                  >
                    <p className="label-names" style={{ marginBottom: "2px" }}>USER ACTIVITY</p>
                    <div className="reference-div-content2" style={{ width: "420px", padding: "18px", paddingBottom: "10px" }}>
                      <div>
                        <p style={{textAlign: "left", fontSize: "12px", marginTop: "0", marginBottom: "0"}}>KEYED BY: <span style={{marginLeft: "40px"}}>{keyedby}</span></p>
                        <p style={{textAlign: "left", fontSize: "12px", marginTop: "0", marginBottom: "0"}}>RELEASED BY: <span style={{marginLeft: "14px"}}>{releasedby}</span></p>
                        <p style={{textAlign: "left", fontSize: "12px", marginTop: "0", marginBottom: "0"}}>CANCELLED BY:<span style={{marginLeft: "14px"}}>{cancelledby}</span></p>
                        <p style={{textAlign: "left", fontSize: "12px", marginTop: "0", marginBottom: "0"}}>RECEIVED BY:<span style={{marginLeft: "21px"}}>{receivedby}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <img
                    src={swift}
                    style={{ marginLeft: 90, marginTop: "-100px"  }}
                    alt="Swift Logo"
                  />
                  <div id="qr" style={{ marginLeft: 70, marginTop: 30, width: "120px" }} >
                    {referencecode && <QRCodeSVG value={qrcodelink} size={40}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }} />}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 7,
                marginTop: 10
              }}
            >
              <div className=''>
                <div className="status-div" style={{ position: "relative" }}>
                  <p style={{ textDecoration: "underline"}} className="label-names">
                    STATUS
                  </p>
                  <div style={{ border: "2px solid black", padding: 7, paddingBottom: '12px' }}>
                    <div
                      style={{textAlign: "left"
                      }}
                    >
                      <span style={{ textDecoration: "underline", marginLeft: "" }}>ISO<span style={{marginLeft: "47px"}}>CHK: <span style={{textDecoration: "none"}}>{isohk}</span></span></span>
                    </div>
                    <div style={{marginRight: "80px"}}>
                      <p style={{ textDecoration: "underline", display: "flex", justifyContent: "space-between"  }}>
                        <p>NEW</p>
                        <p>MATCH/ NMAT</p>
                        <p>NMAT</p>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ marginTop: -37, width: 340 }}>
                  <p style={{textAlign: "left", textTransform: "uppercase"}}>RECIPIENT COUNTRY: {recipientcountry}</p>
                </div>
              </div>
              <div style={{ position: "relative", marginTop: "8px" }}>
                <p className="label-names">SECURTIES</p>
                <div
                  style={{
                    textAlign: "left",
                    border: "2px solid black",
                    width: 328,
                    height: 'auto',
                    paddingTop: 10,
                    paddingLeft: 8,
                    paddingBottom: 7
                  }}
                >
                  <div style={{textTransform: "uppercase" }}>
                    <p>REFERENCE CODE: {referencecode}</p>
                  </div>
                  <p style={{textAlign: "left", textTransform: "uppercase", marginTop: ""}}>DESCRIPTION: {description}</p>
                </div>
              </div>
              <div style={{ marginTop: "-94px", position: "relative", marginLeft: "-4px" }}>
                <p className="label-names">PROGRESS</p>
                <div>
                  {/* {selectedSenderInfo?.BankName && <img src={selectedSenderInfo.BankName} style={{position: "absolute", height: "100px", marginTop: "-50px", marginLeft: "90px"}} alt="Bank Logo" />} */}
                </div>
                <div>
                  {/* {selectedSenderInfo?.BankName && <img src={selectedSenderInfo.BankName} style={{position: "absolute", height: "100px", marginTop: "-50px", marginLeft: "90px"}} alt="Bank Logo" />} */}
                </div>
                <div>
                  {/* {selectedSenderInfo?.BankName && <img src={selectedSenderInfo.BankName} style={{position: "absolute", marginLeft: "280px", marginTop: "-80px",width: "60%"}} alt="Bank Logo" />} */}
                </div>

                <div style={{ border: "2px solid black", padding: 15, width: "283px", height: "100px" }}>
                  <p style={{textAlign: "left", marginLeft: "15px"}}>PRINTING DONE...</p>
                  <div style={{ display: "flex", flexDirection: "column"}}>
                    <div className="progress-box" style={{marginTop: "15px", width: "auto"}}>
                      <div className="progress-bar" id="progressBar" style={{width: "auto"}}>
                        {[...Array(21)].map((_, i) => (
                          <div key={i} className="progress-box-item" style={{margin: 1, height: "auto", width: "2px", backgroundColor: "#034694"}}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", marginTop: '2px'}}>
                    <p style={{backgroundColor: 'silver', display: 'inline-block', width: '50px', paddingBottom: '8px'}}>OK</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{marginTop: "-27px", marginLeft: "70px", display: 'flex', justifyContent: 'flex-start'}}>
              {referencecode && <Barcode value={referencecode} height={40} font='Courier New' fontSize={12} background={'transparent'} width={1}/>}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PrintForm;