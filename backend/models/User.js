const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

class User extends Model {}

User.init({
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  groups: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['Mitarbeiter']
  }
}, {
  sequelize,
  modelName: 'User'
});

module.exports = { sequelize, User };
