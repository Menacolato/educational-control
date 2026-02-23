// src/config/db.js
const mysql = require("mysql2/promise");

const {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  INSTANCE_CONNECTION_NAME,
} = process.env;

const config = {
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// ✅ Cloud Run + Cloud SQL (socket)
if (INSTANCE_CONNECTION_NAME) {
  config.socketPath = `/cloudsql/${INSTANCE_CONNECTION_NAME}`;
} else {
  // ✅ Local (XAMPP/WAMP/etc.)
  config.host = DB_HOST || "127.0.0.1";
  config.port = Number(DB_PORT || 3306);
}

const pool = mysql.createPool(config);

module.exports = pool;