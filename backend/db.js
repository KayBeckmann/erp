// backend/db.js
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
      break;
    } catch (err) {
      console.error(`Verbindungsversuch fehlgeschlagen. Versuche es erneut in 5 Sekunden... (${retries} verbleibend)`);
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  
  if (!connection) {
    throw new Error("Konnte keine Verbindung zur Datenbank herstellen.");
  }

  // Erstelle Tabelle "users" mit zusätzlichen Feldern.
  // Achtung: "groups" ist ein reserviertes Wort, daher wird es in Backticks gesetzt.
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      \`groups\` TEXT NOT NULL,
      address VARCHAR(255),
      healthInsurance VARCHAR(255),
      taxNumber VARCHAR(255),
      taxClass VARCHAR(50),
      weeklyHours DECIMAL(5,2),
      wageSalary DECIMAL(10,2)
    )
  `);

  // Erstelle Tabelle "groups" zur Verwaltung der Gruppen.
  // Auch hier wird der Tabellenname in Backticks gesetzt.
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`groups\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description VARCHAR(255)
    )
  `);

  // Initialisiere Standardgruppen, falls nicht vorhanden.
  const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM \`groups\``);
  if (rows[0].count === 0) {
    await connection.execute(`INSERT INTO \`groups\` (name, description) VALUES ('Admin', 'Administratoren'), ('Mitarbeiter', 'Standard Mitarbeiter')`);
  }
}

function getDB() {
  if (!connection) {
    throw new Error("Datenbank nicht initialisiert");
  }
  return connection;
}

module.exports = { initializeDB, getDB };
