const { Op } = require('sequelize');
const { Token } = require('../../models/auth/Token');
const { User } = require('../../models/auth/User');
const { UserGroup } = require('../../models/auth/UserGroup');

const adminAuthMiddleware = async (req, res, next) => {
  const token = req.cookies['adminToken'];

  // Check if token exists in the request
  if (!token) {
    return res.status(401).json({ message: 'No Valid Token Found ,Please Login first!' });
  }

  try {
    // Validate the token using the async function
    const isTokenValid = await Token.findOne({
        where: {
            token,
            expires_at: { [Op.gt]: new Date() } // Check token validity
        }
    });

    if (isTokenValid === null) {
      return res.status(401).json({ message: 'Token Expired Please Login again' });
    }

    const user = await User.findOne({where:{
        id:isTokenValid.user_id,
    }})

    if (!user) {
        return res.status(401).json({ message: 'Unregistered user, Registered first' });
    }

    if (user.isVerified == false) {
        return res.status(401).json({ message: 'User is not verified Register again' });
    }

    const userGroup = await UserGroup.findOne({where:{
        user_id: user.id
    }})

    if(userGroup.group_id != 3){
        return res.status(401).json({ message: 'User is not verified Doctor' });
    }
    
    req.userID = user.id;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
    adminAuthMiddleware
};
