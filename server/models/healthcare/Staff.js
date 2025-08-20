const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { User } = require('../auth/User');

const Staff = sequelize.define('Staff', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    address: {
        type: DataTypes.STRING,
    },
    staff_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.ENUM('Nurse', 'Receptionist', 'Lab Technician', 'Pharmacist', 'Admin'),
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    employment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'On Leave'),
        defaultValue: 'Active',
    },
    specialization: {
        type: DataTypes.STRING,
    },
    qualifications: {
        type: DataTypes.STRING,
    },
    emergency_contact: {
        type: DataTypes.STRING,
    },
    emergency_contact_phone: {
        type: DataTypes.STRING,
    },
    profile_picture: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

module.exports = Staff;
