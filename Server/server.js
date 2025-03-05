import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { router as accountsRouter } from './src/api/accounts.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'payment_form'
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(join(__dirname, '../dist')));

// Use the accounts router
app.use(accountsRouter);

// API endpoint to generate PDF
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { html } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      scale: 0.8
    });

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// API endpoint to fetch accounts
app.get('/api/accounts', (req, res) => {
  pool.query('SELECT * FROM accounts', (error, results) => {
    if (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
    res.json(results);
  });
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Handle 404s
app.use((req, res) => {
  res.status(404).sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 