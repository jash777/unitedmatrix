import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { router as accountsRouter } from './src/api/accounts.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://app.unitedmatrix.org',
      'https://app.unitedmatrix.org',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
    
    if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Enable CORS with specific options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON bodies with increased limit
app.use(express.json({ limit: '50mb' }));

// Serve static files from the root directory
app.use(express.static(__dirname));

// Use the accounts router
app.use(accountsRouter);

// API endpoint to fetch accounts
app.get('/api/accounts', async (req, res) => {
  try {
    // Create connection using environment variables
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    
    // Query to get all accounts
    const [rows] = await connection.execute('SELECT * FROM Accounts');
    
    // Close the connection
    await connection.end();
    
    // Return the accounts as JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Root route to serve payments.html
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'payments.html'));
});

// PDF generation endpoint
app.post('/generate-pdf', cors(corsOptions), async (req, res) => {
  let browser;
  try {
    const { html, options } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'Missing HTML content' });
    }
    
    // Launch browser with specific settings
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--allow-file-access-from-files'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport to match A4 size
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      deviceScaleFactor: 2
    });

    // Enable request interception for handling local resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('dblogo.png')) {
        // Modify the request URL for the logo
        request.continue({
          url: 'file://' + path.resolve(__dirname, 'src/assets/dblogo.png')
        });
      } else {
        request.continue();
      }
    });

    // Set content and wait for everything to load
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded']
    });

    // Generate PDF with specific settings
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
      scale: 1,
      height: '370mm',
      width: '210mm'
    });

    // Log the size of the generated PDF
    console.log('Generated PDF size:', pdf.length, 'bytes');

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=Print_Receipt.pdf');
    res.setHeader('Content-Length', pdf.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache');

    // Send the PDF
    res.end(pdf);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Fallback route for any other requests
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving files from: ${__dirname}`);
});