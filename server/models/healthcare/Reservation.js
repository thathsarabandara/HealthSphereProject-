const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { Schedule } = require('./Schedule');
const { Patient } = require('./Patient');

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
    patient_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Patient,
            key: 'id',
        },
        allowNull: false,
    },
    reservation_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reservation_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reservation_phonenumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reservation_email: {
        type: DataTypes.STRING,
        allowNull: false,
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
    indexes: [
        {
            fields: ['reservation_name'], 
        },
        {
            fields: ['reservation_phonenumber'], 
        },
        {
            fields: ['reservation_email'], 
        },
        {
            fields: ['reservation_date'], 
        },


    ],
});

module.exports = {
    Reservation,
};
