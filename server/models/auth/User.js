const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { hashPassword } = require('../../utils/hashpassword');

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
    isVerified:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    tableName: 'users',
    timestamps: true,
});

// Create the user function
const createUser = async (userData) => {
    try {
        const hashedPassword = await hashPassword(userData.password);
        const newUser = await User.create({
            username: userData.username,
            email: userData.email,
            password_hash: hashedPassword, // Ensure this matches your model
        });
        return newUser; // Return the created user
    } catch (err) {
        throw err; // Rethrow the error for handling in the register function
    }
};
const deleteUser = async (email) => {
    try {
        const deletedUser = await User.destroy({
            where: { email: email }  // Delete where the email matches
        });

        if (deletedUser) {
            console.log('User deleted successfully');
        } else {
            console.log('User not found');
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        throw err;  // Re-throw the error to handle it upstream if needed
    }
};

const findByUserId = async (userId) => {
  try {
    const query = "SELECT * FROM users WHERE id = ? LIMIT 1"; // SQL query to find a user by ID
    const [results] = await sequelize.query(query, {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT, // Use SELECT type
    });
    console.log(results)
    // Check if a user was found
    if (!results || results.length === 0) {
      console.log('User not found.');
      return null; // No user found
    }

    console.log('User found successfully.');
    return results; // Return the first user found (as an object)
  } catch (err) {
    console.error('Database error:', err);
    throw err; // Rethrow the error for handling upstream
  }
};


const updateVerify = async (userId) => {
    try {
      const query = "UPDATE users SET isVerified = true WHERE id = ?"; // SQL query to update 'verified' field
      const [results] = await sequelize.query(query, {
        replacements: [userId],
        type: sequelize.QueryTypes.UPDATE, // Use UPDATE type
      });
  
      // Check if the user was updated
      if (results === 0) {
        console.log('User not found or already verified.');
        return null;
      }
  
      console.log('User verification updated successfully.');
      return results; // Return the number of rows affected
    } catch (err) {
      console.error('Database error:', err);
      throw err;
    }
  };

async function findByEmail(email){
  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const [results] = await sequelize.query(query, {
      replacements: [email], 
      type: sequelize.QueryTypes.SELECT, 
    });

    console.log('Results:', results.id); 

    // Check if user is found
    if (results.length === 0) {
      return null; 
    }

   // Get the first result (user object)
    return results; 
  } catch (err) {
    console.error('Database error:', err); 
    throw err; 
  }
};

module.exports = {
    User,
    createUser,
    findByEmail,
    deleteUser,
    updateVerify,
    findByUserId
};
