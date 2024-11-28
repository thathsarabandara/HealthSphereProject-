const { findUserID } = require('../../models/auth/Token');
const { validateUserGroups, UserGroup } = require('../../models/auth/UserGroup');

const authorizeRole = (role) => {
  return async (req, res, next) => {
    let groupID;
    if(role==="patient"){
      groupID=1;
    }else if(role==="doctor"){
      groupID=2;
    }else if(role==="admin"){
      groupId =3;
    }
    try {
      const token = req.cookies['token']; 

      if (!token) {
        return res.status(401).json({ message: 'Anonymous User' });
      }

      const user = await findUserID(token);
      if (!user.user_id) {
        return res.status(401).json({ message: 'Invalid token' });
      }

    const userGroup = await UserGroup.findOne({ where:
      {user_id : user.user_id},      
    })

      // Check if the user has the required role
      if (userGroup.group_id===groupID) {
        return next(); // Proceed to the next middleware if authorized
      }

      return res.status(403).json({ message: 'Access denied' }); // Return 403 if role doesn't match
    } catch (err) {
      console.error('Error finding user groups', err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = { authorizeRole };
