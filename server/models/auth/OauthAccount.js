const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const OauthAccount = sequelize.define('OauthAccount', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  provider_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'oauth_accounts'
});

module.exports = OauthAccount;
