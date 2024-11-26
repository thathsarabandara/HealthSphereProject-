const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const { User } = require('../auth/User');
const { Offer } = require('./Offer');

const UserOffer = sequelize.define('UserOffer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model: User,
        key: 'id',
    }
  },
  offer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model: Offer,
        key: 'id',
    }
  },
}, {
  timestamps: true,
  tableName: 'user_offers',
});

module.exports = { UserOffer };
