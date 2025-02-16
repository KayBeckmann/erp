// backend/routes/users.js
const express = require('express');
const { User } = require('../models/User');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Middleware, die nur Admins durchlässt
function requireAdmin(req, res, next) {
  if (req.user && req.user.groups && req.user.groups.includes('Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Zugriff verweigert' });
  }
}

// GET /api/users - Liste aller Benutzer
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = require('../db').getDB();
    const [rows] = await db.execute('SELECT * FROM users');
    const users = rows.map(userData => ({
      id: userData.id,
      username: userData.username,
      groups: JSON.parse(userData.groups),
      address: userData.address,
      healthInsurance: userData.healthInsurance,
      taxNumber: userData.taxNumber,
      taxClass: userData.taxClass,
      weeklyHours: userData.weeklyHours,
      wageSalary: userData.wageSalary
    }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// POST /api/users - Neuen Benutzer anlegen
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
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

// PUT /api/users/:id - Benutzer aktualisieren
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const userId = req.params.id;
  const { groups, address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary } = req.body;
  try {
    const db = require('../db').getDB();
    await db.execute(
      'UPDATE users SET `groups` = ?, address = ?, healthInsurance = ?, taxNumber = ?, taxClass = ?, weeklyHours = ?, wageSalary = ? WHERE id = ?',
      [JSON.stringify(groups), address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary, userId]
    );
    res.json({ message: 'Benutzer aktualisiert' });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// DELETE /api/users/:id - Benutzer löschen
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const db = require('../db').getDB();
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Benutzer gelöscht' });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
