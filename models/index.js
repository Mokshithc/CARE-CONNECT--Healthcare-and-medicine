// models/index.js
const { Sequelize } = require('sequelize');

// Create a Sequelize instance using MySQL connection parameters from .env
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: true  // set to true to see SQL queries in the console
  }
);

const User = require('./user')(sequelize);
const Reminder = require('./reminder')(sequelize);

// A User can have many Reminders; when a user is deleted, cascade delete their reminders.
User.hasMany(Reminder, { onDelete: 'CASCADE' });
Reminder.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Reminder
};
