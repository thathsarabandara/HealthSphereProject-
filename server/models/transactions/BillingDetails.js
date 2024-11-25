// models/BillingDetails.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const CardDetails = require('./CardDetails');
const { BankReceipt } = require('./BankReciept');

const BillingDetails = sequelize.define('BillingDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-incrementing primary key
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    cardDetailsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: CardDetails,
        key: 'id',
      },
    },
    bankReceiptId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: BankReceipt,
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
    tableName: 'billing_details',
    timestamps: false, // Disable default timestamps
  });

module.exports = {
    BillingDetails
};
