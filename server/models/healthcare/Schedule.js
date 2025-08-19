const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const {Doctor} = require('../healthcare/Doctor');

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Doctor,
            key: 'id',
        },
        allowNull: false,
    },
    schedule_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    schedule_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 50,
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
    },
    fees: {
        type: DataTypes.DECIMAL(10, 2),
    },
    room_number: {
        type: DataTypes.INTEGER,
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
    tableName: 'schedules',
    timestamps: false,
    indexes: [
        {
            fields: ['schedule_date'], 
        },
        {
            fields: ['schedule_time'], 
        },

    ],
});

module.exports = {
    Schedule,
};
