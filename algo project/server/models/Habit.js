const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Habit = sequelize.define('Habit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'daily' 
  },

  days: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastCompletedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Habit;
