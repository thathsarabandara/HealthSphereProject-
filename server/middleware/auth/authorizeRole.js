const { findUserID } = require('../../models/auth/Token');
const { validateUserGroups } = require('../../models/auth/UserGroup');

const authorizeRole = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.headers['usertoken']; // Correct way to access the token from headers
      if (!token) {
        return res.status(401).json({ message: 'Anonymous User' });
      }

      const userId = await findUserID(token);
      if (!userId) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const userRoles = await validateUserGroups(userId);

      // Check if the user has the required role
      if (userRoles.includes(role)) {
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
