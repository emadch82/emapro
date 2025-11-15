require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("FATAL ERROR: DATABASE_URL is not defined.");
  console.error("This variable should be automatically provided by Liara after connecting your app to a database.");
  console.error("Please go to your Liara dashboard, select this app ('soaa-api'), and connect it to your PostgreSQL database ('soha-pg-db').");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to PostgreSQL', err.stack);
        process.exit(1);
    } else {
        console.log('Successfully connected to PostgreSQL database.');
    }
});


// --- API Endpoints ---
app.get('/', (req, res) => {
  res.send('Soha PostgreSQL API is running!');
});

const TABLES = ['authors', 'podcasts', 'books', 'videos', 'comments', 'posts'];

TABLES.forEach(tableName => {
    app.get(`/api/${tableName}`, async (req, res) => {
        try {
            // Using a client from the pool for a single query
            const result = await pool.query(`SELECT * FROM "${tableName}"`);
            res.json(result.rows);
        } catch (error) {
            console.error(`Error fetching ${tableName}:`, error);
            res.status(500).json({ message: `Failed to fetch ${tableName}` });
        }
    });
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Soha API server is listening on port ${PORT}`);
});