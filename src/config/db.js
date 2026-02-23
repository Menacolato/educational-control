const mysql = require("mysql2/promise");

// Detecta si estamos en Cloud Run con Cloud SQL
// Si INSTANCE_CONNECTION_NAME existe, usamos socket /cloudsql/...
const isCloudSQL = !!process.env.INSTANCE_CONNECTION_NAME;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (isCloudSQL) {
  // ✅ Cloud SQL via Unix socket (Cloud Run)
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
  // ✅ Local / otro host
  config.host = process.env.DB_HOST || "127.0.0.1";
  config.port = Number(process.env.DB_PORT || 3306);
}

const pool = mysql.createPool(config);

module.exports = pool;