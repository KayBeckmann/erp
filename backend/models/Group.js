// backend/models/Group.js
class Group {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static async findAll(connection) {
    const [rows] = await connection.execute('SELECT * FROM groups');
    return rows.map(row => new Group(row.id, row.name, row.description));
  }

  static async create(connection, name, description) {
    const [result] = await connection.execute('INSERT INTO groups (name, description) VALUES (?, ?)', [name, description]);
    return new Group(result.insertId, name, description);
  }

  static async update(connection, id, name, description) {
    await connection.execute('UPDATE groups SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    return new Group(id, name, description);
  }

  static async delete(connection, id) {
    await connection.execute('DELETE FROM groups WHERE id = ?', [id]);
  }
}

module.exports = Group;
