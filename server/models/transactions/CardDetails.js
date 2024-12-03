// models/CardDetails.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { Payment } = require('./Payment');

const CardDetails = sequelize.define('CardDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-incrementing primary key
      allowNull: false,
    },
    payment_id:{
      type: DataTypes.INTEGER,
      references:{
        model: Payment,
        key: 'id',
      }
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [13, 19], // Card number length validation
      },
    },
    cardHolderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    csv: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'card_details',
    timestamps: false, // Disable default timestamps
  });

module.exports = {
  CardDetails
};
