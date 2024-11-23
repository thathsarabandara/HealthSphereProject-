const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const {Patient} = require('./Patient');

const PatientCondition = sequelize.define('PatientCondition', {
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
    condition_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('mild', 'moderate', 'severe'),
        allowNull: true
    },
    diagnosis_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'patient_conditions',
    timestamps: true
});

module.exports = {
    PatientCondition
};
