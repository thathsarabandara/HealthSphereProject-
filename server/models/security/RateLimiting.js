const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const {User} = require('../auth/User');
const {UserGroup} = require('../auth/UserGroup');

const RateLimiting = sequelize.define('RateLimiting', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: UserGroup,
            key: 'id',
        },
        allowNull: false,
    },
    request_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
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
    tableName: 'rate_limiting',
    timestamps: false,
});

module.exports = {
    RateLimiting,
};
