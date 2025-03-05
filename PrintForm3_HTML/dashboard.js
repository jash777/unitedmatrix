document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mt103Form');
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const senderSelect = document.getElementById('senderSelect');

    // Fetch accounts from backend
    async function fetchAccounts() {
        try {
            console.log('Fetching accounts...');
            const response = await fetch('http://localhost:3001/api/accounts');
            if (!response.ok) {
                throw new Error('Failed to fetch accounts');
            }
            const accounts = await response.json();
            console.log('Fetched accounts:', accounts);
            populateAccountsDropdown(accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            alert('Failed to load sender accounts. Please try again later.');
        }
    }

    // Populate accounts dropdown
    function populateAccountsDropdown(accounts) {
        console.log('Populating dropdown with accounts:', accounts);
        senderSelect.innerHTML = '<option value="">-- Select Sender Account --</option>';
        accounts.forEach(account => {
            console.log('Processing account:', account);
            const option = document.createElement('option');
            // Map the database field names to match your schema
            const accountData = {
                accountName: account.AccountName || account.accountName,
                accountNumber: account.AccountNumber || account.accountNumber,
                bankName: account.BankName || account.bankName,
                bankAddress: account.BankAddress || account.bankAddress,
                swiftCode: account.SwiftCode || account.swiftCode
            };
            option.value = JSON.stringify(accountData);
            option.textContent = `${accountData.accountName} - ${accountData.accountNumber}`;
            senderSelect.appendChild(option);
        });
    }

    // Handle account selection
    senderSelect.addEventListener('change', function() {
        if (this.value) {
            try {
                const account = JSON.parse(this.value);
                console.log('Selected account:', account);
                // Update form fields with selected account data
                document.getElementById('senderName').value = account.accountName || '';
                document.getElementById('senderAccountNumber').value = account.accountNumber || '';
                document.getElementById('senderBankName').value = account.bankName || '';
                document.getElementById('senderBankAddress').value = account.bankAddress || '';
                document.getElementById('senderSwiftCode').value = account.swiftCode || '';
            } catch (error) {
                console.error('Error parsing account data:', error);
                alert('Error selecting account. Please try again.');
            }
        } else {
            // Clear fields if no account is selected
            document.getElementById('senderName').value = '';
            document.getElementById('senderAccountNumber').value = '';
            document.getElementById('senderBankName').value = '';
            document.getElementById('senderBankAddress').value = '';
            document.getElementById('senderSwiftCode').value = '';
        }
    });

    // Handle file inputs
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Create preview if it doesn't exist
                    let preview = input.nextElementSibling;
                    if (!preview || !preview.classList.contains('signature-preview')) {
                        preview = document.createElement('img');
                        preview.classList.add('signature-preview');
                        input.parentNode.appendChild(preview);
                    }
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Generate reference numbers
    function generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    // Format date function
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

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate sender account selection only
        if (!senderSelect.value) {
            alert('Please select a sender account');
            return;
        }

        try {
            // Get selected account data
            const selectedAccount = JSON.parse(senderSelect.value);
            console.log('Submitting form with account:', selectedAccount);

            // Collect form data
            const formData = new FormData(form);
            const dateInfo = formatDate(formData.get('valueDate') || new Date());
            
            const data = {
                // Sender information from selected account (required)
                senderAccountName: selectedAccount.accountName,
                senderBankAddress: selectedAccount.bankAddress,
                senderAccountNumber: selectedAccount.accountNumber,
                senderBankName: selectedAccount.bankName,
                senderSwiftCode: selectedAccount.swiftCode,

                // Receiver information (optional)
                receiverAccountName: formData.get('receiverName') || 'N/A',
                receiverBankAddress: formData.get('receiverBankAddress') || 'N/A',
                receiverAccountNumber: formData.get('receiverAccountNumber') || 'N/A',
                receiverBankName: formData.get('receiverBankName') || 'N/A',
                receiverSwiftCode: formData.get('receiverSwiftCode') || 'N/A',

                // Transaction details (optional)
                amount: formData.get('amount') || '0.00',
                currency: formData.get('currency') || 'EUR',
                transactionFullDate: dateInfo.fullDate,
                transactionFullTime: dateInfo.fullTime,
                transactionDateTime: dateInfo.dateTime,
                instructionType: formData.get('instructionType') || 'MT103',

                // Additional information (optional)
                remittanceInfo: formData.get('remittanceInfo') || 'INVESTMENT',
                detailsOfCharges: formData.get('detailsOfCharges') || 'OUR',

                // Generate reference numbers
                referencecode: generateRandomString(12),
                messageReference: generateRandomString(16),
                trackingCode: generateRandomString(10),
                transactionReference: generateRandomString(8),
                
                // Additional generated fields
                networkDeliveryStatus: 'NETWORK DELIVERY',
                prioritydelivery: 'NORMAL',
                messageInputReference: generateRandomString(8),
                messageOutputReference: generateRandomString(8),
                uetrcode: generateRandomString(16),
                swiftMessage: 'MT103',
                swiftCoverageInternalNumber: generateRandomString(10),
                confirmedAck: generateRandomString(8),
                debitAuthorized: generateRandomString(8),
                accountDebited: generateRandomString(8),
                isohk: generateRandomString(6)
            };

            // Duplicate fields for multiple instances
            data.senderAccountName2 = data.senderAccountName;
            data.senderBankAddress2 = data.senderBankAddress;
            data.senderAccountNumber2 = data.senderAccountNumber;
            data.senderBankName2 = data.senderBankName;
            data.senderSwiftCode2 = data.senderSwiftCode;
            data.senderSwiftCode3 = data.senderSwiftCode;
            data.senderSwiftCode4 = data.senderSwiftCode;
            
            data.receiverAccountName2 = data.receiverAccountName;
            data.receiverBankAddress2 = data.receiverBankAddress;
            data.receiverAccountNumber2 = data.receiverAccountNumber;
            data.receiverBankName2 = data.receiverBankName;
            data.receiverSwiftCode2 = data.receiverSwiftCode;
            data.receiverSwiftCode3 = data.receiverSwiftCode;
            data.receiverSwiftCode4 = data.receiverSwiftCode;
            
            data.amount2 = data.amount;
            data.amount3 = data.amount;
            data.amount4 = data.amount;
            data.amount5 = data.amount;
            
            data.currency2 = data.currency;
            data.currency3 = data.currency;
            data.currency4 = data.currency;
            
            data.transactionFullDate2 = data.transactionFullDate;
            data.transactionFullDate3 = data.transactionFullDate;
            data.transactionFullDate4 = data.transactionFullDate;
            
            data.transactionDateTime2 = data.transactionDateTime;
            data.transactionDateTime3 = data.transactionDateTime;
            data.transactionDateTime4 = data.transactionDateTime;
            
            data.remittanceInfo2 = data.remittanceInfo;
            data.detailsOfCharges2 = data.detailsOfCharges;
            
            data.referencecode2 = data.referencecode;
            data.referencecode3 = data.referencecode;
            data.referencecode4 = data.referencecode;

            // Handle file uploads
            const filePromises = Array.from(fileInputs).map(input => {
                return new Promise((resolve) => {
                    const file = input.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const baseKey = input.id;
                            const result = {
                                [baseKey]: e.target.result,
                                [baseKey + '2']: e.target.result,
                                [baseKey + '3']: e.target.result,
                                [baseKey + '4']: e.target.result
                            };
                            resolve(result);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        resolve({[input.id]: null});
                    }
                });
            });

            // Wait for all file uploads to complete
            const fileData = await Promise.all(filePromises);
            fileData.forEach(item => {
                Object.assign(data, item);
            });

            // Show preview in modal
            const modal = document.getElementById('printPreviewModal');
            const previewContainer = document.querySelector('.print-preview-content');
            
            if (previewContainer) {
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '800px';
                iframe.style.border = 'none';
                
                // Create URL parameters
                const params = new URLSearchParams();
                Object.entries(data).forEach(([key, value]) => {
                    if (value) params.append(key, value);
                });

                // Set up iframe load handler
                iframe.onload = function() {
                    // Wait for iframe content to be fully loaded
                    setTimeout(() => {
                        // Show modal after iframe loads
                        modal.style.display = 'block';
                        document.body.style.overflow = 'hidden';

                        // Add action buttons
                        const actionButtons = document.createElement('div');
                        actionButtons.className = 'modal-actions';
                        actionButtons.style.textAlign = 'center';
                        actionButtons.style.marginTop = '10px';
                        actionButtons.innerHTML = `
                            <button class="btn btn-primary" onclick="window.downloadPDF()">Download PDF</button>
                            <button class="btn btn-secondary" onclick="window.printDocument()">Print</button>
                            <button class="btn btn-info" onclick="window.downloadReceipt()">Download Receipt</button>
                        `;
                        previewContainer.appendChild(actionButtons);

                        // Initialize content in iframe
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        if (iframeDoc) {
                            // Create barcode containers
                            ['barcode1', 'barcode2', 'barcode3', 'barcode4'].forEach(id => {
                                const container = iframeDoc.getElementById(id);
                                if (container) {
                                    container.innerHTML = `<div id="${id}Container"></div>`;
                                }
                            });

                            // Add necessary styles
                            const style = iframeDoc.createElement('style');
                            style.textContent = `
                                @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');
                                body { font-family: 'Courier Prime', monospace !important; }
                                .page { margin: 0; padding: 20px; background: #fff; }
                                .black-page { background: #000 !important; color: #fff !important; }
                                .white-page { background: #fff !important; color: #000 !important; }
                                @page { margin: 0; }
                                .barcode-fallback {
                                    padding: 10px;
                                    border: 1px solid #ccc;
                                    text-align: center;
                                    font-family: monospace;
                                }
                            `;
                            iframeDoc.head.appendChild(style);
                        }
                    }, 1000);
                };

                // Set iframe source
                iframe.src = `MT103.html?${params.toString()}`;
                previewContainer.innerHTML = '';
                previewContainer.appendChild(iframe);
            }

        } catch (error) {
            console.error('Error processing form submission:', error);
            alert('Error processing form. Please try again.');
        }
    });

    // Function to load MT103.html content
    async function loadIndexHtml() {
        try {
            const response = await fetch('MT103.html');
            const html = await response.text();
            return html;
        } catch (error) {
            console.error('Error loading MT103.html:', error);
            return null;
        }
    }

    // Print Preview Functions
    function openPrintPreview() {
        const modal = document.getElementById('printPreviewModal');
        
        // Validate sender account selection only
        if (!senderSelect.value) {
            alert('Please select a sender account');
            return;
        }

        try {
            // Get selected account data
            const selectedAccount = JSON.parse(senderSelect.value);
            
            // Get form data
            const formData = new FormData(form);
            const dateInfo = formatDate(formData.get('valueDate') || new Date());
            
            const data = {
                // Sender information from selected account (required)
                senderAccountName: selectedAccount.accountName,
                senderBankAddress: selectedAccount.bankAddress,
                senderAccountNumber: selectedAccount.accountNumber,
                senderBankName: selectedAccount.bankName,
                senderSwiftCode: selectedAccount.swiftCode,

                // Receiver information (optional)
                receiverAccountName: formData.get('receiverName') || 'N/A',
                receiverBankAddress: formData.get('receiverBankAddress') || 'N/A',
                receiverAccountNumber: formData.get('receiverAccountNumber') || 'N/A',
                receiverBankName: formData.get('receiverBankName') || 'N/A',
                receiverSwiftCode: formData.get('receiverSwiftCode') || 'N/A',

                // Transaction details (optional)
                amount: formData.get('amount') || '0.00',
                currency: formData.get('currency') || 'EUR',
                transactionFullDate: dateInfo.fullDate,
                transactionFullTime: dateInfo.fullTime,
                transactionDateTime: dateInfo.dateTime,
                instructionType: formData.get('instructionType') || 'MT103',

                // Additional information (optional)
                remittanceInfo: formData.get('remittanceInfo') || 'INVESTMENT',
                detailsOfCharges: formData.get('detailsOfCharges') || 'OUR',

                // Generate reference numbers
                referencecode: generateRandomString(12),
                messageReference: generateRandomString(16),
                trackingCode: generateRandomString(10),
                transactionReference: generateRandomString(8),
                
                // Additional generated fields
                networkDeliveryStatus: 'NETWORK DELIVERY',
                prioritydelivery: 'NORMAL',
                messageInputReference: generateRandomString(8),
                messageOutputReference: generateRandomString(8),
                uetrcode: generateRandomString(16),
                swiftMessage: 'MT103',
                swiftCoverageInternalNumber: generateRandomString(10),
                confirmedAck: generateRandomString(8),
                debitAuthorized: generateRandomString(8),
                accountDebited: generateRandomString(8),
                isohk: generateRandomString(6)
            };

            // Create URL parameters
            const params = new URLSearchParams();
            Object.entries(data).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            // Load MT103.html in the preview container
            const previewContainer = document.querySelector('.print-preview-content');
            if (previewContainer) {
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '800px';
                iframe.style.border = 'none';
                iframe.src = `MT103.html?${params.toString()}`;
                previewContainer.innerHTML = '';
                previewContainer.appendChild(iframe);
            }

            // Show modal
            modal.style.display = 'block';
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Error generating preview:', error);
            alert('Error generating preview. Please try again.');
        }
    }

    function printDocument() {
        const iframe = document.querySelector('.print-preview-content iframe');
        if (iframe && iframe.contentWindow) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDocument) {
                alert('Please wait for the preview to load before printing');
                return;
            }

            const printWindow = window.open('', '_blank');
            printWindow.document.write('<!DOCTYPE html>');
            printWindow.document.write(iframeDocument.documentElement.outerHTML);
            
            // Add necessary styles
            const style = printWindow.document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');
                body { font-family: 'Courier Prime', monospace !important; }
                .page { margin: 0; padding: 20px; background: #fff; }
                .black-page { background: #000 !important; color: #fff !important; }
                .white-page { background: #fff !important; color: #000 !important; }
                @page { margin: 0; }
                .barcode-fallback {
                    padding: 10px;
                    border: 1px solid #ccc;
                    text-align: center;
                    font-family: monospace;
                }
            `;
            printWindow.document.head.appendChild(style);
            
            // Wait for resources and fonts to load
            printWindow.document.close();
            
            // Add a longer delay to ensure everything loads
            setTimeout(function() {
                printWindow.focus();
                printWindow.print();
                setTimeout(function() {
                    printWindow.close();
                }, 1000);
            }, 2000);
        } else {
            alert('Please wait for the preview to load before printing');
        }
    }

    function downloadPDF() {
        const iframe = document.querySelector('.print-preview-content iframe');
        if (iframe && iframe.contentWindow) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDocument) {
                alert('Please wait for the preview to load before downloading');
                return;
            }

            const element = iframeDocument.documentElement;
            
            // Add necessary styles
            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');
                body { font-family: 'Courier Prime', monospace !important; }
                .page { margin: 0; padding: 20px; background: #fff; }
                .black-page { background: #000 !important; color: #fff !important; }
                .white-page { background: #fff !important; color: #000 !important; }
                @page { margin: 0; }
                .barcode-fallback {
                    padding: 10px;
                    border: 1px solid #ccc;
                    text-align: center;
                    font-family: monospace;
                }
            `;
            element.querySelector('head').appendChild(style);

            // Wait for fonts to load
            document.fonts.ready.then(() => {
                // PDF options
                const opt = {
                    margin: 0,
                    filename: 'MT103_Transfer.pdf',
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

                // Generate PDF with a delay to ensure content is ready
                setTimeout(() => {
                    html2pdf()
                        .from(element)
                        .set(opt)
                        .save()
                        .catch(err => {
                            console.error('Error generating PDF:', err);
                            alert('Error generating PDF. Please try again.');
                        });
                }, 1500);
            });
        } else {
            alert('Please wait for the preview to load before downloading');
        }
    }

    function downloadReceipt() {
        // Show the print preview with MT103.html
        const iframe = document.querySelector('.print-preview-content iframe');
        if (!iframe) {
            openPrintPreview();
        }
    }

    // Close modal function
    function closePrintPreview() {
        const modal = document.getElementById('printPreviewModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Event Listeners for buttons
    document.querySelectorAll('.preview-btn').forEach(button => {
        button.addEventListener('click', openPrintPreview);
    });

    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', downloadPDF);
    });

    document.querySelectorAll('.receipt-btn').forEach(button => {
        button.addEventListener('click', downloadReceipt);
    });

    // Print Preview Modal close button
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', closePrintPreview);
    });

    // Print and Download buttons in modal
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', printDocument);
    }

    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', downloadPDF);
    }

    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', downloadReceipt);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('printPreviewModal');
        if (event.target === modal) {
            closePrintPreview();
        }
    });

    // Update the print preview button click handler in the navbar
    document.querySelector('.print-preview-btn').addEventListener('click', function(e) {
        e.preventDefault();
        openPrintPreview();
    });

    // Fetch accounts when the page loads
    fetchAccounts();

    // Make functions available globally for the action buttons
    window.downloadPDF = downloadPDF;
    window.printDocument = printDocument;
    window.downloadReceipt = downloadReceipt;
}); 