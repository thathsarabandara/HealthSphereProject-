const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const BankReceipt = sequelize.define('BankReceipt', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false,
    },
    receiptLocation: {
      type: DataTypes.STRING,
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
    tableName: 'bank_receipts',
    timestamps: false, 
  });


module.exports = {
    BankReceipt
};
