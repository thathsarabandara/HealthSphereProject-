// CartItem model
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { Payment } = require('./Payment');
const { Reservation } = require('../healthcare/Reservation');
const { Cart } = require('../ecommerce/Cart');

const CartPayments = sequelize.define('CarPayment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull:true,
        references: {
            model: Cart,
            key: 'id',
        },
    },
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull:true,
        references: {
            model: Payment,
            key: 'id',
        },
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
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
    tableName: 'cart_payments',
    timestamps: false,
});

module.exports = {
    CartPayments,
};
