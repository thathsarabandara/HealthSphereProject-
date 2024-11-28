const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { User } = require('../auth/User');

const UserBlackList = sequelize.define('UserBlackList', {
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: User, 
      key: 'id', 
    },
  },
  reason: {
    type: DataTypes.ENUM('fraud', 'abuse', 'policy violation', 'other'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active', 
  },
  blacklistedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  expiresAt: {
    type: DataTypes.DATE, 
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'user_blacklists', 
  timestamps: false, 
});

module.exports = {
  UserBlackList
};
