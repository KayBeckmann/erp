const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const router = express.Router();

const jwtSecret = 'your_jwt_secret'; // In der Produktion in einer Umgebungsvariable speichern

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
    const token = jwt.sign(
      { id: user.id, username: user.username, usergroup: user.usergroup },
      jwtSecret,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Middleware zum Verifizieren des JWT
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

// Route zum Erstellen eines neuen Benutzers (nur Administrator)
router.post('/register', authenticateToken, async (req, res) => {
  if (req.user.usergroup !== 'Administrator') {
    return res.status(403).json({ message: 'Zugriff verweigert' });
  }
  const { username, password, usergroup } = req.body;
  if (!username || !password || !usergroup) {
    return res.status(400).json({ message: 'Fehlende Felder' });
  }
  try {
    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(400).json({ message: 'Benutzer existiert bereits' });
    }
    const newUser = await User.create(username, password, usergroup);
    res.json({
      message: 'Benutzer erstellt',
      user: { id: newUser.id, username: newUser.username, usergroup: newUser.usergroup }
    });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
