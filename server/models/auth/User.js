const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Enforce unique constraint
        validate: {
            isEmail: true,
        },
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

// Create user function
const createUser = async (username, email) => {

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return { error: 'Username already exists' };
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return { error: 'Email already exists' };
        }

        // Build and save the new user
        const newUser = User.create({
            username,
            email,
            isVerified: false, // Default to false
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
            where: {
                email,
                isVerified: true
            },
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

const findbyUsername = async (username) => {
    try {
        const user = await User.findOne({
            where: {
                username,
                isVerified: true
            },
        });        

        if (!user) {
            console.log('User not found with username');
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
    findbyUsername,
};
