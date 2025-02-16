// backend/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { router: authRouter } = require('./routes/auth');
const usersRouter = require('./routes/users');
const groupsRouter = require('./routes/groups');
const { initializeDB } = require('./db');
const { ensureAdminUser } = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API-Routen
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/groups', groupsRouter);

initializeDB()
  .then(async () => {
    await ensureAdminUser();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Backend-Server läuft auf Port ${port}`));
  })
  .catch(err => {
    console.error("Fehler beim Initialisieren der DB:", err);
  });
