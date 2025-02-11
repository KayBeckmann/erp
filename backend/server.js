const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const { initializeDB } = require('./db');
const { ensureAdminUser } = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API-Routen
app.use('/api/auth', authRoutes);

initializeDB()
  .then(async () => {
    // Sicherstellen, dass der Admin-Benutzer existiert
    await ensureAdminUser();
    app.listen(3000, () => console.log('Backend-Server läuft auf Port 3000'));
  })
  .catch(err => {
    console.error("Fehler beim Initialisieren der DB:", err);
  });
