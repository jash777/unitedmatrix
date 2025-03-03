import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { router as accountsRouter } from './src/api/accounts.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

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

// Fallback route for any other requests
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving files from: ${__dirname}`);
}); 