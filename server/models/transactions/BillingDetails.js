// models/BillingDetails.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { Payment } = require('./Payment');

const BillingDetails = sequelize.define('BillingDetails', {
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
    indexes: [
      {
          fields: ['fullName'], 
      },
      {
          fields: ['phoneNumber'], 
      },
      {
          fields: ['email'], 
      },
    ],

  });

module.exports = {
    BillingDetails
};
