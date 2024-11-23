const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const {Patient} = require('../healthcare/Patient');

const PatientAllergy = sequelize.define('PatientAllergy', {
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
    allergy_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    allergy_type: {
        type: DataTypes.ENUM('food', 'medication', 'environmental', 'other'),
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('mild', 'moderate', 'severe'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'patient_allergies',
    timestamps: true 
});

module.exports = {
    PatientAllergy
};
