const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { Patient } = require('../healthcare/Patient');
const { Schedule } = require('../healthcare/Schedule');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    patient_id: {
        type: DataTypes.INTEGER,
        references: { model: Patient, key: 'id' },
        allowNull: false,
    },
    schedule_id: {   // link to schedule
        type: DataTypes.INTEGER,
        references: { model: Schedule, key: 'id' },
        allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING },
    payment_date: { type: DataTypes.DATE },
    payment_status: { type: DataTypes.STRING, allowNull: false },
    receipt_number: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'payments',
    timestamps: false,
});

// Associations
Payment.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Payment, { foreignKey: 'patient_id' });

Payment.belongsTo(Schedule, { foreignKey: 'schedule_id' });
Schedule.hasMany(Payment, { foreignKey: 'schedule_id' });

module.exports = { Payment };
