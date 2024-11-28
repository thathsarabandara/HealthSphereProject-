const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const {Patient} = require('../healthcare/Patient');

const PatientBMI = sequelize.define('PatientBMI', {
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
    bmi_value: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    height: {
        type: DataTypes.FLOAT, // Height in cm
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT, // Weight in kg
        allowNull: false
    },
    measurement_date: {
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
    tableName: 'patient_bmi',
    timestamps: true
});

module.exports = {
    PatientBMI
};
