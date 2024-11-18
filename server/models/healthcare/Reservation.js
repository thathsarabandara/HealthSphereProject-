const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const {Payment} = require('../transactions/Payment');
const { Schedule } = require('./Schedule');
const { User } = require('../auth/User');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    schedule_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Schedule,
            key: 'id',
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    payment_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Payment,
            key: 'id',
        },
    },
    reservation_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    reservation_time: {
        type: DataTypes.TIME,
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
    tableName: 'reservations',
    timestamps: false,
});

module.exports = {
    Reservation,
};
