// backend/routes/groups.js
const express = require('express');
const Group = require('../models/Group');
const { authenticateToken } = require('./auth');
const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user && req.user.groups && req.user.groups.includes('Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Zugriff verweigert' });
  }
}

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = require('../db').getDB();
    const groups = await Group.findAll(db);
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name der Gruppe fehlt' });
  }
  try {
    const db = require('../db').getDB();
    const newGroup = await Group.create(db, name, description);
    res.json({ message: 'Gruppe erstellt', group: newGroup });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const groupId = req.params.id;
  const { name, description } = req.body;
  try {
    const db = require('../db').getDB();
    const updatedGroup = await Group.update(db, groupId, name, description);
    res.json({ message: 'Gruppe aktualisiert', group: updatedGroup });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const groupId = req.params.id;
  try {
    const db = require('../db').getDB();
    await Group.delete(db, groupId);
    res.json({ message: 'Gruppe gelöscht' });
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
