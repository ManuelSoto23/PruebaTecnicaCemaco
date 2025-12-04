const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_DATABASE || "CemacoDB",
  port: parseInt(process.env.DB_PORT || "1433"),
  connectionTimeout: 30000,
  requestTimeout: 30000,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

if (process.env.DB_USER && process.env.DB_PASSWORD) {
  config.user = process.env.DB_USER;
  config.password = process.env.DB_PASSWORD;
} else {
  // Windows Authentication
  config.options.trustedConnection = true;
}

console.log("Database config:", {
  server: config.server,
  database: config.database,
  port: config.port,
  user: config.user || "Windows Auth",
  encrypt: config.options.encrypt,
  trustServerCertificate: config.options.trustServerCertificate,
});

let pool = null;

const getConnection = async () => {
  try {
    if (pool) {
      return pool;
    }
    pool = await sql.connect(config);
    console.log("Connected to SQL Server");
    return pool;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log("Database connection closed");
    }
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
};

module.exports = {
  getConnection,
  closeConnection,
  sql,
};
