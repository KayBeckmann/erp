const bcrypt = require('bcrypt');
const { getDB } = require('../db');
const saltRounds = 10;

class User {
  constructor(id, username, password, usergroup) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.usergroup = usergroup;
  }

  static async findByUsername(username) {
    const [rows] = await getDB().execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const userData = rows[0];
      return new User(userData.id, userData.username, userData.password, userData.usergroup);
    }
    return null;
  }

  static async create(username, password, usergroup) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await getDB().execute(
      'INSERT INTO users (username, password, usergroup) VALUES (?, ?, ?)',
      [username, hashedPassword, usergroup]
    );
    return new User(result.insertId, username, hashedPassword, usergroup);
  }

  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

// Automatische Erstellung des Admin-Benutzers (admin/admin), falls noch nicht vorhanden
async function ensureAdminUser() {
  const admin = await User.findByUsername('admin');
  if (!admin) {
    await User.create('admin', 'admin', 'Administrator');
    console.log('Admin-Benutzer erstellt (Username: "admin", Passwort: "admin").');
  }
}

module.exports = { User, ensureAdminUser };
