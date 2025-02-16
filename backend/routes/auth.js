// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Login-Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }
    const tokenPayload = {
      id: user.id,
      username: user.username,
      groups: user.groups,
      address: user.address,
      healthInsurance: user.healthInsurance,
      taxNumber: user.taxNumber,
      taxClass: user.taxClass,
      weeklyHours: user.weeklyHours,
      wageSalary: user.wageSalary
    };
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '1h' });
    res.json({ token, user: tokenPayload });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Middleware zur Token-Verifizierung
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post('/register', authenticateToken, async (req, res) => {
  if (!req.user.groups.includes('Admin')) {
    return res.status(403).json({ message: 'Zugriff verweigert' });
  }
  const { username, password, groups, address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary } = req.body;
  if (!username || !password || !groups) {
    return res.status(400).json({ message: 'Fehlende Felder' });
  }
  try {
    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(400).json({ message: 'Benutzer existiert bereits' });
    }
    const newUser = await User.create(username, password, groups, address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary);
    res.json({
      message: 'Benutzer erstellt',
      user: {
        id: newUser.id,
        username: newUser.username,
        groups: newUser.groups,
        address: newUser.address,
        healthInsurance: newUser.healthInsurance,
        taxNumber: newUser.taxNumber,
        taxClass: newUser.taxClass,
        weeklyHours: newUser.weeklyHours,
        wageSalary: newUser.wageSalary
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = { router, authenticateToken };
