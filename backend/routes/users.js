const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Alle Benutzer abrufen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer' });
  }
});

// Neuen Benutzer anlegen – nur Administratoren dürfen dies durchführen
router.post('/', authMiddleware, async (req, res) => {
  if (!req.user.groups.includes('Administrator')) {
    return res.status(403).json({ message: 'Nicht autorisiert' });
  }
  const { username, password, groups } = req.body;
  try {
    const newUser = await User.create({ username, password, groups });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen des Benutzers' });
  }
});

module.exports = router;
