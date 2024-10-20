const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../../config/db');
const {User} = require('../auth/User'); 

const TempToken = sequelize.define('Token', {
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'temp_tokens',
  timestamps: false,
});

const createTempToken = async (user_id, token) =>{
    try{
      const newTempToken =  await TempToken.create({
        user_id: user_id,
        token: token,
        expires_at: new Date(Date.now() + 600 * 1000),
     })
      return newTempToken
    }catch(err){
      throw err;
    }
  }; 

const findTempToken = async (token) => {
    try {
      const query = "SELECT * FROM temp_tokens WHERE token = ?";
      const [results] = await sequelize.query(query, {
        replacements: [token],
        type: sequelize.QueryTypes.SELECT,
      });
      
      // Check if results is undefined or has no entries
      if (!results || results.length === 0) {
        return null; // No token found
      }
      
      // Assuming results[0] exists, check the expiration
      if (new Date(results.expires_at) < new Date(Date.now())) {
        return null; // Token has expired
      }
  
      return results[0]; // Return the valid token
    } catch (err) {
      console.error("Error finding token:", err);
      return null; // Return null in case of error
    }
  };

module.exports = {
    TempToken,
    createTempToken,
    findTempToken
  };