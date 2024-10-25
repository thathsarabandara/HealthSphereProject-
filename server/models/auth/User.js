const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { hashPassword } = require('../../utils/hashpassword');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    tableName: 'users',
    timestamps: true,
});

// Create user function
const createUser = async (userData) => {
    try {
        const hashedPassword = await hashPassword(userData.password);
        const newUser = await User.create({
            username: userData.username,
            email: userData.email,
            password_hash: hashedPassword,
        });
        return newUser;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
};

// Delete user function
const deleteUser = async (email) => {
    try {
        const deletedUser = await User.destroy({
            where: { email },
        });

        if (deletedUser) {
            console.log('User deleted successfully');
        } else {
            console.log('User not found');
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        throw err;
    }
};

// Find user by ID function
const findUserById = async (userId) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      console.log('User not found.');
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
};

// Update user verification status function
const updateVerify = async (userId) => {
    try {
        const [rowsUpdated] = await User.update(
            { isVerified: true },
            { where: { id: userId } }
        );

        if (rowsUpdated === 0) {
            console.log('User not found or already verified.');
            return null;
        }

        console.log('User verification updated successfully.');
        return rowsUpdated;
    } catch (err) {
        console.error('Error updating user verification:', err);
        throw err;
    }
};

// Find user by email function
const findByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            console.log('User not found with email');
            return null;
        }

        console.log('User found');
        return user;
    } catch (err) {
        console.error('Error finding user by email:', err);
        throw err;
    }
};

module.exports = {
    User,
    createUser,
    findByEmail,
    deleteUser,
    updateVerify,
    findUserById,
};
