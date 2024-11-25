const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const {Patient} = require('./Patient');

const PatientHeartRate = sequelize.define('PatientHeartRate', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Patient,
            key: 'id'
        },
    },
    heart_rate: {
        type: DataTypes.INTEGER, // BPM (beats per minute)
        allowNull: false
    },
    measurement_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'delete'),
        allowNull: false
    },
}, {
    tableName: 'patient_heart_rate',
    timestamps: true
});

module.exports = {
    PatientHeartRate
};
