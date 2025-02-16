// backend/models/User.js
const bcrypt = require('bcrypt');
const { getDB } = require('../db');
const saltRounds = 10;

class User {
  constructor(id, username, password, groups, address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.groups = groups; // Array von Gruppen
    this.address = address;
    this.healthInsurance = healthInsurance;
    this.taxNumber = taxNumber;
    this.taxClass = taxClass;
    this.weeklyHours = weeklyHours;
    this.wageSalary = wageSalary;
  }

  static async findByUsername(username) {
    const [rows] = await getDB().execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const userData = rows[0];
      const groups = JSON.parse(userData.groups);
      return new User(
        userData.id,
        userData.username,
        userData.password,
        groups,
        userData.address,
        userData.healthInsurance,
        userData.taxNumber,
        userData.taxClass,
        userData.weeklyHours,
        userData.wageSalary
      );
    }
    return null;
  }

  static async create(username, password, groups = ['Mitarbeiter'], address = '', healthInsurance = '', taxNumber = '', taxClass = '', weeklyHours = 0, wageSalary = 0) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const groupsString = JSON.stringify(groups);
    const [result] = await getDB().execute(
      'INSERT INTO users (username, password, `groups`, address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, groupsString, address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary]
    );
    return new User(result.insertId, username, hashedPassword, groups, address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary);
  }

  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  isInGroup(groupName) {
    return this.groups.includes(groupName);
  }
}

// Automatische Erstellung des Admin-Benutzers (admin/admin) falls nicht vorhanden
async function ensureAdminUser() {
  const admin = await User.findByUsername('admin');
  if (!admin) {
    await User.create('admin', 'admin', ['Admin'], '', '', '', '', 0, 0);
    console.log('Admin-Benutzer erstellt (Username: "admin", Passwort: "admin").');
  }
}

module.exports = { User, ensureAdminUser };
