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
        const query = "SELECT user_id FROM temp_tokens WHERE token = ? LIMIT 1";
        const [results] = await sequelize.query(query, {
            replacements: [token],
            type: sequelize.QueryTypes.SELECT,
        });

        // Check if results is undefined or null
        if (!results) {
            console.log('No token found for the provided token:', token);
            return null; // No token found
        }
        return results.user_id; // Return the user_id directly
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