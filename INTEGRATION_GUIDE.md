# PrintForm3 HTML Integration Guide

This guide explains how to integrate the HTML version of PrintForm3 with your React application.

## Setup Instructions

1. **Copy the HTML Version to the Public Directory**

   Copy the entire `PrintForm3_HTML` directory to your React application's `public` directory. This makes the HTML version accessible at `/PrintForm3_HTML/index.html`.

   ```bash
   cp -r PrintForm3_HTML/ /path/to/your/react/app/public/
   ```

2. **Install the Required Dependencies**

   The HTML version uses the following libraries:
   - JsBarcode (for barcode generation)
   - html2pdf.js (for PDF generation)

   These are already included via CDN in the HTML file, so no additional installation is needed.

## Integration Options

You have several options for integrating the HTML version with your React application:

### Option 1: Direct Link from SwiftMT103Form

The SwiftMT103Form component now includes a "Print HTML Version" button that opens the HTML version in a new window and passes the form data to it.

This is the simplest integration method and requires no additional setup beyond copying the files to the public directory.

### Option 2: Integration with Print.jsx

The Print.jsx component now includes an option to use the HTML version instead of the React component. When selected, clicking the "Generate FORM3 Receipt" button will open the HTML version in a new window.

### Option 3: Using the Helper Functions

You can use the helper functions in `src/utils/htmlVersionHelper.js` to integrate the HTML version with any component:

```javascript
import { openHtmlVersion } from '../utils/htmlVersionHelper';

// In your component
const handleOpenHtmlVersion = () => {
  const transactionData = {
    // Your transaction data
  };
  
  openHtmlVersion(transactionData);
};
```

## How It Works

The integration works through two main methods:

1. **localStorage**: When opening the HTML version, the transaction data is stored in localStorage under the key `swiftFormData`. The HTML version checks for this data when it loads and uses it to populate the form.

2. **postMessage API**: For more complex integrations, you can use the postMessage API to send data to the HTML version after it has loaded.

## Troubleshooting

- **HTML Version Not Found**: Make sure the `PrintForm3_HTML` directory is in the `public` directory of your React application.
- **Popup Blocked**: If the HTML version doesn't open, check if your browser is blocking popups.
- **Data Not Showing**: Check the browser console for errors. Make sure the transaction data is properly formatted.

## Customization

You can customize the HTML version by editing the files in the `PrintForm3_HTML` directory:

- `index.html`: The HTML structure
- `styles.css`: The CSS styles
- `script.js`: The JavaScript functionality

Remember to rebuild your React application after making changes to the files in the public directory. 