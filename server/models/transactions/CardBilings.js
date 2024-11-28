// models/BillingDetails.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { BillingDetails } = require('./BillingDetails');
const CardDetails = require('./CardDetails');

const CardBillings = sequelize.define('BankBillings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-incrementing primary key
      allowNull: false,
    },
    billingDetails_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: BillingDetails,
        key: 'id',
      },
    },
    cardDetails_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: CardDetails,
        key: 'id',
      },
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
    tableName: 'bank_billings',
    timestamps: false,
  });

module.exports = {
    CardBillings
};
