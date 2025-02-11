const mysql = require('mysql2/promise');

let connection;

async function initializeDB() {
  const config = {
    host: process.env.DB_HOST || 'db',
    user: process.env.MYSQL_USER || 'erp_user',
    password: process.env.MYSQL_PASSWORD || 'erp_password',
    database: process.env.MYSQL_DATABASE || 'erp_db'
  };

  let retries = 10;
  while (retries) {
    try {
      connection = await mysql.createConnection(config);
      console.log("Datenbankverbindung erfolgreich aufgebaut.");
      break; // Verbindung erfolgreich, Schleife beenden
    } catch (err) {
      console.error(`Verbindungsversuch fehlgeschlagen. Versuche es erneut in 5 Sekunden... (${retries} verbleibend)`);
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (!connection) {
    throw new Error("Konnte keine Verbindung zur Datenbank herstellen.");
  }

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
