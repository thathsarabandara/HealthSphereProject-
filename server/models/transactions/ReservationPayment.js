// CartItem model
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { Payment } = require('./Payment');
const { Reservation } = require('../healthcare/Reservation');

const ReservationPayment = sequelize.define('ReservationPayment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull:true,
        references: {
            model: Payment,
            key: 'id',
        },
    },
    reservation_id: {
        type: DataTypes.INTEGER,
        allowNull:true,
        references: {
            model: Reservation,
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
    tableName: 'reservation_payments',
    timestamps: false,
});

module.exports = {
    ReservationPayment,
};
