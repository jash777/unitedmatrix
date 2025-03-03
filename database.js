const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '16.171.38.205',
    user: 'alpha',
    password: 'Alpha#777',
    database: 'unitedbankingdashboard',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

module.exports = pool; 