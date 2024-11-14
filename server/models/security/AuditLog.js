const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const { User } = require('../auth/User');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Nullable to allow anonymous attempts
        references: {
            model: User,
            key: 'id',
        },
    },
    user_role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'anon',  // Default role for anonymous users
    },
    action: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    endpoint: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    method: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true,  // Nullable if location data is unavailable
    },
    user_agent: {
        type: DataTypes.STRING(255),
        allowNull: true,  // Nullable if user agent data is unavailable
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    success: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,  // Indicates if the action was successful
    },
    error_message: {
        type: DataTypes.STRING(255),
        allowNull: true,     // Optional, stores error message if action fails
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true,  // Additional details about the action if needed
    },
}, {
    tableName: 'audit_logs',
    timestamps: false,
});

module.exports = {
    AuditLog,
};
