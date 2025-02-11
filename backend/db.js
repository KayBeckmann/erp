const mysql = require('mysql2/promise');

let connection;

async function initializeDB() {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.MYSQL_USER || 'erp_user',
    password: process.env.MYSQL_PASSWORD || 'erp_password',
    database: process.env.MYSQL_DATABASE || 'erp_db'
  });
  // Tabelle "users" erstellen, falls nicht vorhanden
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      usergroup VARCHAR(50) NOT NULL
    )
  `);
}

function getDB() {
  if (!connection) {
    throw new Error("Datenbank nicht initialisiert");
  }
  return connection;
}

module.exports = { initializeDB, getDB };
