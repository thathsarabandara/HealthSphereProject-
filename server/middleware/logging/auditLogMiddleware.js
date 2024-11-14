// middleware/auditLogMiddleware.js
const geoip = require('geoip-lite');
const useragent = require('useragent');
const { AuditLog } = require('../../models/security/AuditLog');
const { Token } = require('../../models/auth/Token');
const { UserGroup } = require('../../models/auth/UserGroup');

const auditLogMiddleware = async (req, res, next) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies ? req.cookies['token'] : null;

    // Default user details
    let userId = null;
    let userRole = 'anon';

    if (token) {
      // Find user ID based on token
      const userToken = await Token.findOne({ where: { token } });
      if (userToken) {
        userId = userToken.user_id;

        // Find user group based on userId
        const userGroupRecord = await UserGroup.findOne({ where: { user_id: userId } });
        if (userGroupRecord) {
          // Map group_id to user roles
          switch (userGroupRecord.group_id) {
            case 1:
              userRole = 'patient';
              break;
            case 2:
              userRole = 'doctor';
              break;
            case 3:
              userRole = 'admin';
              break;
          }
        }
      }
    }

    // Request information
    const { method, originalUrl } = req;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgentInfo = useragent.parse(req.headers['user-agent']);
    const geo = geoip.lookup(ip);

    // Prepare log data
    const action = userId ? 'AUTHENTICATED_ACCESS' : 'ANON_ATTEMPT';
    const location = geo ? `${geo.city || 'N/A'}, ${geo.region || 'N/A'}, ${geo.country || 'N/A'}` : 'Unknown';
    const userAgent = userAgentInfo ? userAgentInfo.toString() : 'Unknown';

    // Insert log entry using the AuditLog Sequelize model
    await AuditLog.create({
      user_id: userId,
      user_role: userRole,
      action: action,
      endpoint: originalUrl,
      method: method,
      ip_address: ip,
      location: location,
      user_agent: userAgent,
      success: true,  // Mark action as successful
    });

  } catch (error) {
    console.error('Failed to log audit information:', error);

    // Log the error attempt if desired
    const fallbackIp = req.ip || req.connection.remoteAddress;
    const fallbackGeo = geoip.lookup(fallbackIp);
    const fallbackLocation = fallbackGeo ? `${fallbackGeo.city || 'N/A'}, ${fallbackGeo.region || 'N/A'}, ${fallbackGeo.country || 'N/A'}` : 'Unknown';
    const fallbackUserAgent = req.headers['user-agent'] ? useragent.parse(req.headers['user-agent']).toString() : 'Unknown';

    await AuditLog.create({
      user_id: null,
      user_role: 'anon',
      action: 'ERROR_LOGGING',
      endpoint: req.originalUrl,
      method: req.method,
      ip_address: fallbackIp,
      location: fallbackLocation,
      user_agent: fallbackUserAgent,
      success: false,
      error_message: error.message
    });
  }

  // Proceed to the next middleware or request handler
  next();
};

module.exports = auditLogMiddleware;
