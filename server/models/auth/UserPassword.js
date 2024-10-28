const { DataTypes } = require("sequelize")
const sequelize = require("../../config/db")
const { User } = require("./User");
const { hashPassword } = require("../../utils/hashpassword");

const UserPassword = sequelize.define('UserPassword', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user_passwords',
    timestamps: true,
  });
  
  const createUserPassword = async (userid, password,) => {
    try {
        const hashedPassword = await hashPassword(password);
        const Password = await UserPassword.create({
            user_id: userid,
            password_hash: hashedPassword,
            isActive: true,
        });
        return Password;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
  };
  const findPassword = async (userId) => {
    try {
        // Look up the user's password by userId and check if isActive is true
        const userPassword = await UserPassword.findOne({
            where: {
                user_id: userId,
                isActive: true // Ensure the user's password record is active
            }
        });

        // Check if a result is found
        if (!userPassword) {
            console.error('Password not found or user is not active');
            return { error: 'Password not found or user is not active' };
        }

        return userPassword; // Return the hashed password or whatever you need
    } catch (err) {
        console.error('Error finding password:', err);
        throw err;
    }
};

    const passwordDeactivate = async (userId) => {
      try {
          const [rowsUpdated] = await UserPassword.update(
              { isActive: false },
              { where: { user_id: userId , isActive: true} }
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
  module.exports = {
    UserPassword,
    createUserPassword,
    passwordDeactivate,
    findPassword
  };