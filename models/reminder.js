// models/reminder.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reminder = sequelize.define('Reminder', {
    medication: {
      type: DataTypes.STRING,
      allowNull: false
    },
    schedule: {
      type: DataTypes.STRING,  // Expected format: "HH:mm"
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Reminder;
};
