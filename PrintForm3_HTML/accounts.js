const express = require('express');
const router = express.Router();
const pool = require('./database');

// Get accounts
router.get('/api/accounts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM accounts');
        console.log('Fetched accounts:', rows);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ 
            error: 'Database error', 
            details: error.message 
        });
    }
});

// Add account (for testing)
router.post('/api/accounts', async (req, res) => {
    try {
        const { accountName, accountNumber, swiftCode, bankName, bankAddress } = req.body;
        const [result] = await pool.query(
            'INSERT INTO accounts (accountName, accountNumber, swiftCode, bankName, bankAddress) VALUES (?, ?, ?, ?, ?)',
            [accountName, accountNumber, swiftCode, bankName, bankAddress]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error adding account:', error);
        res.status(500).json({ 
            error: 'Database error', 
            details: error.message 
        });
    }
});

// Generate unique transaction reference
function generateTRN() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TRN${year}${month}${day}${random}`;
}

module.exports = router; 