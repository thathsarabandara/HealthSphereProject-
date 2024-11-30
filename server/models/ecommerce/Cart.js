// Cart model
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { CartItem } = require('./CartItem');
const { Patient } = require('../healthcare/Patient');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    patient_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Patient,
            key: 'id',
        },
        allowNull: false,
    },
    cart_item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: CartItem,
            key: 'id',
        },
        allowNull: false,
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        references: {
            model: CartItem,
            key: 'price',
        },
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_price: {
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
    tableName: 'cart',
    timestamps: false,
});

module.exports = {
    Cart,
};
