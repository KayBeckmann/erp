const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const bcrypt = require('bcrypt'); // Hinweis: Im Grundgerüst wird bcrypt nicht verwendet

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }
    
    // Für dieses Grundgerüst wird der Passwortvergleich ohne Hashing durchgeführt.
    // In der Produktion solltest du bcrypt.compare() einsetzen.
    if (password !== user.password) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, groups: user.groups },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

module.exports = router;
