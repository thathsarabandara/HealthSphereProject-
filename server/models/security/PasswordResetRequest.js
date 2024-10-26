const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
const {User} = require('../auth/User');

const PasswordResetRequest = sequelize.define('PasswordResetRequest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    ip_address: {
        type: DataTypes.STRING(45), // Supports IPv6
        allowNull: false,
    },
    user_agent: {
        type: DataTypes.STRING(255), // Stores browser/device information
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(255), // Optional: Can store geographical location (city, country)
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'password_reset_requests', 
    timestamps: false, 
});

const createPasswordResetRequest = async (userid, token, ip, agent, location) => {
    try {
        const expiresAt = new Date(Date.now() + 3600000);

        const newRequest = await PasswordResetRequest.create({
            user_id: userid,
            token: token,
            ip_address: ip,
            user_agent: agent,
            location: location,
            expires_at:expiresAt,
        });
        return newRequest; 
    } catch (error) {
        console.error('Error creating password reset request:', error);
        throw new Error('Failed to create password reset request'); 
    }
};

const findPasswordResetToken = async (token) => {
    try {
        const request = await PasswordResetRequest.findOne({
            where: { token: token }
        });

        // Check if the request was found
        if (!request) {
            throw new Error('Token not found.');
        }

        // Check if the token has expired
        const isExpired = request.expires_at < new Date();
        if (isExpired) {
            throw new Error('Token has expired.');
        }

        return request; // Return the found request
    } catch (error) {
        console.error('Error finding password reset token:', error);
        throw new Error('Failed to find password reset token.');
    }
};


module.exports = {
    PasswordResetRequest,
    createPasswordResetRequest,
    findPasswordResetToken
};
