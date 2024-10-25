const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { User } = require('../auth/User');

const Token = sequelize.define('Token', {
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
  type: {
    type: DataTypes.ENUM('regular', 'verify'),
    allowNull: false,
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
  tableName: 'tokens',
  timestamps: false,
  indexes: [
    {
        fields: ['token'],
        unique: true,
    },
],
});
const createToken = async (user_id, token, type = 'regular', expiresIn = 3600) => {
  try {
    const newToken = await Token.create({
      user_id,
      token,
      type,
      expires_at: new Date(Date.now() + expiresIn * 1000), // expiry time in seconds
    });
    return newToken;
  } catch (err) {
    console.error("Error creating token:", err);
    throw err;
  }
};

const createTempToken = async (user_id, token, type = 'verify', expiresIn = 600) => {
  try {
    const newToken = await Token.create({
      user_id,
      token,
      type,
      expires_at: new Date(Date.now() + expiresIn * 1000), // expiry time in seconds
    });
    return newToken;
  } catch (err) {
    console.error("Error creating token:", err);
    throw err;
  }
};

const findToken = async (token, type = 'regular') => {
  try {
    const tokenData = await Token.findOne({
      where: { token, type },
      attributes: ['user_id', 'expires_at'], // Select only relevant attributes
    });

    // Check if token exists and is not expired
    if (tokenData && new Date(tokenData.expires_at) > new Date()) {
      return tokenData.user_id; // Return the user_id if the token is valid
    }

    return null; // Token expired or not found
  } catch (err) {
    console.error("Error finding token:", err);
    return null;
  }
};

const findTempToken = async (token, type = 'verify') => {
  try {
    const tokenData = await Token.findOne({
      where: { token, type },
      attributes: ['user_id', 'expires_at'], // Select only relevant attributes
    });

    // Check if token exists and is not expired
    if (tokenData && new Date(tokenData.expires_at) > new Date()) {
      return tokenData.user_id; // Return the user_id if the token is valid
    }

    return null; // Token expired or not found
  } catch (err) {
    console.error("Error finding token:", err);
    return null;
  }
};


const findUserID = async (token) => {
  if (!token) {
    console.error("Token is required but was not provided.");
    return null;
  }

  try {
    const tokenData = await Token.findOne({
      where: { token },
      attributes: ['user_id','expires_at'], // Retrieve only the user_id
    });
    if (tokenData && new Date(tokenData.expires_at) > new Date()) {
      return tokenData ? tokenData : null; // Return the user_id if the token is valid
    }
    return null;
  } catch (err) {
    console.error("Error finding user ID with token:", token, err);
    return null;
  }
};

const updateExpiredat = async (date, token) => {
  try {
      const [rowsUpdated] = await Token.update(
          { expires_at: date }, // Update the 'expires_at' field
          { where: { token } } // Ensure 'token' is used as a field name in the where condition
      );

      if (rowsUpdated === 0) {
          console.log('Token not found or already updated.');
          return null; // Return null if no rows were updated
      }

      console.log('Token expiration date updated successfully.');
      return rowsUpdated; // Return the number of rows updated
  } catch (err) {
      console.error('Error updating expiration date:', err);
      throw err; // Throw the error for handling upstream
  }
};




module.exports = {
  Token,
  createToken,
  findToken,
  findUserID,
  createTempToken,
  findTempToken,
  updateExpiredat
};
