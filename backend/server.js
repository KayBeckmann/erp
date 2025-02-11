const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sequelize, User } = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Beispiel einer geschützten Route
app.get('/api/protected', require('./middleware/authMiddleware'), (req, res) => {
  res.json({ message: 'Dies ist eine geschützte Route', user: req.user });
});

// Synchronisation der Datenbank und Erzeugung des Admin-Benutzers
sequelize.sync().then(async () => {
  const adminUser = await User.findOne({ where: { username: 'admin' } });
  if (!adminUser) {
    await User.create({ username: 'admin', password: 'admin', groups: ['Administrator'] });
    console.log('Admin-Benutzer erstellt');
  }
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
}).catch(err => {
  console.error('Verbindung zur Datenbank fehlgeschlagen:', err);
});
