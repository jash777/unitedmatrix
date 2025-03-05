// Transaction data object to store all form fields
const transactionData = {
    // Sender information
    senderName: '',
    senderAddress: '',
    senderAccountNumber: '',
    senderBankName: '',
    senderBankAddress: '',
    senderSwiftCode: '',
    senderIban: '',
    senderRoutingNumber: '',
    
    // Receiver information
    receiverName: '',
    receiverAddress: '',
    receiverAccountNumber: '',
    receiverBankName: '',
    receiverBankAddress: '',
    receiverSwiftCode: '',
    receiverIban: '',
    receiverRoutingNumber: '',
    
    // Transaction details
    amount: '',
    currency: '',
    transactionDate: '',
    valueDate: '',
    instructionType: '',
    instructionCode: '',
    instructionDate: '',
    
    // Reference numbers
    referencecode: '',
    messageReference: '',
    trackingCode: '',
    transactionReference: '',
    customerReference: '',
    
    // Additional information
    remittanceInfo: '',
    detailsOfCharges: '',
    additionalInfo: '',
    
    // Status information
    status: 'Completed',
    statusDate: '',
    statusTime: '',
    
    // Regulatory information
    regulatoryReporting: '',
    regulatoryInfo: ''
};

// Function to generate hash code for barcodes
function hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString();
}

// Function to generate CRC32 for additional verification
function crc32(str) {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
    }
    
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).toUpperCase();
}

// Function to generate random strings
function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Function to format date
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return {
        fullDate: `${year}${month}${day}`,
        fullTime: `${hours}${minutes}`,
        dateTime: `${year}-${month}-${day} ${hours}:${minutes}`
    };
}

// Function to generate transaction references
function generateTransactionReferences(data) {
    const timestamp = new Date().getTime();
    return {
        messageReference: `REF${timestamp}`,
        trackingCode: `TRK${generateRandomString(8)}`,
        messageInputReference: `IN${generateRandomString(6)}`,
        messageOutputReference: `OUT${generateRandomString(6)}`,
        uetrcode: `UETR${generateRandomString(12)}`,
        swiftCoverageInternalNumber: `SCN${generateRandomString(8)}`,
        confirmedAck: `ACK${generateRandomString(6)}`,
        debitAuthorized: `AUTH${generateRandomString(6)}`,
        accountDebited: `DEBIT${generateRandomString(6)}`,
        isohk: crc32(JSON.stringify(data))
    };
}

// Function to process form data
function processFormData(data) {
    const refs = generateTransactionReferences(data);
    
    return {
        ...data,
        ...refs,
        networkDeliveryStatus: 'NETWORK DELIVERY',
        prioritydelivery: 'NORMAL',
        swiftMessage: 'MT103'
    };
}

// Function to generate barcodes
function generateBarcodes(data) {
    const barcodeData = hashCode(JSON.stringify(data));
    
    // Create SVG elements first
    ['barcode1', 'barcode2', 'barcode3', 'barcode4'].forEach((id, index) => {
        const container = document.getElementById(`${id}Container`);
        if (container) {
            // Create SVG element
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.id = id;
            container.innerHTML = ''; // Clear existing content
            container.appendChild(svg);
            
            // Generate barcode
            const barcodeValue = `${barcodeData}${index + 1}`;
            try {
                JsBarcode(`#${id}`, barcodeValue, {
                    format: "CODE128",
                    width: 1.5,
                    height: 40,
                    displayValue: true,
                    fontSize: 12,
                    font: 'Courier Prime'
                });
            } catch (err) {
                console.warn(`Failed to generate barcode for ${id}:`, err);
                container.innerHTML = `<div class="barcode-fallback">${barcodeValue}</div>`;
            }
        }
    });
}

// Function to update form fields
function updateFormFields(data) {
    // Update all text fields
    Object.keys(data).forEach(key => {
        const elements = document.querySelectorAll(`[id^="${key}"]`);
        elements.forEach(element => {
            if (element) {
                if (element.tagName === 'IMG') {
                    if (data[key]) {
                        element.src = data[key];
                        element.style.display = 'block';
                    }
                } else if (element.tagName === 'SPAN') {
                    element.textContent = data[key] || '';
                }
            }
        });
    });

    // Update remittance information and details of charges
    const remittanceElements = document.querySelectorAll('[id^="remittanceInfo"]');
    remittanceElements.forEach(element => {
        element.textContent = data.remittanceInfo || 'INVESTMENT';
    });

    const chargesElements = document.querySelectorAll('[id^="detailsOfCharges"]');
    chargesElements.forEach(element => {
        element.textContent = data.detailsOfCharges || 'OUR';
    });

    // Generate barcodes after updating fields
    generateBarcodes(data);
}

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString()) {
        const formData = {};
        for (const [key, value] of urlParams) {
            formData[key] = value;
        }
        
        // Wait for document to be fully loaded before processing
        setTimeout(() => {
            const processedData = processFormData(formData);
            updateFormFields(processedData);
        }, 1000);
    }

    // Handle print button
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Handle PDF generation
    const pdfButton = document.getElementById('pdfButton');
    if (pdfButton) {
        pdfButton.addEventListener('click', function() {
            const element = document.getElementById('printForm3');
            if (!element) {
                console.error('Print form element not found');
                return;
            }

            // Add necessary styles before generating PDF
            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');
                body { font-family: 'Courier Prime', monospace !important; }
                .page { margin: 0; padding: 20px; background: #fff; }
                .black-page { background: #000 !important; color: #fff !important; }
                .white-page { background: #fff !important; color: #000 !important; }
                @page { margin: 0; }
            `;
            document.head.appendChild(style);

            const opt = {
                margin: 0,
                filename: 'swift_transfer.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    letterRendering: true,
                    allowTaint: true,
                    foreignObjectRendering: true,
                    imageTimeout: 0
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                }
            };
            
            // Wait for fonts to load
            document.fonts.ready.then(() => {
                html2pdf()
                    .from(element)
                    .set(opt)
                    .save()
                    .catch(err => {
                        console.error('Error generating PDF:', err);
                        alert('Error generating PDF. Please try again.');
                    });
            });
        });
    }
}); 