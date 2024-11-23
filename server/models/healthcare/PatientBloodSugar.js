const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const {Patient} = require('../healthcare/Patient');

const PatientBloodSugar = sequelize.define('PatientBloodSugar', {
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
    blood_sugar_level: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    measurement_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'patient_blood_sugar',
    timestamps: true
});

module.exports = {
    PatientBloodSugar
};
