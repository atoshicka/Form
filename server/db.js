const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const useSsl = process.env.DB_SSL !== 'false';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = pool;